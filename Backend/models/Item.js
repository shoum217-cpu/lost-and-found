import mongoose from 'mongoose';

const itemSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
    },
    type: {
      type: String,
      required: true,
      enum: ['LOST', 'FOUND', 'lost', 'found'],
      set: v => v ? v.toUpperCase() : v,
    },
    location: {
      type: String,
      required: [true, 'Please specify a location'],
    },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    image: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    brand: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    itemType: {
      type: String,
      default: '',
    },
    distinguishingFeatures: {
      type: String,
      default: '',
    },
    keywords: {
      type: [String],
      default: [],
    },
    // Ownership questions provided by the reporter (Strictly hidden from public queries)
    ownershipQuestions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }, // PRIVATE: never sent in public API responses
      }
    ],
    allowWhatsapp: {
      type: Boolean,
      default: false,
    },
    contactPhone: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      required: true,
      enum: ['ACTIVE', 'CLAIMED', 'RETURNED', 'open', 'claimed', 'returned'],
      default: 'ACTIVE',
      set: v => v ? v.toUpperCase() : v,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    reporterName: {
      type: String,
      default: 'Anonymous',
    },
  },
  {
    timestamps: true,
  }
);

// Index for search optimization
itemSchema.index({ title: 'text', description: 'text', brand: 'text', location: 'text' });

const Item = mongoose.model('Item', itemSchema);
export default Item;
