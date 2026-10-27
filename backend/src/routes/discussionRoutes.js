const express = require('express');
const router = express.Router();
const {
  getTopics,
  getTopicById,
  createTopic,
  addReply,
  endorseReply,
  upvoteTopic
} = require('../controllers/discussionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', getTopics);
router.get('/:id', getTopicById);
router.post('/', createTopic);
router.post('/:id/reply', addReply);
router.post('/:id/upvote', upvoteTopic);
router.put('/:id/endorse/:replyId', authorize('faculty', 'admin'), endorseReply);

module.exports = router;
