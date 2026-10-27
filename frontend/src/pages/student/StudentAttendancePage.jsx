import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/courseService';
import { StatCard, ProgressBar, Badge } from '../../components/common/CommonUI';
import { CalendarCheck, AlertTriangle, CheckCircle, Clock, XCircle, ShieldAlert } from 'lucide-react';

export const StudentAttendancePage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await attendanceService.getMySummary();
        if (res.success) {
          setSummary(res);
        }
      } catch (err) {
        console.error('Failed to load student attendance summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const isAtRisk = summary?.isOverallAtRisk;

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Attendance & Classroom Presence</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Official institutional log of session attendance, tardiness metrics, and threshold compliance.
        </p>
      </div>

      {/* Threshold Alert Banner if < 75% */}
      {isAtRisk && (
        <div
          style={{
            backgroundColor: 'var(--danger-light)',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <ShieldAlert size={28} style={{ color: 'var(--danger)' }} />
          <div>
            <div style={{ fontWeight: 800, color: 'var(--danger-text)', fontSize: '1rem' }}>
              Academic Threshold Warning: Attendance Deficit (Below 75%)
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--danger-text)', marginTop: '2px' }}>
              University policy mandates at least 75% classroom presence. Falling below this threshold may affect examination eligibility. Please coordinate with your course faculty.
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Overall Attendance Rate"
          value={`${summary?.overallPercentage || 0}%`}
          subtitle={isAtRisk ? 'Non-compliant (Below 75%)' : 'Academic Standing: Good'}
          color={isAtRisk ? 'danger' : 'success'}
          icon={<CalendarCheck size={22} />}
        />
        <StatCard
          title="Active Course Tracking"
          value={summary?.courseSummaries?.length || 0}
          subtitle="Monitored courses"
          color="primary"
          icon={<Clock size={22} />}
        />
        <StatCard
          title="At-Risk Courses"
          value={summary?.courseSummaries?.filter((c) => c.isAtRisk)?.length || 0}
          subtitle="Courses below 75%"
          color={summary?.courseSummaries?.some((c) => c.isAtRisk) ? 'danger' : 'success'}
          icon={<AlertTriangle size={22} />}
        />
      </div>

      {/* Course Attendance Breakdown Cards */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Subject-Wise Attendance Breakdown</h3>
            <p className="card-subtitle">Real-time presence metrics across registered courses</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading attendance records...
          </div>
        ) : summary?.courseSummaries?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No registered course attendance found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {summary?.courseSummaries?.map((item) => (
              <div
                key={item.course._id}
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span className="badge badge-primary">{item.course.courseCode}</span>
                    <h4 style={{ fontSize: '1.05rem', marginTop: '0.25rem' }}>{item.course.title}</h4>
                  </div>

                  <div>
                    <span className={`badge ${item.isAtRisk ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '0.85rem' }}>
                      {item.percentage}% ({item.isAtRisk ? 'At Risk (Below 75%)' : 'Satisfactory'})
                    </span>
                  </div>
                </div>

                <div className="grid-cols-4" style={{ gap: '0.75rem', marginTop: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TOTAL SESSIONS</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.totalSessions}</div>
                  </div>
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#10b981' }}>PRESENT</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>{item.present}</div>
                  </div>
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#f59e0b' }}>LATE (0.75x)</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>{item.late}</div>
                  </div>
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#ef4444' }}>ABSENT</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444' }}>{item.absent}</div>
                  </div>
                </div>

                <ProgressBar progress={item.percentage} label="Attendance Threshold Progress" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
