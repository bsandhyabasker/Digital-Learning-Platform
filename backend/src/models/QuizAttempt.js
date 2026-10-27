const mongoose = require('mongoose');

const quizAnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId },
  selectedOption: { type: Number },
  isCorrect: { type: Boolean, default: false },
  pointsAwarded: { type: Number, default: 0 }
});

const quizAttemptSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    timeSpentSeconds: {
      type: Number,
      default: 0
    },
    answers: [quizAnswerSchema],
    scoreObtained: {
      type: Number,
      default: 0
    },
    totalPossibleScore: {
      type: Number,
      default: 100
    },
    percentage: {
      type: Number,
      default: 0
    },
    passed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
