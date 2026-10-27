import React, { useState, useEffect } from 'react';
import { userService } from '../../services/courseService';
import { DataTable } from '../../components/common/DataTable';
import { Modal, Badge } from '../../components/common/CommonUI';
import { Users, Plus, Shield, UserX, UserCheck, Edit3, Trash2 } from 'lucide-react';
import { Avatar } from '../../components/common/Avatar';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: 'Password@123',
    role: 'student',
    department: 'Computer Science',
    studentId: '',
    employeeId: ''
  });
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers({
        role: roleFilter === 'all' ? undefined : roleFilter
      });
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await userService.createUser(newUserForm);
      setShowCreateModal(false);
      setNewUserForm({
        name: '',
        email: '',
        password: 'Password@123',
        role: 'student',
        department: 'Computer Science',
        studentId: '',
        employeeId: ''
      });
      await fetchUsers();
      alert('User provisioned successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    if (window.confirm(`Set status of ${user.name} to ${nextStatus.toUpperCase()}?`)) {
      try {
        await userService.updateUser(user._id, { status: nextStatus });
        await fetchUsers();
      } catch (err) {
        alert('Failed to update status');
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this user account?')) {
      try {
        await userService.deleteUser(id);
        await fetchUsers();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const columns = [
    {
      header: 'User Identity',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Avatar name={row.name} size={36} />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role & ID',
      accessor: 'role',
      render: (row) => (
        <div>
          <span
            className={`badge ${
              row.role === 'admin'
                ? 'badge-danger'
                : row.role === 'faculty'
                ? 'badge-primary'
                : 'badge-success'
            }`}
            style={{ textTransform: 'capitalize' }}
          >
            {row.role}
          </span>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>
            {row.studentId || row.employeeId || 'ID Unassigned'}
          </div>
        </div>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => <span>{row.department || 'General Academic'}</span>
    },
    {
      header: 'Access Status',
      accessor: 'status',
      render: (row) => (
        <span className={`badge ${row.status === 'active' ? 'badge-success' : 'badge-danger'}`} style={{ textTransform: 'uppercase' }}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Joined On',
      accessor: 'createdAt',
      render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            onClick={() => handleToggleStatus(row)}
            className="btn btn-secondary btn-sm"
            title={row.status === 'active' ? 'Suspend Access' : 'Activate Access'}
          >
            {row.status === 'active' ? <UserX size={14} style={{ color: 'var(--danger)' }} /> : <UserCheck size={14} style={{ color: 'var(--success)' }} />}
          </button>
          <button
            onClick={() => handleDeleteUser(row._id)}
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--danger)' }}
            title="Delete User"
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>User Management & RBAC Directory</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Provision campus members, manage roles, configure academic departments, and control authorization.
          </p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Provision New User</span>
        </button>
      </div>

      {/* Role Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'all', label: 'All Platform Members' },
          { id: 'student', label: 'Students' },
          { id: 'faculty', label: 'Faculty Members' },
          { id: 'admin', label: 'System Administrators' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setRoleFilter(tab.id)}
            className={`btn btn-sm ${roleFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users DataTable Card */}
      <div className="card">
        <DataTable
          columns={columns}
          data={users}
          searchPlaceholder="Search by name, email, or student ID..."
          searchField="name"
          emptyMessage="No users found matching current filters."
        />
      </div>

      {/* Provision User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Provision Platform User"
        maxWidth="600px"
      >
        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label className="form-label">Full Legal Name</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Jordan Smith"
              value={newUserForm.name}
              onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Institutional Email</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="e.g. jordan.smith@edupulse.edu"
              value={newUserForm.email}
              onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
            />
          </div>

          <div className="grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Role Assignment</label>
              <select
                className="form-select"
                value={newUserForm.role}
                onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty Member</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={newUserForm.department}
                onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Data Engineering">Data Engineering</option>
                <option value="Office of Academic Affairs">Office of Academic Affairs</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Initial Default Password</label>
            <input
              type="text"
              className="form-input"
              value={newUserForm.password}
              onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="btn btn-primary"
            >
              {creating ? 'Provisioning...' : 'Create & Issue Credentials'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
