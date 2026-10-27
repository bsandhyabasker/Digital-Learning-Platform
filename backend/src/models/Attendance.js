const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    default: 'present'
  },
  remarks: {
    type: String,
    default: ''
  }
});

const attendanceSchema = new mongoose.Schema(
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
    sessionDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    topicCovered: {
      type: String,
      default: 'Regular Lecture Session'
    },
    durationHours: {
      type: Number,
      default: 1.5
    },
    records: [attendanceRecordSchema]
  },
  {
    timestamps: true
  }
);

// Prevent duplicate attendance sheet for the exact same course on the exact same date
attendanceSchema.index({ courseId: 1, sessionDate: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
