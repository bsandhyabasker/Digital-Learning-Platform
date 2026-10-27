import React, { useState, useEffect } from 'react';
import { courseService, attendanceService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { CalendarCheck, Save, CheckCircle, Clock, XCircle, Users, Check } from 'lucide-react';

export const FacultyAttendancePage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [roster, setRoster] = useState([]);
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [topicCovered, setTopicCovered] = useState('Lecture & Practical Lab');
  const [durationHours, setDurationHours] = useState(1.5);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await courseService.getCourseStudents(selectedCourseId);
        if (res.success) {
          setRoster(res.students || []);
          // Default all students to 'present'
          const initialMap = {};
          (res.students || []).forEach((st) => {
            initialMap[st.student._id] = 'present';
          });
          setAttendanceRecords(initialMap);
        }
      } catch (err) {
        console.error('Error loading course roster:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedCourseId]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords({
      ...attendanceRecords,
      [studentId]: status
    });
  };

  const handleMarkAll = (status) => {
    const newMap = {};
    roster.forEach((st) => {
      newMap[st.student._id] = status;
    });
    setAttendanceRecords(newMap);
  };

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    try {
      setSaving(true);
      const records = roster.map((st) => ({
        studentId: st.student._id,
        status: attendanceRecords[st.student._id] || 'present'
      }));

      await attendanceService.saveSession({
        courseId: selectedCourseId,
        sessionDate,
        topicCovered,
        durationHours: Number(durationHours),
        records
      });

      alert('Attendance sheet saved! Student standings and performance recalculated.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Faculty Attendance Logger</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Record classroom presence, track tardiness, and trigger automated early academic alerts.
          </p>
        </div>

        {/* Course Selector */}
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

      {/* Session Details Form Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>Session Parameters</h3>
        <div className="grid-cols-3" style={{ gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Session Date</label>
            <input
              type="date"
              className="form-input"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Lecture Topic / Lab Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Distributed Consensus State Machine"
              value={topicCovered}
              onChange={(e) => setTopicCovered(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Duration (Hours)</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="6"
              className="form-input"
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 className="card-title">Enrolled Students Presence Roster ({roster.length})</h3>
            <p className="card-subtitle">Mark each student or use quick batch selectors</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleMarkAll('present')}
              className="btn btn-secondary btn-sm"
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll('absent')}
              className="btn btn-secondary btn-sm"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading roster...
          </div>
        ) : roster.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No enrolled students in this course yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {roster.map((st) => {
              const currentStatus = attendanceRecords[st.student._id] || 'present';
              return (
                <div
                  key={st.student._id}
                  style={{
                    padding: '0.85rem 1.25rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={st.student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={st.student.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{st.student.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ID: {st.student.studentId || 'N/A'} • Overall Standing: {st.performance?.attendancePercentage || 100}%
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Status Toggles */}
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(st.student._id, 'present')}
                      className={`btn btn-sm ${currentStatus === 'present' ? 'btn-success' : 'btn-outline'}`}
                      style={{ padding: '0.35rem 0.75rem' }}
                    >
                      <Check size={14} />
                      <span>Present</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(st.student._id, 'late')}
                      className={`btn btn-sm ${currentStatus === 'late' ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '0.35rem 0.75rem', backgroundColor: currentStatus === 'late' ? '#f59e0b' : 'transparent', borderColor: currentStatus === 'late' ? '#f59e0b' : 'var(--border-medium)', color: currentStatus === 'late' ? '#ffffff' : 'inherit' }}
                    >
                      <Clock size={14} />
                      <span>Late (0.75x)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(st.student._id, 'absent')}
                      className={`btn btn-sm ${currentStatus === 'absent' ? 'btn-danger' : 'btn-outline'}`}
                      style={{ padding: '0.35rem 0.75rem' }}
                    >
                      <XCircle size={14} />
                      <span>Absent</span>
                    </button>
                  </div>
                </div>
              );
            })}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={handleSaveAttendance}
                disabled={saving}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
              >
                <Save size={18} />
                <span>{saving ? 'Saving Attendance & Recalculating...' : 'Commit Attendance Log'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
