import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/courseService';
import { StatCard, ProgressBar, Badge } from '../../components/common/CommonUI';
import { PerformanceRadar } from '../../components/charts/ChartWidgets';
import {
  BookOpen,
  Award,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  HelpCircle
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await analyticsService.getStudentAnalytics();
        if (res.success) {
          setAnalytics(res);
        }
      } catch (err) {
        console.error('Error fetching student dashboard analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const summary = analytics?.summary;
  const isAtRisk = (summary?.overallAttendance || 100) < 75;

  return (
    <div className="page-container">
      {/* Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome back, {user?.name} 👋</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Track your coursework progress, assignments, upcoming quizzes, and academic standing.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/student/courses" className="btn btn-primary btn-sm">
            <BookOpen size={16} />
            <span>Explore Courses</span>
          </Link>
          <Link to="/student/assignments" className="btn btn-secondary btn-sm">
            <FileCheck2 size={16} />
            <span>My Assignments</span>
          </Link>
        </div>
      </div>

      {/* At-Risk Warning Alert Banner (if attendance < 75%) */}
      {isAtRisk && (
        <div
          style={{
            backgroundColor: 'var(--danger-light)',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <AlertTriangle size={24} style={{ color: 'var(--danger)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: 'var(--danger-text)', fontSize: '0.95rem' }}>
              Academic Standing Alert: Attendance Below 75%
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--danger-text)', marginTop: '2px' }}>
              Your recorded attendance ({summary?.overallAttendance}%) is currently below institutional threshold. Please review your session records and consult faculty.
            </div>
          </div>
          <Link to="/student/attendance" className="btn btn-danger btn-sm">
            Review Attendance
          </Link>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Cumulative GPA"
          value={summary?.gpa || '3.80'}
          subtitle="4.00 Max Scale"
          trend="up"
          trendLabel="+0.15 this term"
          color="primary"
          icon={<Award size={22} />}
        />
        <StatCard
          title="Overall Attendance"
          value={`${summary?.overallAttendance || 95}%`}
          subtitle={isAtRisk ? 'Requires Attention' : 'Good Standing'}
          color={isAtRisk ? 'danger' : 'success'}
          icon={<CalendarCheck size={22} />}
        />
        <StatCard
          title="Course Completion"
          value={`${summary?.overallProgress || 0}%`}
          subtitle={`${summary?.enrolledCoursesCount || 0} active courses`}
          color="secondary"
          icon={<CheckCircle2 size={22} />}
        />
        <StatCard
          title="Assignment Average"
          value={`${summary?.assignmentAverage || 0}%`}
          subtitle={`${summary?.totalSubmissions || 0} submitted`}
          color="warning"
          icon={<TrendingUp size={22} />}
        />
      </div>

      {/* Middle Grid: Course Progress & Competency Radar */}
      <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
        {/* Enrolled Courses & Academic Standing */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Enrolled Courses & Academic Standing</h3>
              <p className="card-subtitle">Real-time progress, GPA, and weighted performance</p>
            </div>
            <Link to="/student/courses" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              View All Courses →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {analytics?.performanceByCourse?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                You are not enrolled in any courses yet.{' '}
                <Link to="/student/courses" style={{ color: 'var(--primary)' }}>
                  Browse Course Catalog
                </Link>
              </div>
            ) : (
              analytics?.performanceByCourse?.map((perf) => (
                <div
                  key={perf._id}
                  style={{
                    padding: '1.25rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div>
                      <span className="badge badge-primary" style={{ marginBottom: '0.25rem' }}>
                        {perf.courseId?.courseCode}
                      </span>
                      <h4 style={{ fontSize: '1rem', marginTop: '0.2rem' }}>{perf.courseId?.title}</h4>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span
                        className={`badge ${
                          perf.riskStatus === 'at_risk'
                            ? 'badge-danger'
                            : perf.riskStatus === 'needs_attention'
                            ? 'badge-warning'
                            : 'badge-success'
                        }`}
                      >
                        {perf.riskStatus === 'at_risk'
                          ? '⚠️ At Risk'
                          : perf.riskStatus === 'needs_attention'
                          ? 'Needs Attention'
                          : '✓ Good Standing'}
                      </span>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '4px' }}>
                        Score: {perf.overallScore}%
                      </div>
                    </div>
                  </div>

                  <div className="grid-cols-3" style={{ gap: '0.75rem', marginTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Assignments:</span>{' '}
                      <strong>{perf.assignmentAverage}%</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Quizzes:</span>{' '}
                      <strong>{perf.quizAverage}%</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Attendance:</span>{' '}
                      <strong>{perf.attendancePercentage}%</strong>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.75rem' }}>
                    <ProgressBar progress={perf.overallScore} label="Weighted Course Standing" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Competency Radar Graph */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Competency Radar</h3>
              <p className="card-subtitle">Multi-domain performance metric</p>
            </div>
          </div>
          <PerformanceRadar data={analytics?.radarData} />
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            💡 <strong>Insight:</strong> Balanced competencies across assignments, quizzes, and attendance boost overall term GPA.
          </div>
        </div>
      </div>

      {/* Recent Submissions & Quiz Activity */}
      <div className="grid-cols-2">
        {/* Recent Submissions */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Submissions & Grades</h3>
              <p className="card-subtitle">Direct feedback from your professors</p>
            </div>
            <Link to="/student/assignments" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              All Assignments →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analytics?.recentSubmissions?.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No submissions recorded yet.
              </div>
            ) : (
              analytics?.recentSubmissions?.map((sub) => (
                <div
                  key={sub._id}
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
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{sub.assignmentId?.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {sub.courseId?.courseCode} • Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    {sub.status === 'graded' ? (
                      <span className="badge badge-success">
                        Grade: {sub.grade}/100
                      </span>
                    ) : (
                      <span className="badge badge-warning">
                        Pending Evaluation
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Quiz Attempts */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Quiz Results</h3>
              <p className="card-subtitle">Automated scoring & time metrics</p>
            </div>
            <Link to="/student/quizzes" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              All Quizzes →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analytics?.recentQuizzes?.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No quiz attempts taken yet.
              </div>
            ) : (
              analytics?.recentQuizzes?.map((att) => (
                <div
                  key={att._id}
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
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{att.quizId?.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {att.courseId?.courseCode} • {Math.round(att.timeSpentSeconds / 60)} mins spent
                    </div>
                  </div>
                  <div>
                    <span className={`badge ${att.passed ? 'badge-success' : 'badge-danger'}`}>
                      {att.percentage}% ({att.scoreObtained}/{att.totalPossibleScore} pts)
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
