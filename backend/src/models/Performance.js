const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema(
  {
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
    assignmentAverage: {
      type: Number,
      default: 0
    },
    quizAverage: {
      type: Number,
      default: 0
    },
    attendancePercentage: {
      type: Number,
      default: 100
    },
    overallScore: {
      type: Number,
      default: 0
    },
    riskStatus: {
      type: String,
      enum: ['good_standing', 'needs_attention', 'at_risk'],
      default: 'good_standing'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

performanceSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Performance', performanceSchema);
