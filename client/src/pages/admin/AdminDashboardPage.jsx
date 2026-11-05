import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Save } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commissionRate, setCommissionRate] = useState(10);
  const [savingSettings, setSavingSettings] = useState(false);
  const { addToast } = useToast();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setData(res.data);
        if (res.data.settings?.commissionPercent !== undefined) {
          setCommissionRate(res.data.settings.commissionPercent);
        }
      }
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSaveCommission = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const res = await api.patch('/admin/settings', { commissionPercent: commissionRate });
      if (res.data.success) {
        addToast('Platform commission rate updated!', 'success');
        fetchDashboard();
      }
    } catch (err) {
      addToast('Failed to update platform settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];
  const recentUsers = data?.recentUsers || [];

  const orderStatusBadge = (status) =>
    status === 'Delivered' ? 'badge-success' : status === 'Cancelled' ? 'badge-error' : 'badge-cream';

  const roleBadge = (role) =>
    role === 'admin' ? 'badge-navy' : role === 'seller' ? 'badge-mint' : 'badge-cream';

  return (
    <div className="page-stack" style={{ gap: 'var(--space-xl)' }}>
      {/* Page header */}
      <div className="toolbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xxs)' }}>
          <span className="t-caption">Admin console</span>
          <h1 className="t-headline" style={{ margin: 0 }}>
            Marketplace Control Center
          </h1>
          <p className="t-body-sm w330" style={{ margin: 0 }}>
            Platform metrics, seller approvals, revenue, and policy configuration
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
          gap: 'var(--space-md)'
        }}
      >
        <div className="stat-card">
          <span className="stat-label">Platform GMV</span>
          <div className="stat-value w540">
            ₹{stats.totalPlatformRevenue?.toLocaleString('en-IN') || 0}
          </div>
          <span className="stat-sub">Gross merchandise value</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Commission Earned</span>
          <div className="stat-value w540">
            ₹{stats.totalCommissionEarned?.toLocaleString('en-IN') || 0}
          </div>
          <span className="stat-sub">At {stats.commissionPercent}% platform cut</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Makers &amp; Sellers</span>
          <div className="stat-value w540">{stats.totalSellers || 0}</div>
          <span className="stat-sub">
            {stats.pendingSellersCount
              ? `${stats.pendingSellersCount} pending approvals`
              : 'All accounts approved'}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Marketplace Orders</span>
          <div className="stat-value w540">{stats.totalOrders || 0}</div>
          <span className="stat-sub">Across {stats.totalUsers || 0} registered members</span>
        </div>
      </div>

      {/* Commission configuration */}
      <div className="card" style={{ padding: 'var(--space-lg)' }}>
        <h3 className="t-card-title">Marketplace Commission Configuration</h3>
        <p className="t-body-sm w330" style={{ marginTop: 'var(--space-xxs)' }}>
          Configure the percentage commission deducted automatically on seller orders to maintain
          platform operations.
        </p>

        <form
          onSubmit={handleSaveCommission}
          className="toolbar"
          style={{ marginTop: 'var(--space-md)' }}
        >
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="commission-rate">
              Platform Commission (%)
            </label>
            <input
              id="commission-rate"
              type="number"
              min="0"
              max="50"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="form-input"
              style={{ width: '120px' }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={savingSettings}
            className="btn btn-sm btn-primary"
            style={{ alignSelf: 'flex-end' }}
          >
            {savingSettings && <div className="spinner-sm" />}
            <Save size={15} aria-hidden="true" />
            <span>{savingSettings ? 'Updating...' : 'Update Commission Rate'}</span>
          </button>
        </form>
      </div>

      {/* Two columns: Recent Orders & Recent Users */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'var(--space-lg)'
        }}
      >
        {/* Recent Orders */}
        <div className="card">
          <div
            style={{
              padding: 'var(--space-md) var(--space-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--color-hairline)'
            }}
          >
            <h3 className="t-card-title">Recent Orders</h3>
            <Link to="/admin/orders" className="btn btn-ghost btn-sm">
              View All
            </Link>
          </div>

          <div
            style={{
              padding: 'var(--space-md) var(--space-lg) var(--space-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-xs)'
            }}
          >
            {recentOrders.length === 0 ? (
              <p className="t-body-sm w330" style={{ margin: 0 }}>
                No recent marketplace orders yet.
              </p>
            ) : (
              recentOrders.map((ord) => (
                <div
                  key={ord._id}
                  className="tile"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px var(--space-md)'
                  }}
                >
                  <div>
                    <div className="t-body-sm w480">#{ord.orderNumber}</div>
                    <div className="t-caption" style={{ marginTop: 'var(--space-xxs)' }}>
                      {ord.buyerId?.name || 'Customer'} • ₹{ord.total.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span className={`badge ${orderStatusBadge(ord.orderStatus)}`}>
                    {ord.orderStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Registered Users */}
        <div className="card">
          <div
            style={{
              padding: 'var(--space-md) var(--space-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--color-hairline)'
            }}
          >
            <h3 className="t-card-title">Registered Users</h3>
            <Link to="/admin/users" className="btn btn-ghost btn-sm">
              Manage Directory
            </Link>
          </div>

          <div
            style={{
              padding: 'var(--space-md) var(--space-lg) var(--space-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-xs)'
            }}
          >
            {recentUsers.length === 0 ? (
              <p className="t-body-sm w330" style={{ margin: 0 }}>
                No recently registered users.
              </p>
            ) : (
              recentUsers.map((u) => (
                <div
                  key={u._id}
                  className="tile"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px var(--space-md)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      className="avatar avatar-lilac"
                      style={{ width: '32px', height: '32px', fontSize: '13px' }}
                    >
                      {u.name ? u.name[0] : 'U'}
                    </span>
                    <div>
                      <div className="t-body-sm w480">{u.name}</div>
                      <div className="t-caption" style={{ marginTop: 'var(--space-xxs)' }}>
                        {u.email}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${roleBadge(u.role)}`}>{u.role}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
