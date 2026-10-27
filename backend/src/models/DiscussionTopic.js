const mongoose = require('mongoose');

const discussionReplySchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'Reply content is required']
    },
    isFacultyEndorsed: {
      type: Boolean,
      default: false
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

const discussionTopicSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null // null indicates general / platform-wide forum
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Discussion title is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Discussion content is required']
    },
    category: {
      type: String,
      default: 'General'
    },
    tags: [{ type: String }],
    isPinned: {
      type: Boolean,
      default: false
    },
    isResolved: {
      type: Boolean,
      default: false
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    replies: [discussionReplySchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('DiscussionTopic', discussionTopicSchema);
