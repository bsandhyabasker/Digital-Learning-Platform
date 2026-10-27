const express = require('express');
const router = express.Router();
const {
  submitAssignment,
  getSubmissionsByAssignment,
  gradeSubmission
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', authorize('student'), submitAssignment);
router.get('/assignment/:assignmentId', authorize('faculty', 'admin'), getSubmissionsByAssignment);
router.put('/:id/grade', authorize('faculty', 'admin'), gradeSubmission);

module.exports = router;
