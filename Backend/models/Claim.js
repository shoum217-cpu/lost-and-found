import mongoose from 'mongoose';

const claimSchema = mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    claimant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    claimantName: {
      type: String,
      required: true,
    },
    claimantEmail: {
      type: String,
      default: '',
    },
    finder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    // Claim status lifecycle:
    // 'PENDING' -> 'VERIFICATION_REQUESTED' -> 'ANSWERS_SUBMITTED' -> 'VERIFIED' / 'FAILED' / 'REJECTED'
    status: {
      type: String,
      enum: ['PENDING', 'VERIFICATION_REQUESTED', 'ANSWERS_SUBMITTED', 'VERIFIED', 'FAILED', 'REJECTED'],
      default: 'PENDING',
    },
    initialMessage: {
      type: String,
      default: '',
    },
    // Questions sent to claimant for verification
    verificationQuestions: [
      {
        question: { type: String, required: true },
        answer: { type: String, default: '' }, // Provided by claimant
      }
    ],
    // Evaluation results (AI + Rule-based verification)
    verificationScore: {
      type: Number,
      default: 0,
    },
    verificationFeedback: {
      type: String,
      default: '',
    },
    questionBreakdown: [
      {
        question: String,
        matches: Boolean,
        status: { type: String, enum: ['match', 'partial', 'mismatch', 'unanswered'] },
        detail: String,
      }
    ],
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Claim = mongoose.model('Claim', claimSchema);
export default Claim;
