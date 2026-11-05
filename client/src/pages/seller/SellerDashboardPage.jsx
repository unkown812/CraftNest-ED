import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  IndianRupee,
  Package,
  Percent,
  TrendingUp
} from 'lucide-react';
import api from '../../api/client';

const STATUS_BADGES = {
  Pending: 'badge-neutral',
  Confirmed: 'badge-cream',
  Processing: 'badge-terracotta',
  Shipped: 'badge-cream',
  Delivered: 'badge-success',
  Cancelled: 'badge-error'
};

const statusBadge = (status) => STATUS_BADGES[status] || 'badge-cream';

const StatCard = ({ icon, label, value, sub }) => (
  <div className="stat-card">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-xs)' }}>
      <span className="stat-label">{label}</span>
      <span
        aria-hidden="true"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-surface-soft)',
          color: 'var(--color-ink)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {icon}
      </span>
    </div>
    <span className="stat-value">{value}</span>
    <span className="stat-sub">{sub}</span>
  </div>
);

const SellerDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/seller/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching seller dashboard:', err);
        setError(err.response?.data?.message || 'Failed to load your workshop metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page-loading" style={{ flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <div className="spinner" />
        <p className="t-caption">Loading your workshop metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-surface" style={{ marginTop: 'var(--space-lg)' }}>
        <span>{error}</span>
        <button onClick={() => { setLoading(true); setError(''); window.location.reload(); }} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
          Retry
        </button>
      </div>
    );
  }

  const stats = data?.stats || {};
  const lowStock = data?.lowStockProducts || [];
  const recentOrders = data?.recentOrders || [];
  const chartData = data?.chartData || [];

  const maxSaleInChart = Math.max(...chartData.map(d => d.sales), 1000);
  const todayKey = new Date().toDateString();

  return (
    <div className="page-stack">
      {/* Page header */}
      <div className="toolbar">
        <div>
          <p className="t-caption" style={{ marginBottom: 'var(--space-xs)' }}>Seller Dashboard</p>
          <h1 className="t-headline" style={{ margin: 0 }}>Workshop Overview</h1>
          <p className="t-body-sm" style={{ margin: 'var(--space-xxs) 0 0 0' }}>
            Real-time metrics calculated directly from verified customer orders
          </p>
        </div>
        <div className="toolbar-spacer" />
      </div>

      {/* Key Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'var(--space-md)' }}>
        <StatCard
          icon={<TrendingUp size={16} />}
          label="Gross Sales"
          value={`₹${stats.grossSales?.toLocaleString('en-IN') || 0}`}
          sub="All verified customer purchases"
        />

        <StatCard
          icon={<IndianRupee size={16} />}
          label="Your Net Earnings"
          value={`₹${stats.netEarnings?.toLocaleString('en-IN') || 0}`}
          sub={`After ${stats.commissionPercent || 10}% platform commission (₹${stats.platformCommission?.toLocaleString('en-IN') || 0})`}
        />

        <StatCard
          icon={<Clock size={16} />}
          label="Pending Fulfillment"
          value={stats.pendingOrdersCount || 0}
          sub="Requires packing / dispatch"
        />

        <StatCard
          icon={<Package size={16} />}
          label="Live Creations"
          value={stats.totalProducts || 0}
          sub="Active listed craft items"
        />

        <StatCard
          icon={<Percent size={16} />}
          label="Platform Fee"
          value={`₹${stats.platformCommission?.toLocaleString('en-IN') || 0}`}
          sub={`${stats.commissionPercent || 10}% of gross sales`}
        />
      </div>

      {/* Grid: 7-Day Sales Trend Bar Chart + Low Stock Alert Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'var(--space-lg)' }}>
        {/* Sales Chart Card */}
        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
            <h3 className="t-card-title" style={{ margin: 0 }}>Sales Trend (Last 7 Days)</h3>
            <span className="badge badge-outline">Realtime Orders</span>
          </div>

          {/* Bar Chart Visualization — black bars, lime highlight for today */}
          <div
            style={{
              position: 'relative',
              height: '200px',
              display: 'flex',
              alignItems: 'flex-end',
              gap: 'var(--space-md)',
              padding: '10px 0',
              borderBottom: '1px solid var(--color-hairline-soft)'
            }}
          >
            <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: '33%', borderTop: '1px solid var(--color-hairline-soft)' }} />
            <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: '66%', borderTop: '1px solid var(--color-hairline-soft)' }} />

            {chartData.map((cd, idx) => {
              const heightPct = Math.max(8, Math.round((cd.sales / maxSaleInChart) * 100));
              const formattedDate = new Date(cd.date).toLocaleDateString('en-IN', { weekday: 'short' });
              const isToday = new Date(cd.date).toDateString() === todayKey;

              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                    gap: '6px',
                    position: 'relative'
                  }}
                >
                  <div className="t-caption">{cd.sales > 0 ? `₹${cd.sales}` : ''}</div>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '38px',
                      height: `${heightPct}%`,
                      backgroundColor:
                        isToday && cd.sales > 0
                          ? 'var(--color-block-lime)'
                          : cd.sales > 0
                            ? 'var(--color-primary)'
                            : 'var(--color-hairline-soft)',
                      borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                      transition: 'height var(--transition-normal)'
                    }}
                    title={`${cd.date}: ₹${cd.sales}`}
                  />
                  <div className="t-caption" style={{ marginTop: 'var(--space-xxs)' }}>{formattedDate}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts — block-cream warning panel */}
        <div
          style={{
            backgroundColor: 'var(--color-block-cream)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <AlertTriangle size={18} color="var(--color-semantic-warning)" aria-hidden="true" />
              <h3 className="t-card-title" style={{ margin: 0 }}>Low Stock Alerts</h3>
            </div>
            <Link to="/seller/products" className="btn btn-secondary btn-sm">
              Manage Stock
            </Link>
          </div>

          {lowStock.length === 0 ? (
            <div className="card-tile" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', padding: 'var(--space-md)' }}>
              <CheckCircle size={16} color="var(--color-semantic-success)" aria-hidden="true" />
              <p className="t-body-sm" style={{ margin: 0 }}>All your craft items have sufficient inventory.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {lowStock.map((prod) => (
                <div
                  key={prod._id}
                  className="card-tile"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-sm)', padding: 'var(--space-xs) var(--space-sm)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div className="img-frame" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'}
                        alt={prod.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="t-body-sm" style={{ fontWeight: 540 }}>{prod.name}</div>
                      <div className="t-caption" style={{ marginTop: 'var(--space-xxs)' }}>₹{prod.price}</div>
                    </div>
                  </div>

                  <span className="badge badge-warning">
                    {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card" style={{ padding: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <h3 className="t-card-title" style={{ margin: 0 }}>Recent Orders</h3>
          <Link to="/seller/orders" className="btn btn-secondary btn-sm">
            <span>View All Orders</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="t-body-sm" style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
            No recent orders. Promote your shop to start receiving customer orders!
          </p>
        ) : (
          <div className="table-wrap">
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order Number</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Seller Value</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((ord) => (
                    <tr key={ord.orderId}>
                      <td style={{ fontWeight: 540 }}>#{ord.orderNumber}</td>
                      <td>{ord.customerName}</td>
                      <td>{ord.itemsCount} creation(s)</td>
                      <td style={{ fontWeight: 540 }}>
                        ₹{ord.sellerTotal.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className={`badge ${statusBadge(ord.itemStatuses?.[0] || 'Confirmed')}`}>
                          {ord.itemStatuses?.[0] || 'Confirmed'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to="/seller/orders" className="btn btn-secondary btn-sm">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboardPage;
