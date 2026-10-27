import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  Sparkles,
  Clock
} from 'lucide-react';

import { Avatar } from './Avatar';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'grade':
        return <CheckCircle size={16} className="text-emerald-500" style={{ color: '#10b981' }} />;
      case 'attendance_alert':
        return <AlertTriangle size={16} className="text-amber-500" style={{ color: '#f59e0b' }} />;
      case 'assignment':
        return <BookOpen size={16} style={{ color: '#c02828' }} />;
      case 'forum':
        return <HelpCircle size={16} className="text-blue-500" style={{ color: '#0ea5e9' }} />;
      default:
        return <Sparkles size={16} className="text-purple-500" style={{ color: '#a855f7' }} />;
    }
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left"></div>

      <div className="navbar-right">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-icon"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} style={{ color: '#64748b' }} />}
        </button>

        {/* Notifications Dropdown */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn btn-secondary btn-icon"
            style={{ position: 'relative' }}
            aria-label="View notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444'
                }}
              />
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '360px',
                maxHeight: '450px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 60,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  Notifications ({unreadCount} new)
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ overflowY: 'auto', maxHeight: '350px' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => {
                        markAsRead(notif._id);
                        if (notif.link) {
                          navigate(notif.link);
                          setShowNotifications(false);
                        }
                      }}
                      style={{
                        padding: '0.85rem 1rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: notif.isRead ? 'transparent' : 'var(--primary-light)',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '0.75rem',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ marginTop: '2px' }}>{getNotificationIcon(notif.type)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.825rem', fontWeight: notif.isRead ? 600 : 700, color: 'var(--text-primary)' }}>
                          {notif.title}
                        </div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {notif.message}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={10} />
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div ref={userMenuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <Avatar name={user?.name} size={36} />
            <div style={{ textAlign: 'left', display: 'none', md: 'block' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {user?.role}
              </div>
            </div>
          </button>

          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '220px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                padding: '0.5rem',
                zIndex: 60,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}
            >
              <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                <span
                  className={`badge ${
                    user?.role === 'admin'
                      ? 'badge-danger'
                      : user?.role === 'faculty'
                      ? 'badge-primary'
                      : 'badge-success'
                  }`}
                  style={{ marginTop: '0.4rem', textTransform: 'capitalize' }}
                >
                  {user?.role} Access
                </span>
              </div>

              <Link
                to="/profile"
                onClick={() => setShowUserMenu(false)}
                className="nav-item"
                style={{ padding: '0.5rem 0.75rem' }}
              >
                <User size={16} />
                <span>My Profile</span>
              </Link>

              <button
                onClick={logout}
                className="nav-item"
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem 0.75rem',
                  color: 'var(--danger)'
                }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Dedicated Direct Sign Out Button */}
        <button
          onClick={logout}
          className="btn btn-secondary btn-icon"
          title="Sign Out"
          aria-label="Sign Out"
          style={{ color: 'var(--danger)', borderColor: 'var(--border-subtle)' }}
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
};
