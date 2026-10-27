import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService, assignmentService, quizService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { Modal, Badge } from '../../components/common/CommonUI';
import { BookOpen, Plus, Users, Layers, Trash2, Edit3, FileText, HelpCircle, CheckCircle } from 'lucide-react';

export const FacultyCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Course Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [courseForm, setCourseForm] = useState({
    courseCode: '',
    title: '',
    description: '',
    category: 'Computer Science',
    capacity: 60,
    credits: 4,
    level: 'Intermediate',
    semester: 'Fall 2026'
  });
  const [creating, setCreating] = useState(false);

  // Create Assignment Modal
  const [assignModalCourse, setAssignModalCourse] = useState(null);
  const [assignForm, setAssignForm] = useState({
    title: '',
    description: '',
    maxScore: 100,
    weightage: 20,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // Create Quiz Modal
  const [quizModalCourse, setQuizModalCourse] = useState(null);
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    timeLimitMinutes: 20,
    passPercentage: 60,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    questions: [
      {
        questionText: 'Which protocol ensures state machine replication in distributed systems?',
        questionType: 'mcq',
        options: ['Raft', 'FTP', 'SMTP', 'BGP'],
        correctOptionIndex: 0,
        points: 10,
        explanation: 'Raft provides consensus for state machine replication.'
      }
    ]
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await courseService.getCourses({ facultyId: user.role === 'admin' ? undefined : user.id });
      if (res.success) {
        setCourses(res.courses || []);
      }
    } catch (err) {
      console.error('Error fetching faculty courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await courseService.createCourse(courseForm);
      setShowCreateModal(false);
      setCourseForm({
        courseCode: '',
        title: '',
        description: '',
        category: 'Computer Science',
        capacity: 60,
        credits: 4,
        level: 'Intermediate',
        semester: 'Fall 2026'
      });
      await fetchCourses();
      alert('Course published successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!assignModalCourse) return;
    try {
      await assignmentService.create({
        ...assignForm,
        courseId: assignModalCourse._id
      });
      alert(`Assignment created and dispatched to enrolled students of ${assignModalCourse.title}!`);
      setAssignModalCourse(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create assignment');
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!quizModalCourse) return;
    try {
      await quizService.create({
        ...quizForm,
        courseId: quizModalCourse._id
      });
      alert(`Quiz published and scheduled for students of ${quizModalCourse.title}!`);
      setQuizModalCourse(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create quiz');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course and all associated student enrollments?')) {
      try {
        await courseService.deleteCourse(id);
        await fetchCourses();
      } catch (err) {
        alert('Failed to delete course');
      }
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Course & Curriculum Management</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Author courses, attach modular resources, and schedule assignments and quizzes.
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Courses List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading instructed courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          You have not created any courses yet. Click "Create New Course" above.
        </div>
      ) : (
        <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
          {courses.map((course) => (
            <div key={course._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <span className="badge badge-primary">{course.courseCode}</span>
                  <span className="badge badge-neutral" style={{ marginLeft: '0.4rem' }}>{course.category}</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.35rem' }}>{course.title}</h3>
                </div>
                <button
                  onClick={() => handleDeleteCourse(course._id)}
                  className="btn btn-secondary btn-icon"
                  style={{ color: 'var(--danger)' }}
                  title="Delete Course"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                {course.description}
              </p>

              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={14} /> {course.activeStudentsCount || 0} / {course.capacity} Students Enrolled
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Layers size={14} /> {course.modules?.length || 0} Modules
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  • {course.credits} Credits
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setAssignModalCourse(course)}
                  className="btn btn-secondary btn-sm"
                >
                  <FileText size={14} />
                  <span>+ Assignment</span>
                </button>

                <button
                  onClick={() => setQuizModalCourse(course)}
                  className="btn btn-secondary btn-sm"
                >
                  <HelpCircle size={14} />
                  <span>+ Quiz</span>
                </button>

                <Link
                  to={`/student/courses/${course._id}`}
                  className="btn btn-outline btn-sm"
                  style={{ marginLeft: 'auto' }}
                >
                  Inspect Curriculum →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Course */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Author New Course"
        maxWidth="650px"
      >
        <form onSubmit={handleCreateCourse}>
          <div className="grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Course Code</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. CS-620"
                value={courseForm.courseCode}
                onChange={(e) => setCourseForm({ ...courseForm, courseCode: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={courseForm.category}
                onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Data Engineering">Data Engineering</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Course Title</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Advanced Distributed Graph Databases"
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Comprehensive Description</label>
            <textarea
              required
              rows={3}
              className="form-textarea"
              placeholder="Outline the prerequisites, key learnings, and outcomes..."
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
            />
          </div>

          <div className="grid-cols-3" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Capacity</label>
              <input
                type="number"
                min={5}
                max={200}
                className="form-input"
                value={courseForm.capacity}
                onChange={(e) => setCourseForm({ ...courseForm, capacity: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Credits</label>
              <input
                type="number"
                min={1}
                max={6}
                className="form-input"
                value={courseForm.credits}
                onChange={(e) => setCourseForm({ ...courseForm, credits: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Academic Level</label>
              <select
                className="form-select"
                value={courseForm.level}
                onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="btn btn-primary"
            >
              {creating ? 'Publishing Course...' : 'Publish Course'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Assignment */}
      <Modal
        isOpen={!!assignModalCourse}
        onClose={() => setAssignModalCourse(null)}
        title={`Add Assignment to ${assignModalCourse?.courseCode || ''}`}
        maxWidth="600px"
      >
        <form onSubmit={handleCreateAssignment}>
          <div className="form-group">
            <label className="form-label">Assignment Title</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Lab 3: Zero-Knowledge Proof Implementation"
              value={assignForm.title}
              onChange={(e) => setAssignForm({ ...assignForm, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Instructions & Rubric Overview</label>
            <textarea
              required
              rows={3}
              className="form-textarea"
              placeholder="Specify requirements, deliverables, and test criteria..."
              value={assignForm.description}
              onChange={(e) => setAssignForm({ ...assignForm, description: e.target.value })}
            />
          </div>

          <div className="grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Course Weight (%)</label>
              <input
                type="number"
                min={5}
                max={50}
                className="form-input"
                value={assignForm.weightage}
                onChange={(e) => setAssignForm({ ...assignForm, weightage: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={assignForm.dueDate}
                onChange={(e) => setAssignForm({ ...assignForm, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setAssignModalCourse(null)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Create Assignment & Dispatch Alert
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Quiz */}
      <Modal
        isOpen={!!quizModalCourse}
        onClose={() => setQuizModalCourse(null)}
        title={`Add Quiz to ${quizModalCourse?.courseCode || ''}`}
        maxWidth="600px"
      >
        <form onSubmit={handleCreateQuiz}>
          <div className="form-group">
            <label className="form-label">Quiz Title</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Midterm Quiz: Consensus Algorithms"
              value={quizForm.title}
              onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Topic Description</label>
            <textarea
              rows={2}
              className="form-textarea"
              placeholder="Focus areas for students..."
              value={quizForm.description}
              onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
            />
          </div>

          <div className="grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Time Limit (Minutes)</label>
              <input
                type="number"
                min={5}
                max={120}
                className="form-input"
                value={quizForm.timeLimitMinutes}
                onChange={(e) => setQuizForm({ ...quizForm, timeLimitMinutes: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pass Percentage (%)</label>
              <input
                type="number"
                min={40}
                max={90}
                className="form-input"
                value={quizForm.passPercentage}
                onChange={(e) => setQuizForm({ ...quizForm, passPercentage: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setQuizModalCourse(null)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Publish Quiz
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
