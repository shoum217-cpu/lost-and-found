import mongoose from 'mongoose';

const itemSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['LOST', 'FOUND'],
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ['ACTIVE', 'CLAIMED', 'RETURNED'],
      default: 'ACTIVE',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // Set to false temporarily for scaffolding
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model('Item', itemSchema);
export default Item;
