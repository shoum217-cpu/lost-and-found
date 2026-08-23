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

    // Verify requesting user is finder or item creator
    const isFinder = claim.finder && claim.finder.toString() === req.user._id.toString();
    const isItemCreator = item && item.createdBy && item.createdBy.toString() === req.user._id.toString();

    if (!isFinder && !isItemCreator && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to request verification for this claim' });
    }

    // Compile questions for claimant (use item questions if defined, or generate standard smart questions)
    let questions = [];
    if (item && item.ownershipQuestions && item.ownershipQuestions.length > 0) {
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
      item: item ? item._id : undefined,
      claim: claim._id,
      link: `/claims/${claim._id}`,
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
    if (item && item.ownershipQuestions && item.ownershipQuestions.length > 0) {
      truthPairs = item.ownershipQuestions;
    } else if (item) {
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
          item: item ? item._id : undefined,
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
        item: item ? item._id : undefined,
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
        item: item ? item._id : undefined,
        claim: claim._id,
        link: `/claims/${claim._id}`,
      });

      if (claim.finder) {
        await Notification.create({
          recipient: claim.finder,
          type: 'VERIFICATION_FAILED',
          title: 'Verification Unsuccessful for Claimant',
          message: `The claimant attempted verification for "${item ? item.title : 'the item'}" but did not meet the confidence threshold.`,
          item: item ? item._id : undefined,
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
      claim,
    });
  } catch (error) {
    console.error('Error in submitVerificationAnswers:', error);
    return res.status(500).json({ message: 'Server error evaluating verification' });
  }
};

// @desc    Approve claim (Finder only)
// @route   POST /api/claims/:id/approve
// @access  Private (Finder only)
export const approveClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('item');
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const item = claim.item;
    const isFinder = claim.finder && claim.finder.toString() === req.user._id.toString();
    const isItemCreator = item && item.createdBy && item.createdBy.toString() === req.user._id.toString();

    if (!isFinder && !isItemCreator && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to approve this claim' });
    }

    claim.status = 'VERIFIED';
    claim.verifiedAt = new Date();
    await claim.save();

    if (item) {
      item.status = 'CLAIMED';
      await item.save();
    }

    // Notify claimant
    await Notification.create({
      recipient: claim.claimant,
      type: 'VERIFICATION_PASSED',
      title: 'Claim Approved!',
      message: `Your claim on "${item ? item.title : 'the item'}" has been approved by the finder.`,
      item: item ? item._id : undefined,
      claim: claim._id,
      link: `/claims/${claim._id}`,
    });

    return res.json({
      success: true,
      message: 'Claim approved successfully',
      claim,
    });
  } catch (error) {
    console.error('Error in approveClaim:', error);
    return res.status(500).json({ message: 'Server error approving claim' });
  }
};

// @desc    Reject claim (Finder only)
// @route   POST /api/claims/:id/reject
// @access  Private (Finder only)
export const rejectClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('item');
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const item = claim.item;
    const isFinder = claim.finder && claim.finder.toString() === req.user._id.toString();
    const isItemCreator = item && item.createdBy && item.createdBy.toString() === req.user._id.toString();

    if (!isFinder && !isItemCreator && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to reject this claim' });
    }

    claim.status = 'REJECTED';
    await claim.save();

    // Notify claimant
    await Notification.create({
      recipient: claim.claimant,
      type: 'VERIFICATION_FAILED',
      title: 'Claim Declined',
      message: `Your claim on "${item ? item.title : 'the item'}" was declined by the finder.`,
      item: item ? item._id : undefined,
      claim: claim._id,
      link: `/claims/${claim._id}`,
    });

    return res.json({
      success: true,
      message: 'Claim rejected',
      claim,
    });
  } catch (error) {
    console.error('Error in rejectClaim:', error);
    return res.status(500).json({ message: 'Server error rejecting claim' });
  }
};

// @desc    Get details of a claim
// @route   GET /api/claims/:id
// @access  Private
export const getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('item')
      .populate('claimant', 'name email phone whatsappEnabled')
      .populate('finder', 'name email phone whatsappEnabled');

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const claimantId = claim.claimant?._id ? claim.claimant._id.toString() : claim.claimant?.toString();
    const finderId = claim.finder?._id ? claim.finder._id.toString() : claim.finder?.toString();
    const itemCreatorId = claim.item?.createdBy?.toString();
    const currentUserId = req.user._id.toString();

    const isClaimant = claimantId === currentUserId;
    const isFinder = finderId === currentUserId;
    const isItemCreator = itemCreatorId === currentUserId;

    if (!isClaimant && !isFinder && !isItemCreator && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this claim' });
    }

    const claimObj = claim.toObject();

    // Privacy & Security: If viewer is claimant and not finder/item creator, sanitize item ownership question answers
    if (!isFinder && !isItemCreator && req.user.role !== 'admin') {
      if (claimObj.item && Array.isArray(claimObj.item.ownershipQuestions)) {
        claimObj.item.ownershipQuestions = claimObj.item.ownershipQuestions.map(q => ({
          _id: q._id,
          question: q.question,
        }));
      }
    }

    return res.json(claimObj);
  } catch (error) {
    console.error('Error in getClaimById:', error);
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
      .populate('finder', 'name email phone')
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
    console.error('Error in getMyClaims:', error);
    return res.status(500).json({ message: 'Server error retrieving claims' });
  }
};
