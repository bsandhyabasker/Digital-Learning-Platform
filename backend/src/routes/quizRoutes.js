const express = require('express');
const router = express.Router();
const {
  getQuizzesByCourse,
  getQuizById,
  createQuiz,
  submitQuizAttempt,
  getQuizResults
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/course/:courseId', getQuizzesByCourse);
router.get('/:id', getQuizById);
router.get('/:id/results', authorize('faculty', 'admin'), getQuizResults);

router.post('/', authorize('faculty', 'admin'), createQuiz);
router.post('/:id/submit', authorize('student'), submitQuizAttempt);

module.exports = router;
