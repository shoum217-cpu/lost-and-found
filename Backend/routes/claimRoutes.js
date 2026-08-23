import express from 'express';
import {
  createClaim,
  requestVerification,
  submitVerificationAnswers,
  approveClaim,
  rejectClaim,
  getClaimById,
  getMyClaims,
} from '../controllers/claimController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All claim operations require authentication

router.route('/')
  .get(getMyClaims)
  .post(createClaim);

router.get('/:id', getClaimById);
router.post('/:id/request-verification', requestVerification);
router.post('/:id/submit-answers', submitVerificationAnswers);
router.post('/:id/approve', approveClaim);
router.post('/:id/reject', rejectClaim);

export default router;
