import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/courseService';
import { StatCard, Badge, ProgressBar } from '../../components/common/CommonUI';
import { GradeDistributionChart } from '../../components/charts/ChartWidgets';
import { BookOpen, Users, Award, AlertTriangle, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export const FacultyAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
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
    fetchAnalytics();
  }, []);

  const summary = analytics?.summary;

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
        Computing Faculty Cohort Analytics...
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Cohort Performance & Academic Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Real-time institutional insights on grade dispersion, learner retention, and early risk intervention.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Active Students"
          value={summary?.totalStudents || 0}
          subtitle="Across all courses"
          color="primary"
          icon={<Users size={22} />}
        />
        <StatCard
          title="Class Average"
          value={`${summary?.classAverage || 82}%`}
          subtitle="Mean performance"
          color="secondary"
          icon={<Award size={22} />}
        />
        <StatCard
          title="Grading Backlog"
          value={summary?.pendingGradingCount || 0}
          subtitle="Submissions pending"
          color={summary?.pendingGradingCount > 0 ? 'warning' : 'success'}
          icon={<Clock size={22} />}
        />
        <StatCard
          title="At-Risk Learners"
          value={summary?.atRiskCount || 0}
          subtitle="Requiring intervention"
          color={summary?.atRiskCount > 0 ? 'danger' : 'success'}
          icon={<AlertTriangle size={22} />}
        />
      </div>

      {/* Grade Distribution & Course Comparison */}
      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Grade Distribution (Letter Scale)</h3>
              <p className="card-subtitle">Dispersion across all taught students</p>
            </div>
          </div>
          <GradeDistributionChart data={analytics?.gradeDistribution || []} />
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Course Enrollment & Capacity Load</h3>
              <p className="card-subtitle">Active learners vs maximum capacity</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {analytics?.courseAnalytics?.map((c) => (
              <div key={c.courseId} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700 }}>{c.courseCode} - {c.title}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {c.studentCount} / {c.capacity} enrolled ({Math.round((c.studentCount / c.capacity) * 100)}%)
                  </span>
                </div>
                <ProgressBar progress={Math.round((c.studentCount / c.capacity) * 100)} showPercent={false} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                  <span>Class Mean Score: <strong>{c.classAverage}%</strong></span>
                  <span>Pending Grading: <strong>{c.pendingGradingCount} items</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* At-Risk Intervention Detailed Roster */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title" style={{ color: 'var(--danger-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} style={{ color: 'var(--danger)' }} />
              Detailed At-Risk Learner Roster & Action Plans
            </h3>
            <p className="card-subtitle">Students with attendance &lt; 75% or scores &lt; 60%</p>
          </div>
        </div>

        {analytics?.atRiskStudents?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
            ✓ No students are currently in at-risk status.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Attendance Rate</th>
                  <th>Weighted GPA</th>
                  <th>Intervention Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.atRiskStudents?.map((perf) => (
                  <tr key={perf._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={perf.studentId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                          alt={perf.studentId?.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700 }}>{perf.studentId?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{perf.studentId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>{perf.courseId?.courseCode}</strong> - {perf.courseId?.title}
                    </td>
                    <td>
                      <span style={{ color: perf.attendancePercentage < 75 ? 'var(--danger)' : 'inherit', fontWeight: 700 }}>
                        {perf.attendancePercentage}%
                      </span>
                    </td>
                    <td>
                      <span style={{ color: perf.overallScore < 60 ? 'var(--danger)' : 'inherit', fontWeight: 700 }}>
                        {perf.overallScore}%
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-danger">
                        Academic Alert Dispatched
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
