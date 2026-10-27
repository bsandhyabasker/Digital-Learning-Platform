const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: {
    type: String,
    enum: ['mcq', 'tf', 'short'],
    default: 'mcq'
  },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  points: { type: Number, default: 10 },
  explanation: { type: String, default: '' }
});

const quizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide quiz title'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    timeLimitMinutes: {
      type: Number,
      default: 20
    },
    totalPoints: {
      type: Number,
      default: 100
    },
    passPercentage: {
      type: Number,
      default: 60
    },
    dueDate: {
      type: Date,
      required: true
    },
    questions: [questionSchema],
    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'published'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Quiz', quizSchema);
