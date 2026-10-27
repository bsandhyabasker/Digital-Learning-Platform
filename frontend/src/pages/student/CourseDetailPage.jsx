import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService, assignmentService, quizService, attendanceService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { ProgressBar, Badge } from '../../components/common/CommonUI';
import { Avatar } from '../../components/common/Avatar';
import {
  BookOpen,
  FileText,
  Video,
  Code,
  Download,
  Calendar,
  Award,
  Users,
  CheckCircle,
  Clock,
  ArrowLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [performance, setPerformance] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [attendance, setAttendance] = useState(null);

  const [activeTab, setActiveTab] = useState('modules'); // 'modules', 'syllabus', 'assignments', 'quizzes', 'attendance'
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const [courseRes, assignRes, quizRes, attendRes] = await Promise.all([
          courseService.getCourseById(id),
          assignmentService.getByCourse(id),
          quizService.getByCourse(id),
          attendanceService.getCourseAttendance(id)
        ]);

        if (courseRes.success) {
          setCourse(courseRes.course);
          setIsEnrolled(courseRes.isEnrolled);
          setPerformance(courseRes.performance);
        }
        if (assignRes.success) setAssignments(assignRes.assignments || []);
        if (quizRes.success) setQuizzes(quizRes.quizzes || []);
        if (attendRes.success) setAttendance(attendRes);
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const handleEnroll = async () => {
    try {
      setEnrollLoading(true);
      await courseService.enroll(id);
      setIsEnrolled(true);
      alert('Successfully enrolled! Course materials and assignments are now active.');
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrollLoading(false);
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={16} style={{ color: '#0ea5e9' }} />;
      case 'code': return <Code size={16} style={{ color: '#10b981' }} />;
      case 'pdf': return <FileText size={16} style={{ color: '#ef4444' }} />;
      default: return <BookOpen size={16} style={{ color: '#c02828' }} />;
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
        Loading Course Hub...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Course Not Found</h2>
        <Link to="/student/courses" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Back button */}
      <Link to="/student/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600, fontSize: '0.85rem' }}>
        <ArrowLeft size={16} /> Back to Courses
      </Link>

      {/* Course Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #991b1b 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          color: '#ffffff',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
              {course.courseCode}
            </span>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
              {course.category}
            </span>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
              {course.level} Level
            </span>
          </div>

          <h1 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            {course.title}
          </h1>

          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {course.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Avatar name={course.facultyId?.name} size={38} style={{ border: '2px solid rgba(255,255,255,0.8)' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{course.facultyId?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{course.facultyId?.department}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              • {course.credits} Credits • {course.semester}
            </div>

            {!isEnrolled ? (
              <button
                onClick={handleEnroll}
                disabled={enrollLoading}
                className="btn btn-primary"
                style={{ backgroundColor: '#c02828', marginLeft: 'auto' }}
              >
                {enrollLoading ? 'Enrolling...' : 'Enroll in this Course'}
              </button>
            ) : (
              <span
                style={{
                  marginLeft: 'auto',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <CheckCircle size={14} /> Active Enrollment
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        {[
          { id: 'modules', label: `Course Modules (${course.modules?.length || 0})` },
          { id: 'syllabus', label: 'Syllabus Timeline' },
          { id: 'assignments', label: `Assignments (${assignments.length})` },
          { id: 'quizzes', label: `Quizzes & Tests (${quizzes.length})` },
          { id: 'attendance', label: 'Attendance Records' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'modules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {course.modules?.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No modules published yet for this course.
            </div>
          ) : (
            course.modules.map((mod, idx) => (
              <div key={mod._id || idx} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{mod.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {mod.description}
                    </p>
                  </div>
                  <span className="badge badge-primary">Module {idx + 1}</span>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Learning Materials & Resources
                  </div>
                  {mod.resources?.map((res, rIdx) => (
                    <div
                      key={res._id || rIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {getResourceIcon(res.type)}
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{res.title}</div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                            {res.type.toUpperCase()} • Est. {res.duration}
                          </div>
                        </div>
                      </div>

                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <ExternalLink size={14} />
                        <span>Access Material</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'syllabus' && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>Weekly Academic Plan</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {course.syllabus?.map((item) => (
              <div
                key={item.week}
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  padding: '1rem',
                  borderLeft: '3px solid var(--primary)',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '0 var(--radius-md) var(--radius-md) 0'
                }}
              >
                <div style={{ fontWeight: 800, color: 'var(--primary)', minWidth: '70px', fontSize: '0.9rem' }}>
                  Week {item.week}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.topic}</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {item.summary}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {assignments.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No assignments posted for this course yet.
            </div>
          ) : (
            assignments.map((assign) => (
              <div key={assign._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{assign.title}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Due Date: {new Date(assign.dueDate).toLocaleDateString()} • {assign.weightage}% Course Weight
                    </div>
                  </div>

                  <div>
                    {assign.isSubmitted ? (
                      assign.mySubmission?.status === 'graded' ? (
                        <span className="badge badge-success">
                          Graded: {assign.mySubmission.grade}/{assign.maxScore}
                        </span>
                      ) : (
                        <span className="badge badge-warning">
                          Submitted (Pending Evaluation)
                        </span>
                      )
                    ) : (
                      <span className="badge badge-danger">
                        Unsubmitted
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.75rem 0' }}>
                  {assign.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                  <Link to="/student/assignments" className="btn btn-primary btn-sm">
                    {assign.isSubmitted ? 'View Submission & Feedback' : 'Submit Solution'}
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'quizzes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {quizzes.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No quizzes scheduled for this course.
            </div>
          ) : (
            quizzes.map((quiz) => (
              <div key={quiz._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{quiz.title}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {quiz.questionsCount || quiz.questions?.length} Questions • {quiz.timeLimitMinutes} Mins Duration • Pass Mark: {quiz.passPercentage}%
                    </div>
                  </div>

                  {quiz.isCompleted ? (
                    <span className={`badge ${quiz.myAttempt?.passed ? 'badge-success' : 'badge-danger'}`}>
                      Score: {quiz.myAttempt?.percentage}% ({quiz.myAttempt?.passed ? 'PASSED' : 'RETAKE REQUIRED'})
                    </span>
                  ) : (
                    <span className="badge badge-primary">
                      Ready to Take
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.75rem 0' }}>
                  {quiz.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link to="/student/quizzes" className="btn btn-primary btn-sm">
                    {quiz.isCompleted ? 'Review Explanations' : 'Start Timed Test'}
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Session Attendance Record</h3>
              <p className="card-subtitle">Calculated attendance percentage for this specific course</p>
            </div>
            <span className="badge badge-primary">
              Standing: {attendance?.studentStats?.percentage || 100}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {attendance?.studentStats?.records?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No attendance sessions recorded yet for this course.
              </div>
            ) : (
              attendance?.studentStats?.records?.map((rec, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rec.topicCovered}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Date: {new Date(rec.sessionDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      rec.status === 'present'
                        ? 'badge-success'
                        : rec.status === 'late'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}
                    style={{ textTransform: 'uppercase' }}
                  >
                    {rec.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
