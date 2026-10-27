import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/CommonUI';
import { BookOpen, ShieldCheck, Trash2, Edit3, Eye, Layers } from 'lucide-react';

export const CourseAuditPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      const res = await courseService.getCourses();
      if (res.success) {
        setCourses(res.courses || []);
      }
    } catch (err) {
      console.error('Error fetching courses for audit:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const handleToggleStatus = async (course) => {
    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    try {
      await courseService.updateCourse(course._id, { status: nextStatus });
      await fetchAllCourses();
    } catch (err) {
      alert('Failed to update course status');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Permanently delete this course and all associated student enrollments?')) {
      try {
        await courseService.deleteCourse(id);
        await fetchAllCourses();
      } catch (err) {
        alert('Failed to delete course');
      }
    }
  };

  const columns = [
    {
      header: 'Course Code & Title',
      accessor: 'title',
      render: (row) => (
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '2px' }}>{row.courseCode}</span>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.category}</div>
        </div>
      )
    },
    {
      header: 'Assigned Faculty',
      accessor: 'facultyId.name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img
            src={row.facultyId?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80'}
            alt={row.facultyId?.name}
            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{row.facultyId?.name || 'Unassigned'}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{row.facultyId?.department}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Enrollment Density',
      accessor: 'capacity',
      render: (row) => (
        <div>
          <strong>{row.activeStudentsCount || 0}</strong> / {row.capacity} Seats
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {Math.round(((row.activeStudentsCount || 0) / (row.capacity || 1)) * 100)}% Capacity
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span
          className={`badge ${
            row.status === 'published'
              ? 'badge-success'
              : row.status === 'draft'
              ? 'badge-warning'
              : 'badge-neutral'
          }`}
          style={{ textTransform: 'uppercase' }}
        >
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            onClick={() => handleToggleStatus(row)}
            className="btn btn-secondary btn-sm"
            title={row.status === 'published' ? 'Unpublish Course' : 'Publish Course'}
          >
            {row.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={() => handleDeleteCourse(row._id)}
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--danger)' }}
            title="Delete Course"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Course Catalog Audit & Governance</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Institutional oversight of course offerings, seat capacities, accreditation standards, and publishing lifecycle.
        </p>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={courses}
          searchPlaceholder="Search by course code or title..."
          searchField="title"
        />
      </div>
    </div>
  );
};
