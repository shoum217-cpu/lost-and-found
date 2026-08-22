import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'MATCH_FOUND',
        'CLAIM_SUBMITTED',
        'VERIFICATION_REQUESTED',
        'VERIFICATION_PASSED',
        'VERIFICATION_FAILED',
        'ITEM_RETURNED',
        'GENERAL',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: false,
    },
    claim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Claim',
      required: false,
    },
    link: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
