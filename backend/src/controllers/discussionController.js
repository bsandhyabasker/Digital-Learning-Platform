const DiscussionTopic = require('../models/DiscussionTopic');
const Course = require('../models/Course');
const { sendNotification } = require('../services/notificationService');

// @desc    Get discussion topics
// @route   GET /api/discussions
// @access  Private
exports.getTopics = async (req, res, next) => {
  try {
    const { courseId, category, search, tag } = req.query;

    const query = {};
    if (courseId) {
      query.courseId = courseId;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (tag) {
      query.tags = tag;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const topics = await DiscussionTopic.find(query)
      .populate('authorId', 'name email avatar role department')
      .populate('courseId', 'title courseCode')
      .populate('replies.authorId', 'name email avatar role')
      .sort({ isPinned: -1, updatedAt: -1 });

    res.json({
      success: true,
      count: topics.length,
      topics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single topic with replies
// @route   GET /api/discussions/:id
// @access  Private
exports.getTopicById = async (req, res, next) => {
  try {
    const topic = await DiscussionTopic.findById(req.params.id)
      .populate('authorId', 'name email avatar role department bio')
      .populate('courseId', 'title courseCode')
      .populate('replies.authorId', 'name email avatar role department');

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Discussion topic not found' });
    }

    res.json({
      success: true,
      topic
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create discussion topic
// @route   POST /api/discussions
// @access  Private
exports.createTopic = async (req, res, next) => {
  try {
    const { courseId, title, content, category, tags, isPinned } = req.body;

    const topic = await DiscussionTopic.create({
      courseId: courseId || null,
      authorId: req.user.id,
      title,
      content,
      category: category || 'General',
      tags: tags || [],
      isPinned: req.user.role !== 'student' && isPinned ? true : false
    });

    const populated = await DiscussionTopic.findById(topic._id)
      .populate('authorId', 'name email avatar role department')
      .populate('courseId', 'title courseCode');

    // If course topic, notify course faculty
    if (courseId) {
      const course = await Course.findById(courseId);
      if (course && course.facultyId.toString() !== req.user.id) {
        await sendNotification({
          recipientId: course.facultyId,
          senderId: req.user.id,
          title: 'New Forum Question in Course',
          message: `${req.user.name} asked: "${title}" in ${course.title}.`,
          type: 'forum',
          link: `/forum/${topic._id}`
        });
      }
    }

    res.status(201).json({
      success: true,
      topic: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a topic
// @route   POST /api/discussions/:id/reply
// @access  Private
exports.addReply = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Reply content cannot be empty' });
    }

    const topic = await DiscussionTopic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    topic.replies.push({
      authorId: req.user.id,
      content,
      isFacultyEndorsed: req.user.role === 'faculty',
      upvotes: []
    });

    await topic.save();

    const updated = await DiscussionTopic.findById(topic._id)
      .populate('authorId', 'name email avatar role department')
      .populate('courseId', 'title courseCode')
      .populate('replies.authorId', 'name email avatar role department');

    // Notify topic author
    if (topic.authorId.toString() !== req.user.id) {
      await sendNotification({
        recipientId: topic.authorId,
        senderId: req.user.id,
        title: 'New Reply on Your Question',
        message: `${req.user.name} replied to your thread "${topic.title}".`,
        type: 'forum',
        link: `/forum/${topic._id}`
      });
    }

    res.status(201).json({
      success: true,
      topic: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Faculty Endorse a reply
// @route   PUT /api/discussions/:id/endorse/:replyId
// @access  Private (Faculty, Admin)
exports.endorseReply = async (req, res, next) => {
  try {
    const topic = await DiscussionTopic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    const reply = topic.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ success: false, message: 'Reply not found' });
    }

    reply.isFacultyEndorsed = !reply.isFacultyEndorsed;
    await topic.save();

    if (reply.isFacultyEndorsed) {
      await sendNotification({
        recipientId: reply.authorId,
        senderId: req.user.id,
        title: 'Answer Endorsed by Faculty! ⭐',
        message: `Your answer on "${topic.title}" was verified and endorsed by faculty.`,
        type: 'forum',
        link: `/forum/${topic._id}`
      });
    }

    res.json({
      success: true,
      message: reply.isFacultyEndorsed ? 'Reply endorsed by faculty.' : 'Endorsement removed.',
      topic
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote topic
// @route   POST /api/discussions/:id/upvote
// @access  Private
exports.upvoteTopic = async (req, res, next) => {
  try {
    const topic = await DiscussionTopic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    const index = topic.upvotes.indexOf(req.user.id);
    if (index === -1) {
      topic.upvotes.push(req.user.id);
    } else {
      topic.upvotes.splice(index, 1);
    }

    await topic.save();

    res.json({
      success: true,
      upvotesCount: topic.upvotes.length,
      hasUpvoted: index === -1
    });
  } catch (error) {
    next(error);
  }
};
