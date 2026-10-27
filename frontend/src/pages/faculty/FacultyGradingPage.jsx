import React, { useState, useEffect } from 'react';
import { courseService, assignmentService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { Modal, Badge } from '../../components/common/CommonUI';
import { ClipboardList, ExternalLink, CheckCircle, Clock, AlertTriangle, Send, User } from 'lucide-react';

export const FacultyGradingPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Grading Modal State
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [savingGrade, setSavingGrade] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const res = await courseService.getCourses({ facultyId: user.role === 'admin' ? undefined : user.id });
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
        const res = await assignmentService.getByCourse(selectedCourseId);
        if (res.success) {
          setAssignments(res.assignments || []);
          if (res.assignments?.length > 0) {
            setSelectedAssignmentId(res.assignments[0]._id);
          } else {
            setSelectedAssignmentId('');
            setSubmissions([]);
          }
        }
      } catch (err) {
        console.error('Error loading assignments:', err);
      }
    };
    fetchAssignments();
  }, [selectedCourseId]);

  const fetchSubmissions = async () => {
    if (!selectedAssignmentId) return;
    try {
      setLoading(true);
      const res = await assignmentService.getSubmissions(selectedAssignmentId);
      if (res.success) {
        setSubmissions(res.submissions || []);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [selectedAssignmentId]);

  const handleOpenGrading = (submission) => {
    setActiveSubmission(submission);
    setGradeInput(submission.grade !== null && submission.grade !== undefined ? String(submission.grade) : '90');
    setFeedbackInput(submission.facultyFeedback || '');
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!activeSubmission) return;
    try {
      setSavingGrade(true);
      await assignmentService.gradeSubmission(activeSubmission._id, {
        grade: Number(gradeInput),
        facultyFeedback: feedbackInput
      });

      alert(`Grade saved! Student GPA recalculated and notification dispatched.`);
      setActiveSubmission(null);
      await fetchSubmissions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save grade evaluation');
    } finally {
      setSavingGrade(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Faculty Evaluation & Grading Desk</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Evaluate student deliverables, provide constructive rubric feedback, and update real-time course GPAs.
          </p>
        </div>

        {/* Selectors */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Course:</span>
            <select
              className="form-select"
              style={{ width: '220px' }}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Assignment:</span>
            <select
              className="form-select"
              style={{ width: '260px' }}
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
            >
              {assignments.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submissions List Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Student Submissions Roster ({submissions.length})</h3>
            <p className="card-subtitle">Showing all submitted code artifacts and technical briefs</p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No submissions recorded yet for this assignment.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {submissions.map((sub) => (
              <div
                key={sub._id}
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={sub.studentId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={sub.studentId?.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>{sub.studentId?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ID: {sub.studentId?.studentId || 'N/A'} • Submitted {new Date(sub.submittedAt).toLocaleString()}
                        {sub.isLate && <span style={{ color: 'var(--danger)', fontWeight: 700, marginLeft: '6px' }}>(Late Submission)</span>}
                      </div>
                    </div>
                  </div>

                  <div>
                    {sub.status === 'graded' ? (
                      <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>
                        Graded: {sub.grade}/100 pts
                      </span>
                    ) : (
                      <span className="badge badge-warning" style={{ fontSize: '0.85rem' }}>
                        Pending Grade
                      </span>
                    )}
                  </div>
                </div>

                {/* Submission Text */}
                <div style={{ margin: '1rem 0', padding: '0.75rem 1rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Student Submission Notes:
                  </div>
                  {sub.submissionText || 'No text submitted.'}
                </div>

                {/* Repo / Artifact Link */}
                {sub.repoUrl && (
                  <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <strong>Artifact Link:</strong>
                    <a href={sub.repoUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--primary)' }}>
                      {sub.repoUrl} <ExternalLink size={14} />
                    </a>
                  </div>
                )}

                {/* Faculty Feedback preview */}
                {sub.facultyFeedback && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    <strong>Recorded Feedback:</strong> "{sub.facultyFeedback}"
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleOpenGrading(sub)}
                    className="btn btn-primary btn-sm"
                  >
                    <ClipboardList size={14} />
                    <span>{sub.status === 'graded' ? 'Update Grade & Feedback' : 'Grade Submission'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grading Modal */}
      {activeSubmission && (
        <Modal
          isOpen={!!activeSubmission}
          onClose={() => setActiveSubmission(null)}
          title={`Grade Submission: ${activeSubmission.studentId?.name}`}
          maxWidth="600px"
        >
          <form onSubmit={handleSaveGrade}>
            <div className="form-group">
              <label className="form-label">Score Awarded (out of 100)</label>
              <input
                type="number"
                required
                min={0}
                max={100}
                className="form-input"
                value={gradeInput}
                onChange={(e) => setGradeInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Constructive Feedback for Student</label>
              <textarea
                required
                rows={4}
                className="form-textarea"
                placeholder="Highlight strengths, architecture remarks, and areas for improvement..."
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setActiveSubmission(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingGrade}
                className="btn btn-primary"
              >
                {savingGrade ? 'Recalculating Metrics...' : 'Confirm Grade & Notify Student'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
