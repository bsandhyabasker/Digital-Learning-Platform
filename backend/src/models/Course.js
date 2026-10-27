const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: {
    type: String,
    enum: ['video', 'pdf', 'document', 'link', 'code'],
    default: 'document'
  },
  duration: { type: String, default: '15 mins' }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 1 },
  resources: [resourceSchema]
});

const syllabusItemSchema = new mongoose.Schema({
  week: { type: Number, required: true },
  topic: { type: String, required: true },
  summary: { type: String, default: '' }
});

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: [true, 'Please provide a unique course code'],
      unique: true,
      uppercase: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Please provide course title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide course description']
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      default: 'Software Engineering'
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Course must have an assigned faculty']
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
    },
    capacity: {
      type: Number,
      default: 60
    },
    credits: {
      type: Number,
      default: 4
    },
    semester: {
      type: String,
      default: 'Fall 2026'
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published'
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate'
    },
    syllabus: [syllabusItemSchema],
    modules: [moduleSchema]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for enrollment count
courseSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'courseId'
});

module.exports = mongoose.model('Course', courseSchema);
