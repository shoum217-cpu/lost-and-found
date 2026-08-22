import Claim from '../models/Claim.js';
import Item from '../models/Item.js';
import Notification from '../models/Notification.js';
import { verifyAnswersWithAI } from './aiController.js';

// @desc    Submit initial claim on an item
// @route   POST /api/claims
// @access  Private
export const createClaim = async (req, res) => {
  try {
    const { itemId, message } = req.body;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user already submitted a claim
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimant: req.user._id,
      status: { $ne: 'REJECTED' },
    });

    if (existingClaim) {
      return res.status(400).json({ message: 'You have already submitted a claim for this item' });
    }

    const claim = await Claim.create({
      item: itemId,
      claimant: req.user._id,
      claimantName: req.user.name,
      claimantEmail: req.user.email,
      finder: item.createdBy,
      status: 'PENDING',
      initialMessage: message || 'I believe this is my item.',
    });

    // Notify finder if finder is registered
    if (item.createdBy) {
      await Notification.create({
        recipient: item.createdBy,
        type: 'CLAIM_SUBMITTED',
        title: 'New Claim Received',
        message: `${req.user.name} submitted a claim on "${item.title}".`,
        item: item._id,
        claim: claim._id,
        link: `/claims/${claim._id}`,
      });
    }

    return res.status(201).json({
      success: true,
      claim,
    });
  } catch (error) {
    console.error('Error in createClaim:', error);
    return res.status(500).json({ message: 'Server error creating claim' });
  }
};

// @desc    Finder requests proof of ownership (Step 2 & 3: Looking Sus)
// @route   POST /api/claims/:id/request-verification
// @access  Private (Finder only)
export const requestVerification = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('item');
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const item = claim.item;

    // Compile questions for claimant (use item questions if defined, or generate standard smart questions)
    let questions = [];
    if (item.ownershipQuestions && item.ownershipQuestions.length > 0) {
      questions = item.ownershipQuestions.map(q => ({
        question: q.question,
        answer: '',
      }));
    } else {
      // Default smart verification questions based on category
      questions = [
        { question: 'What distinguishing mark, scratch, or unique feature is present on the item?', answer: '' },
        { question: 'What specific contents, serial number, or accessory was attached to this item?', answer: '' },
        { question: 'Where and approximately at what time did you lose this item?', answer: '' },
      ];
    }

    claim.status = 'VERIFICATION_REQUESTED';
    claim.verificationQuestions = questions;
    await claim.save();

    // Step 3: Notify claimant with professional, neutral wording
    await Notification.create({
      recipient: claim.claimant,
      type: 'VERIFICATION_REQUESTED',
      title: '⚠️ Ownership verification requested',
      message: 'The finder has requested additional verification before proceeding with the return of this item.',
      item: item._id,
      claim: claim._id,
      link: `/claims/${claim._id}/verify`,
    });

    return res.json({
      success: true,
      message: 'Verification request sent to claimant.',
      claim,
    });
  } catch (error) {
    console.error('Error in requestVerification:', error);
    return res.status(500).json({ message: 'Server error requesting verification' });
  }
};

