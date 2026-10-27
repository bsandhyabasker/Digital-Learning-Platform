import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { User, Mail, Building, Phone, Shield, Save, CheckCircle, LogOut } from 'lucide-react';

import { Avatar } from '../../components/common/Avatar';

export const ProfilePage = () => {
  const { user, updateProfileState, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    bio: user?.bio || '',
    phone: user?.phone || ''
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg('');
      const res = await authService.updateProfile(formData);
      if (res.success) {
        updateProfileState(res.user);
        setSuccessMsg('Profile details updated successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Institutional Profile & Preferences</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Manage your verified credentials, academic bio, and communication preferences.
        </p>
      </div>

      {successMsg && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: 'var(--success-light)',
            color: 'var(--success-text)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600
          }}
        >
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Avatar & Identity Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <Avatar name={user?.name} size={72} fontSize="1.5rem" />
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{user?.name}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                <span className="badge badge-primary" style={{ textTransform: 'uppercase' }}>
                  {user?.role} Privileges
                </span>
                <span className="badge badge-neutral">
                  {user?.studentId || user?.employeeId || 'ID Unassigned'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid-cols-2" style={{ gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="form-input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Institutional Email (Fixed)</label>
              <input
                type="email"
                disabled
                className="form-input"
                value={user?.email || ''}
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="grid-cols-2" style={{ gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Academic Department</label>
              <input
                type="text"
                name="department"
                className="form-input"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Academic Biography & Focus Area</label>
            <textarea
              name="bio"
              rows={3}
              className="form-textarea"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={logout}
              className="btn btn-outline"
              style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)', gap: '0.4rem' }}
            >
              <LogOut size={16} />
              <span>Sign Out Account</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              <Save size={16} />
              <span>{saving ? 'Saving Profile...' : 'Save Profile Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
