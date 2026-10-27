import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { ProgressBar, Badge } from '../../components/common/CommonUI';
import { BookOpen, Users, Clock, Search, CheckCircle, Plus } from 'lucide-react';
import { Avatar } from '../../components/common/Avatar';

export const MyCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('enrolled'); // 'enrolled' or 'catalog'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await courseService.getCourses();
      if (res.success) {
        setCourses(res.courses || []);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      setActionLoading(courseId);
      await courseService.enroll(courseId);
      await fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Course Curricula & Enrollments</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Discover accredited subjects, explore lecture materials, and manage your degree enrollments.
          </p>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search course title or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Filter Tabs & Category Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Computer Science', 'Software Engineering', 'Cybersecurity'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading course catalog...
        </div>
      ) : filteredCourses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          No courses match your criteria.
        </div>
      ) : (
        <div className="grid-cols-3">
          {filteredCourses.map((course) => (
            <div key={course._id} className="course-card">
              <img src={course.thumbnail} alt={course.title} className="course-thumbnail" />
              <div className="course-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">{course.courseCode}</span>
                  <span className="badge badge-neutral">{course.level}</span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {course.title}
                </h3>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {course.description}
                </p>

                {/* Faculty Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', padding: '0.5rem 0.65rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <Avatar name={course.facultyId?.name || 'Faculty Assigned'} size={28} />
                  <div style={{ fontSize: '0.75rem' }}>
                    <div style={{ fontWeight: 700 }}>{course.facultyId?.name || 'Faculty Assigned'}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{course.credits} Credits • {course.semester}</div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <Link
                    to={`/student/courses/${course._id}`}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    View Curriculum
                  </Link>

                  <button
                    onClick={() => handleEnroll(course._id)}
                    disabled={actionLoading === course._id}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Plus size={14} />
                    <span>{actionLoading === course._id ? 'Enrolling...' : 'Enroll'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
