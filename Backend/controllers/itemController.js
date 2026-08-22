import Item from '../models/Item.js';
import Notification from '../models/Notification.js';
import { calculateItemMatch } from './aiController.js';

// Helper to sanitize item for public consumption (strip private ownership answers)
export const sanitizeItem = (item, requestingUserId = null) => {
  const obj = item.toObject ? item.toObject() : { ...item };

  const isOwner = requestingUserId && obj.createdBy && obj.createdBy.toString() === requestingUserId.toString();

  // If not the owner, never send the answers to ownership questions
  if (!isOwner && obj.ownershipQuestions && Array.isArray(obj.ownershipQuestions)) {
    obj.ownershipQuestions = obj.ownershipQuestions.map(q => ({
      _id: q._id,
      question: q.question,
      // answer is excluded
    }));
  }

  // Never leak contactPhone unless allowWhatsapp is true, and even then format as WhatsApp safe trigger
  if (!obj.allowWhatsapp) {
    delete obj.contactPhone;
  }

  return obj;
};

// @desc    Get all items with filtering and search
// @route   GET /api/items
// @access  Public
export const getItems = async (req, res) => {
  try {
    const { type, category, query, status, limit = 50, page = 1 } = req.query;
    const filter = {};

    if (type && type.toLowerCase() !== 'all') {
      filter.type = type.toUpperCase();
    }

    if (category && category.toLowerCase() !== 'all') {
      filter.category = category;
    }

    if (status && status.toLowerCase() !== 'all') {
      filter.status = status.toUpperCase();
    }

    if (query) {
      const q = query.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { color: { $regex: q, $options: 'i' } },
      ];
    }

    const currentUserId = req.user ? req.user._id : null;
    const skip = (Number(page) - 1) * Number(limit);

    const items = await Item.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Item.countDocuments(filter);

    const sanitized = items.map(item => sanitizeItem(item, currentUserId));

    return res.json({
      items: sanitized,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalItems: total,
    });
  } catch (error) {
    console.error('Error in getItems:', error);
    return res.status(500).json({ message: 'Server error retrieving items' });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const currentUserId = req.user ? req.user._id : null;
    const sanitized = sanitizeItem(item, currentUserId);

    return res.json(sanitized);
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving item' });
  }
};

// @desc    Create new lost or found item
// @route   POST /api/items
// @access  Public (Optional auth)
export const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      location,
      date,
      image,
      images,
      brand,
      color,
      itemType,
      distinguishingFeatures,
      keywords,
      ownershipQuestions,
      allowWhatsapp,
      contactPhone,
      coordinates,
      reporterName,
    } = req.body;

    if (!title || !description || !category || !type || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Default coordinates generator if missing (e.g., approximate coordinates)
    let itemCoordinates = coordinates;
    if (!itemCoordinates || !itemCoordinates.lat || !itemCoordinates.lng) {
      // Provide clean default base coordinates (e.g. Bangalore center + small jitter for privacy)
      const baseLat = 12.9716;
      const baseLng = 77.5946;
      const jitterLat = (Math.random() - 0.5) * 0.04;
      const jitterLng = (Math.random() - 0.5) * 0.04;
      itemCoordinates = {
        lat: Number((baseLat + jitterLat).toFixed(4)),
        lng: Number((baseLng + jitterLng).toFixed(4)),
      };
    }

    const newItem = await Item.create({
      title,
      description,
      category,
      type: type.toUpperCase(),
      location,
      date: date || new Date(),
      image: image || (images && images[0]) || '',
      images: images || (image ? [image] : []),
      brand: brand || '',
      color: color || '',
      itemType: itemType || '',
      distinguishingFeatures: distinguishingFeatures || '',
      keywords: keywords || [],
      ownershipQuestions: Array.isArray(ownershipQuestions) ? ownershipQuestions : [],
      allowWhatsapp: Boolean(allowWhatsapp),
      contactPhone: contactPhone || '',
      coordinates: itemCoordinates,
      createdBy: req.user ? req.user._id : null,
      reporterName: reporterName || (req.user ? req.user.name : 'Anonymous Reporter'),
      status: 'ACTIVE',
    });

    // Auto-search for matches in opposite pool
    const oppositeType = newItem.type === 'LOST' ? 'FOUND' : 'LOST';
    const candidateItems = await Item.find({
      type: oppositeType,
      status: 'ACTIVE',
    }).limit(20);

    const matches = candidateItems
      .map(candidate => {
        const matchData = calculateItemMatch(newItem, candidate);
        return {
          item: sanitizeItem(candidate, req.user ? req.user._id : null),
          score: matchData.score,
          reasons: matchData.reasons,
        };
      })
      .filter(m => m.score >= 50)
      .sort((a, b) => b.score - a.score);

    // If matches found and user is authenticated, create notification
    if (matches.length > 0 && req.user) {
      await Notification.create({
        recipient: req.user._id,
        type: 'MATCH_FOUND',
        title: `Potential Match Found (${matches[0].score}% Match)`,
        message: `We found ${matches.length} potential matching item(s) for your ${newItem.title}.`,
        item: newItem._id,
        link: `/matches/${newItem._id}`,
      });
    }

    return res.status(201).json({
      success: true,
      item: sanitizeItem(newItem, req.user ? req.user._id : null),
      matches,
    });
  } catch (error) {
    console.error('Error in createItem:', error);
    return res.status(500).json({ message: error.message || 'Server error creating item' });
  }
};

