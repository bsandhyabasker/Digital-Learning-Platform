import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/courseService';
import { StatCard, Badge, ProgressBar } from '../../components/common/CommonUI';
import { GradeDistributionChart } from '../../components/charts/ChartWidgets';
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Server,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminAnalytics = async () => {
      try {
        setLoading(true);
        const res = await analyticsService.getAdminAnalytics();
        if (res.success) {
          setAnalytics(res);
        }
      } catch (err) {
        console.error('Error fetching admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAdminAnalytics();
  }, []);

  const metrics = analytics?.metrics;

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Dashboard</h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/users" className="btn btn-primary btn-sm">
            <Users size={16} />
            <span>Manage User Directory</span>
          </Link>
          <Link to="/admin/courses" className="btn btn-secondary btn-sm">
            <ShieldCheck size={16} />
            <span>Course Catalog Audit</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Total Platform Users"
          value={metrics?.totalUsers || 0}
          color="primary"
          icon={<Users size={22} />}
        />
        <StatCard
          title="Published Courses"
          value={metrics?.publishedCourses || 0}
          color="secondary"
          icon={<BookOpen size={22} />}
        />
        <StatCard
          title="Active Enrollments"
          value={metrics?.totalEnrollments || 0}
          color="success"
          icon={<Layers size={22} />}
        />
        <StatCard
          title="Institutional Average"
          value={`${metrics?.institutionalAverage || 84}%`}
          color="warning"
          icon={<TrendingUp size={22} />}
        />
      </div>

      {/* Middle Grid: Popular Courses & System Health */}
      <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
        {/* Top Enrolled Courses */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Top Enrolled Curricula</h3>
            </div>
            <Link to="/admin/courses" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              View Courses →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {analytics?.topCourses?.map((tc) => (
              <div
                key={tc._id}
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '0.2rem' }}>{tc.courseCode}</span>
                  <h4 style={{ fontSize: '0.95rem' }}>{tc.title}</h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tc.category}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                    {tc.enrollments} Students
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Operations & Health Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">System Health & Metrics</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>MERN Core API</span>
              <span className="badge badge-success">● Operational</span>
            </div>

            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>MongoDB Database</span>
              <span className="badge badge-success">● Connected</span>
            </div>

            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Submissions</span>
              <strong>{metrics?.totalSubmissions || 0}</strong>
            </div>

            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Quizzes Evaluated</span>
              <strong>{metrics?.totalQuizzesTaken || 0}</strong>
            </div>

            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Forum Discussions</span>
              <strong>{metrics?.totalDiscussions || 0}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Grade Distribution */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Campus-Wide Grade Curve</h3>
            <p className="card-subtitle">Aggregate academic standing across all degree programs</p>
          </div>
        </div>
        <GradeDistributionChart data={analytics?.gradeDistribution || []} />
      </div>
    </div>
  );
};
