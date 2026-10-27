import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  HelpCircle,
  CalendarCheck,
  TrendingUp,
  MessageSquare,
  Users,
  ShieldCheck,
  GraduationCap,
  Layers,
  Sparkles,
  ClipboardList,
  LogOut
} from 'lucide-react';

import { Avatar } from './Avatar';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const role = user?.role || 'student';

  const studentLinks = [
    { name: 'Dashboard', to: '/student', icon: <LayoutDashboard size={18} /> },
    { name: 'My Courses', to: '/student/courses', icon: <BookOpen size={18} /> },
    { name: 'Assignments', to: '/student/assignments', icon: <FileCheck2 size={18} /> },
    { name: 'Quizzes & Tests', to: '/student/quizzes', icon: <HelpCircle size={18} /> },
    { name: 'Attendance', to: '/student/attendance', icon: <CalendarCheck size={18} /> },
    { name: 'Performance Analytics', to: '/student/analytics', icon: <TrendingUp size={18} /> }
  ];

  const facultyLinks = [
    { name: 'Overview', to: '/faculty', icon: <LayoutDashboard size={18} /> },
    { name: 'Course Management', to: '/faculty/courses', icon: <Layers size={18} /> },
    { name: 'Grading Panel', to: '/faculty/grading', icon: <ClipboardList size={18} /> },
    { name: 'Attendance Logger', to: '/faculty/attendance', icon: <CalendarCheck size={18} /> },
    { name: 'Quiz Builder', to: '/faculty/quizzes', icon: <HelpCircle size={18} /> },
    { name: 'Cohort Analytics', to: '/faculty/analytics', icon: <TrendingUp size={18} /> }
  ];

  const adminLinks = [
    { name: 'Executive Overview', to: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'User Management', to: '/admin/users', icon: <Users size={18} /> },
    { name: 'Course Catalog Audit', to: '/admin/courses', icon: <ShieldCheck size={18} /> },
    { name: 'System Analytics', to: '/admin/analytics', icon: <TrendingUp size={18} /> }
  ];

  const currentNavLinks =
    role === 'admin' ? adminLinks : role === 'faculty' ? facultyLinks : studentLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="brand-logo">
          <div className="brand-icon-box">
            <GraduationCap size={20} />
          </div>
          <div>
            <span style={{ color: 'var(--primary)' }}>Edu</span>
            <span>Pulse</span>
          </div>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">
          {role === 'admin' ? 'Administration' : role === 'faculty' ? 'Faculty Suite' : 'Student Portal'}
        </div>

        {currentNavLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/student' || item.to === '/faculty' || item.to === '/admin'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}

        {role !== 'admin' && (
          <>
            <div className="nav-section-title" style={{ marginTop: '1rem' }}>
              Community & Resources
            </div>

            <NavLink
              to="/forum"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <MessageSquare size={18} />
              <span>Discussion Forums</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <div className="user-profile-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Avatar name={user?.name} size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.825rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {role === 'admin' ? 'Administrator' : `${user?.role} • ${user?.department || 'Academic'}`}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-outline btn-sm"
          style={{
            width: '100%',
            justifyContent: 'center',
            color: 'var(--danger)',
            borderColor: 'var(--danger-light)',
            fontWeight: 600,
            gap: '0.45rem',
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.04)'
          }}
          title="Sign out of your account"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
