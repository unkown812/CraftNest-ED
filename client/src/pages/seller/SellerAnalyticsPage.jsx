import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, IndianRupee, Package, Percent } from 'lucide-react';
import api from '../../api/client';

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

const SellerAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/seller/analytics');
        if (res.data.success) {
          setAnalytics(res.data.analytics);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err.response?.data?.message || 'Failed to load your analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="page-loading" style={{ flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <div className="spinner" />
        <p className="t-caption">Calculating sales performance...</p>
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

  const bestSellers = analytics?.bestSellers || [];

  return (
    <div className="page-stack">
      {/* Page header */}
      <div className="toolbar">
        <div>
          <p className="t-caption" style={{ marginBottom: 'var(--space-xs)' }}>Performance</p>
          <h1 className="t-headline" style={{ margin: 0 }}>Sales &amp; Product Analytics</h1>
          <p className="t-body-sm" style={{ margin: 'var(--space-xxs) 0 0 0' }}>
            Real sales performance, popular handcrafted creations, and revenue shares
          </p>
        </div>
        <div className="toolbar-spacer" />
      </div>

      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))', gap: 'var(--space-md)' }}>
        <StatCard
          icon={<Package size={16} />}
          label="Total Items Sold"
          value={analytics?.totalItemsSold || 0}
          sub="Creations delivered to patrons"
        />

        <StatCard
          icon={<TrendingUp size={16} />}
          label="Gross Sales Value"
          value={`₹${analytics?.totalGrossRevenue?.toLocaleString('en-IN') || 0}`}
          sub="Total customer spending"
        />

        <StatCard
          icon={<Percent size={16} />}
          label={`Platform Fee (${analytics?.commissionPercent || 10}%)`}
          value={`₹${analytics?.totalCommission?.toLocaleString('en-IN') || 0}`}
          sub="Marketplace maintenance & payment gateway"
        />

        <StatCard
          icon={<IndianRupee size={16} />}
          label="Net Artisan Payout"
          value={`₹${analytics?.netEarnings?.toLocaleString('en-IN') || 0}`}
          sub="Your direct earnings"
        />
      </div>

      {/* Best-selling creations */}
      <div className="card" style={{ padding: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)', borderBottom: '1px solid var(--color-hairline-soft)', paddingBottom: 'var(--space-xs)' }}>
          <Award size={18} aria-hidden="true" />
          <h3 className="t-card-title" style={{ margin: 0 }}>Top Performing Artisan Creations</h3>
        </div>

        {bestSellers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Award size={24} aria-hidden="true" />
            </div>
            <p>Analytics will populate once orders are processed.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Creation</th>
                    <th>Units Sold</th>
                    <th style={{ textAlign: 'right' }}>Gross Generated</th>
                  </tr>
                </thead>
                <tbody>
                  {bestSellers.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className={`badge ${idx === 0 ? 'badge-selected' : 'badge-outline'}`}>
                          {`#${idx + 1}`}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                          {item.image && (
                            <div className="img-frame" style={{ width: '44px', height: '44px', flexShrink: 0 }}>
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 540 }}>{item.name}</div>
                            <div className="t-caption" style={{ marginTop: 'var(--space-xxs)' }}>
                              {item.unitsSold} units purchased by patrons
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{item.unitsSold}</td>
                      <td style={{ textAlign: 'right', fontWeight: 540 }}>
                        ₹{item.revenue.toLocaleString('en-IN')}
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

export default SellerAnalyticsPage;