// @desc    Claimant submits verification answers (Step 4 & 5)
// @route   POST /api/claims/:id/submit-answers
// @access  Private (Claimant only)
export const submitVerificationAnswers = async (req, res) => {
  try {
    const { answers } = req.body; // Array of { question, answer }
    const claim = await Claim.findById(req.params.id).populate('item');

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (claim.claimant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to submit answers for this claim' });
    }

    const item = claim.item;

    // Get ground truth questions & answers (if set on item) or item metadata
    let truthPairs = [];
    if (item.ownershipQuestions && item.ownershipQuestions.length > 0) {
      truthPairs = item.ownershipQuestions;
    } else {
      // Fallback truth comparison with item description & distinguishingFeatures
      truthPairs = [
        {
          question: 'What distinguishing mark, scratch, or unique feature is present on the item?',
          answer: item.distinguishingFeatures || item.description || item.color || '',
        },
        {
          question: 'What specific contents, serial number, or accessory was attached to this item?',
          answer: item.brand || item.itemType || item.description || '',
        },
        {
          question: 'Where and approximately at what time did you lose this item?',
          answer: item.location || '',
        },
      ];
    }

    // Step 5: Evaluate with AI + rule-based verification
    const verificationResult = await verifyAnswersWithAI(truthPairs, answers);

    claim.verificationQuestions = answers;
    claim.verificationScore = verificationResult.confidence;
    claim.questionBreakdown = verificationResult.breakdown;
    claim.status = verificationResult.isVerified ? 'VERIFIED' : 'FAILED';
    claim.verifiedAt = new Date();
    claim.verificationFeedback = verificationResult.feedback;
    await claim.save();

    // Step 6 / 7: Notify finder and claimant
    if (verificationResult.isVerified) {
      // Notify Finder
      if (claim.finder) {
        await Notification.create({
          recipient: claim.finder,
          type: 'VERIFICATION_PASSED',
          title: '✓ Ownership verified',
          message: 'The claimant successfully answered the ownership verification questions. You can now proceed with the return.',
          item: item._id,
          claim: claim._id,
          link: `/claims/${claim._id}`,
        });
      }

      // Notify Claimant
      await Notification.create({
        recipient: claim.claimant,
        type: 'VERIFICATION_PASSED',
        title: '✓ Ownership verified',
        message: 'Your verification was successful. The finder has been notified.',
        item: item._id,
        claim: claim._id,
        link: `/claims/${claim._id}`,
      });
    } else {
      // Verification Failed - Keep answers hidden
      await Notification.create({
        recipient: claim.claimant,
        type: 'VERIFICATION_FAILED',
        title: 'Verification unsuccessful',
        message: 'The information provided did not sufficiently match the ownership details.',
        item: item._id,
        claim: claim._id,
        link: `/claims/${claim._id}`,
      });

      if (claim.finder) {
        await Notification.create({
          recipient: claim.finder,
          type: 'VERIFICATION_FAILED',
          title: 'Verification Unsuccessful for Claimant',
          message: `The claimant attempted verification for "${item.title}" but did not meet the confidence threshold.`,
          item: item._id,
          claim: claim._id,
          link: `/claims/${claim._id}`,
        });
      }
    }

    return res.json({
      success: true,
      status: claim.status,
      confidence: verificationResult.confidence,
      isVerified: verificationResult.isVerified,
      breakdown: verificationResult.breakdown,
      feedback: verificationResult.feedback,
    });
  } catch (error) {
    console.error('Error in submitVerificationAnswers:', error);
    return res.status(500).json({ message: 'Server error evaluating verification' });
  }
};

// @desc    Get details of a claim
// @route   GET /api/claims/:id
// @access  Private
export const getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('item')
      .populate('claimant', 'name email phone')
      .populate('finder', 'name email phone');

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const isClaimant = req.user && claim.claimant && claim.claimant._id.toString() === req.user._id.toString();
    const isFinder = req.user && claim.finder && claim.finder._id.toString() === req.user._id.toString();

    if (!isClaimant && !isFinder && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this claim' });
    }

    return res.json(claim);
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving claim' });
  }
};

// @desc    Get claims for current user (claims made or claims received)
// @route   GET /api/claims
// @access  Private
export const getMyClaims = async (req, res) => {
  try {
    const madeClaims = await Claim.find({ claimant: req.user._id })
      .populate('item')
      .sort({ createdAt: -1 });

    const receivedClaims = await Claim.find({ finder: req.user._id })
      .populate('item')
      .populate('claimant', 'name email phone')
      .sort({ createdAt: -1 });

    return res.json({
      claimsMade: madeClaims,
      claimsReceived: receivedClaims,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving claims' });
  }
};
