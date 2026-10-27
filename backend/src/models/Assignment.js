const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Assignment must belong to a course']
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide assignment title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide assignment instructions']
    },
    maxScore: {
      type: Number,
      default: 100
    },
    weightage: {
      type: Number,
      default: 20, // percentage in final course calculation
      min: 1,
      max: 100
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide a due date']
    },
    rubric: [
      {
        criterion: { type: String, required: true },
        maxPoints: { type: Number, required: true },
        description: { type: String, default: '' }
      }
    ],
    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'published'
    },
    allowLateSubmissions: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

assignmentSchema.virtual('submissions', {
  ref: 'Submission',
  localField: '_id',
  foreignField: 'assignmentId'
});

module.exports = mongoose.model('Assignment', assignmentSchema);
