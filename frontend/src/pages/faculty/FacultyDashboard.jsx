import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/courseService';
import { StatCard, Badge } from '../../components/common/CommonUI';
import { GradeDistributionChart } from '../../components/charts/ChartWidgets';
import {
  BookOpen,
  Users,
  ClipboardList,
  AlertTriangle,
  Award,
  Clock,
  ArrowRight,
  CheckCircle,
  CalendarCheck,
  Plus
} from 'lucide-react';

export const FacultyDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFacultyData = async () => {
      try {
        setLoading(true);
        const res = await analyticsService.getFacultyAnalytics();
        if (res.success) {
          setAnalytics(res);
        }
      } catch (err) {
        console.error('Error fetching faculty analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFacultyData();
  }, []);

  const summary = analytics?.summary;

  return (
    <div className="page-container">
      {/* Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Faculty Teaching Suite 👨‍🏫</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Welcome, {user?.name}. Manage curriculum, evaluate submissions, track class attendance, and support students.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/faculty/courses" className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Create New Course</span>
          </Link>
          <Link to="/faculty/attendance" className="btn btn-secondary btn-sm">
            <CalendarCheck size={16} />
            <span>Log Class Attendance</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Courses Instructed"
          value={summary?.totalCourses || 0}
          subtitle="Active curricula"
          color="primary"
          icon={<BookOpen size={22} />}
        />
        <StatCard
          title="Total Active Students"
          value={summary?.totalStudents || 0}
          subtitle="Enrolled learners"
          color="secondary"
          icon={<Users size={22} />}
        />
        <StatCard
          title="Pending Submissions"
          value={summary?.pendingGradingCount || 0}
          subtitle="Needs evaluation"
          color={summary?.pendingGradingCount > 0 ? 'warning' : 'success'}
          icon={<ClipboardList size={22} />}
        />
        <StatCard
          title="Students Requiring Attention"
          value={summary?.atRiskCount || 0}
          subtitle="Below 75% attendance / Below 60% score"
          color={summary?.atRiskCount > 0 ? 'danger' : 'success'}
          icon={<AlertTriangle size={22} />}
        />
      </div>

      {/* Main Grid: Pending Grading Queue & At-Risk Intervention List */}
      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        {/* Pending Grading Queue */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Pending Submissions Queue</h3>
              <p className="card-subtitle">Assignments submitted by students waiting for evaluation</p>
            </div>
            <Link to="/faculty/grading" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Grading Panel →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analytics?.pendingGradingQueue?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                🎉 Great job! All student submissions have been evaluated.
              </div>
            ) : (
              analytics?.pendingGradingQueue?.map((sub) => (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={sub.studentId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                      alt={sub.studentId?.name}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{sub.studentId?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {sub.assignmentId?.title} • {sub.courseId?.courseCode}
                      </div>
                    </div>
                  </div>

                  <Link to="/faculty/grading" className="btn btn-primary btn-sm">
                    Evaluate
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* At-Risk Students Warning List */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ color: 'var(--danger-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} style={{ color: 'var(--danger)' }} />
                Students Requiring Academic Attention
              </h3>
              <p className="card-subtitle">Students with attendance &lt; 75% or scores &lt; 60%</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analytics?.atRiskStudents?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                ✓ All students currently maintain satisfactory academic standing.
              </div>
            ) : (
              analytics?.atRiskStudents?.map((perf) => (
                <div
                  key={perf._id}
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--danger-light)',
                    border: '1px solid var(--danger)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--danger-text)' }}>
                      {perf.studentId?.name} ({perf.studentId?.studentId || 'Student'})
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--danger-text)', marginTop: '2px' }}>
                      {perf.courseId?.title} • Attendance: <strong>{perf.attendancePercentage}%</strong> • Score: <strong>{perf.overallScore}%</strong>
                    </div>
                  </div>

                  <span className="badge badge-danger">
                    Action Needed
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Cohort Grade Distribution */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Class Performance & Grade Distribution</h3>
            <p className="card-subtitle">Aggregated distribution across all courses taught</p>
          </div>
          <span className="badge badge-primary">
            Class Average: {summary?.classAverage || 82}%
          </span>
        </div>
        <GradeDistributionChart data={analytics?.gradeDistribution || []} />
      </div>
    </div>
  );
};
