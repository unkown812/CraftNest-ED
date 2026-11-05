import React, { useState, useEffect } from 'react';
import { Users, Search, RotateCcw } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const { addToast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (roleFilter) params.role = roleFilter;

      const res = await api.get('/admin/users', { params });
      if (res.data.success) {
        setUsers(res.data.users);
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.accountStatus === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Are you sure you want to mark ${user.name} as ${newStatus}?`)) {
      return;
    }

    try {
      setUpdatingId(user._id);
      const res = await api.patch(`/admin/users/${user._id}/status`, { status: newStatus });
      if (res.data.success) {
        addToast(`User ${user.name} set to ${newStatus}`, 'success');
        fetchUsers();
      }
    } catch (err) {
      addToast('Failed to update user status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const roleBadge = (role) =>
    role === 'admin' ? 'badge-navy' : role === 'seller' ? 'badge-mint' : 'badge-cream';

  const statusBadge = (status) => (status === 'active' ? 'badge-success' : 'badge-neutral');

  return (
    <div className="page-stack" style={{ gap: 'var(--space-lg)' }}>
      {/* Page header + filters */}
      <div className="toolbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xxs)' }}>
          <span className="t-caption">Admin console</span>
          <h1 className="t-headline" style={{ margin: 0 }}>
            User Directory &amp; Permissions
          </h1>
          <p className="t-body-sm w330" style={{ margin: 0 }}>
            Inspect buyers, artisan sellers, administrators, and manage active status
          </p>
        </div>

        <div className="toolbar-spacer" />

        <div className="toolbar">
          <form onSubmit={handleSearchSubmit} className="toolbar">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="t-caption" htmlFor="user-search">
                Search
              </label>
              <input
                id="user-search"
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ width: '240px', minHeight: '36px', padding: '6px 14px' }}
              />
            </div>
            <button
              type="submit"
              className="btn-icon btn-icon-primary btn-sm"
              aria-label="Search users"
              style={{ alignSelf: 'flex-end' }}
            >
              <Search size={15} aria-hidden="true" />
            </button>
          </form>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="t-caption" htmlFor="role-filter">
              Role
            </label>
            <select
              id="role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minHeight: '36px', padding: '6px 30px 6px 12px' }}
            >
              <option value="">All Roles</option>
              <option value="buyer">Buyers Only</option>
              <option value="seller">Sellers Only</option>
              <option value="admin">Admins Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="table-wrap">
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        className="avatar"
                        style={{ width: '32px', height: '32px', fontSize: '13px' }}
                      >
                        {u.name ? u.name[0] : 'U'}
                      </span>
                      <span className="t-body-sm w480">{u.name}</span>
                    </div>
                  </td>
                  <td className="t-body-sm w330">{u.email}</td>
                  <td>
                    <span className={`badge ${roleBadge(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="t-body-sm">{u.phone || '—'}</td>
                  <td>
                    <span className={`badge ${statusBadge(u.accountStatus)}`}>{u.accountStatus}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {u.role !== 'admin' &&
                      (u.accountStatus === 'active' ? (
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={updatingId === u._id}
                          className="btn btn-sm btn-danger"
                          aria-label={`Suspend ${u.name}`}
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={updatingId === u._id}
                          className="btn-icon btn-icon-ghost"
                          aria-label={`Activate ${u.name}`}
                        >
                          <RotateCcw size={16} aria-hidden="true" />
                        </button>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading ? (
          <div className="page-loading">
            <div className="spinner" />
          </div>
        ) : (
          users.length === 0 && (
            <div style={{ padding: '0 var(--space-lg) var(--space-xl)' }}>
              <div className="empty-state">
                <span className="empty-icon">
                  <Users size={22} aria-hidden="true" />
                </span>
                <h3 className="t-headline">No members found</h3>
                <p className="t-body-sm w330">
                  Try a different name, email, or role filter to locate the member.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
