import React, { useState, useEffect } from 'react';
import { assignmentService, courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { Modal, Badge } from '../../components/common/CommonUI';
import { FileCheck2, Clock, CheckCircle, AlertCircle, ExternalLink, Send, BookOpen } from 'lucide-react';

export const StudentAssignmentsPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const res = await courseService.getCourses();
        if (res.success && res.courses?.length > 0) {
          setCourses(res.courses);
          setSelectedCourseId(res.courses[0]._id);
        }
      } catch (err) {
        console.error('Error loading courses:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await assignmentService.getByCourse(selectedCourseId);
        if (res.success) {
          setAssignments(res.assignments || []);
        }
      } catch (err) {
        console.error('Error fetching assignments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [selectedCourseId]);

  const handleOpenSubmitModal = (assign) => {
    setActiveAssignment(assign);
    setSubmissionText(assign.mySubmission?.submissionText || '');
    setRepoUrl(assign.mySubmission?.repoUrl || '');
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!activeAssignment) return;
    try {
      setSubmitting(true);
      await assignmentService.submit({
        assignmentId: activeAssignment._id,
        submissionText,
        repoUrl
      });
      alert('Assignment solution submitted successfully! Faculty will evaluate soon.');
      setActiveAssignment(null);
      // Refresh assignments
      const res = await assignmentService.getByCourse(selectedCourseId);
      if (res.success) setAssignments(res.assignments || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAssignments = assignments.filter((assign) => {
    if (filterStatus === 'pending') return !assign.isSubmitted;
    if (filterStatus === 'submitted') return assign.isSubmitted && assign.gradeStatus !== 'graded';
    if (filterStatus === 'graded') return assign.gradeStatus === 'graded';
    return true;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Assignments & Laboratory Tasks</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Submit your project implementations, review faculty evaluations and rubric grades.
          </p>
        </div>

        {/* Course Selector Dropdown */}
        {courses.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Course:</span>
            <select
              className="form-select"
              style={{ width: '260px' }}
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.courseCode} - {c.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'all', label: `All Tasks (${assignments.length})` },
          { id: 'pending', label: 'Needs Submission' },
          { id: 'submitted', label: 'Under Review' },
          { id: 'graded', label: 'Graded & Evaluated' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`btn btn-sm ${filterStatus === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Assignments List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading coursework assignments...
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No assignments found in this category.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredAssignments.map((assign) => (
            <div key={assign._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="badge badge-primary">{assign.weightage}% Course Weight</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={12} /> Due: {new Date(assign.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{assign.title}</h3>
                </div>

                <div>
                  {assign.isSubmitted ? (
                    assign.mySubmission?.status === 'graded' ? (
                      <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                        Graded: {assign.mySubmission.grade}/{assign.maxScore} pts
                      </span>
                    ) : (
                      <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                        ✓ Submitted (Pending Grade)
                      </span>
                    )
                  ) : (
                    <span className="badge badge-danger" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                      Pending Submission
                    </span>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '1rem 0', lineHeight: 1.6 }}>
                {assign.description}
              </p>

              {/* Rubric Breakdown */}
              {assign.rubric?.length > 0 && (
                <div style={{ backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Evaluation Rubric Criteria
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {assign.rubric.map((r, rIdx) => (
                      <div key={rIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span>• {r.criterion}</span>
                        <strong style={{ color: 'var(--primary)' }}>{r.maxPoints} pts</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Graded Feedback Box */}
              {assign.mySubmission?.status === 'graded' && (
                <div style={{ backgroundColor: 'var(--success-light)', borderLeft: '4px solid var(--success)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--success-text)', fontSize: '0.85rem' }}>
                    Faculty Evaluation & Feedback:
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--success-text)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                    "{assign.mySubmission.facultyFeedback || 'Good work on completing all requirements.'}"
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  onClick={() => handleOpenSubmitModal(assign)}
                  className="btn btn-primary btn-sm"
                >
                  <Send size={14} />
                  <span>{assign.isSubmitted ? 'Update Solution Submission' : 'Submit Solution'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Modal */}
      <Modal
        isOpen={!!activeAssignment}
        onClose={() => setActiveAssignment(null)}
        title={`Submit Solution: ${activeAssignment?.title || ''}`}
        maxWidth="650px"
      >
        <form onSubmit={handleSubmitAssignment}>
          <div className="form-group">
            <label className="form-label">Solution Description & Technical Notes</label>
            <textarea
              required
              rows={4}
              className="form-textarea"
              placeholder="Describe your design decisions, test assertions, and architecture..."
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Repository or Artifact URL (e.g. GitHub)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://github.com/yourname/project-solution"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setActiveAssignment(null)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Uploading Submission...' : 'Submit for Grading'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
