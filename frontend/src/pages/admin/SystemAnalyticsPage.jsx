import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/courseService';
import { StatCard, Badge, ProgressBar } from '../../components/common/CommonUI';
import { GradeDistributionChart } from '../../components/charts/ChartWidgets';
import { TrendingUp, Users, BookOpen, Layers, Award, Activity } from 'lucide-react';

export const SystemAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminAnalytics = async () => {
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
    fetchAdminAnalytics();
  }, []);

  const metrics = analytics?.metrics;

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
        Aggregating Platform Intelligence...
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Institutional Analytics & Growth Intelligence</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Real-time intelligence on learner demographics, course completion velocity, and campus academic curves.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Active Students"
          value={metrics?.studentCount || 0}
          subtitle="Enrolled degree candidates"
          color="primary"
          icon={<Users size={22} />}
        />
        <StatCard
          title="Faculty Scholars"
          value={metrics?.facultyCount || 0}
          subtitle="Teaching staff"
          color="secondary"
          icon={<Award size={22} />}
        />
        <StatCard
          title="Active Enrollments"
          value={metrics?.totalEnrollments || 0}
          subtitle="Total course seats"
          color="success"
          icon={<Layers size={22} />}
        />
        <StatCard
          title="Campus Mean Grade"
          value={`${metrics?.institutionalAverage || 84}%`}
          subtitle="Overall academic standing"
          color="warning"
          icon={<TrendingUp size={22} />}
        />
      </div>

      {/* Grade Curve & Department Distribution */}
      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Campus-Wide Grade Curve</h3>
              <p className="card-subtitle">Aggregate academic standing distribution</p>
            </div>
          </div>
          <GradeDistributionChart data={analytics?.gradeDistribution || []} />
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Department Distribution</h3>
              <p className="card-subtitle">Student enrollment across academic faculties</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {analytics?.departmentDistribution?.map((dept, idx) => (
              <div key={idx} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700 }}>{dept.department}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{dept.count} Members</span>
                </div>
                <ProgressBar progress={Math.min(100, Math.round((dept.count / (metrics?.totalUsers || 1)) * 100))} showPercent={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