// @desc    Get potential AI matches for an item
// @route   GET /api/items/:id/matches
// @access  Public
export const getItemMatches = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const oppositeType = item.type === 'LOST' ? 'FOUND' : 'LOST';
    const candidateItems = await Item.find({
      type: oppositeType,
      status: 'ACTIVE',
    }).limit(30);

    const currentUserId = req.user ? req.user._id : null;

    const matches = candidateItems
      .map(candidate => {
        const matchData = calculateItemMatch(item, candidate);
        return {
          item: sanitizeItem(candidate, currentUserId),
          score: matchData.score,
          reasons: matchData.reasons,
        };
      })
      .filter(m => m.score >= 40)
      .sort((a, b) => b.score - a.score);

    return res.json({
      targetItem: sanitizeItem(item, currentUserId),
      matches,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error calculating matches' });
  }
};

// @desc    Get WhatsApp Contact Link for an item
// @route   GET /api/items/:id/whatsapp
// @access  Public
export const getWhatsAppLink = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (!item.allowWhatsapp || !item.contactPhone) {
      return res.status(400).json({ message: 'Finder has not enabled WhatsApp contact for this listing.' });
    }

    // Clean phone number (strip spaces, dashes, parentheses)
    const cleanPhone = item.contactPhone.replace(/[^0-9+]/g, '').replace(/^0+/, '');
    const message = encodeURIComponent(
      `Hi, I think I may have found my lost item through your FindIt listing ("${item.title}"). Could we verify a few details?`
    );

    const waUrl = `https://wa.me/${cleanPhone}?text=${message}`;

    return res.json({
      whatsappUrl: waUrl,
      allowed: true,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error generating WhatsApp link' });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership if item has createdBy
    if (item.createdBy && (!req.user || item.createdBy.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    const fields = [
      'title',
      'description',
      'category',
      'status',
      'location',
      'brand',
      'color',
      'distinguishingFeatures',
      'allowWhatsapp',
      'contactPhone',
    ];

    fields.forEach(f => {
      if (req.body[f] !== undefined) item[f] = req.body[f];
    });

    const updatedItem = await item.save();
    return res.json(sanitizeItem(updatedItem, req.user ? req.user._id : null));
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating item' });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.createdBy && (!req.user || item.createdBy.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    return res.json({ message: 'Item removed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error deleting item' });
  }
};

// @desc    Get current user's items
// @route   GET /api/items/my
// @access  Private
export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    const sanitized = items.map(item => sanitizeItem(item, req.user._id));
    return res.json(sanitized);
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving user items' });
  }
};
