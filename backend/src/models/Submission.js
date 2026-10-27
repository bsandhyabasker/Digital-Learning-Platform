const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
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
    submissionText: {
      type: String,
      default: ''
    },
    fileUrl: {
      type: String,
      default: ''
    },
    repoUrl: {
      type: String,
      default: ''
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    isLate: {
      type: Boolean,
      default: false
    },
    grade: {
      type: Number,
      default: null
    },
    rubricScores: [
      {
        criterion: String,
        pointsAwarded: Number
      }
    ],
    status: {
      type: String,
      enum: ['submitted', 'graded', 'resubmission_requested'],
      default: 'submitted'
    },
    facultyFeedback: {
      type: String,
      default: ''
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    gradedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// One submission per student per assignment (can be updated before deadline)
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
