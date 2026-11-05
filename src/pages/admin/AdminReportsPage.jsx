import React, { useState, useEffect } from 'react';
import api from '../../api/client';

const AdminReportsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/reports');
        if (res.data.success) {
          setReport(res.data);
        }
      } catch (err) {
        console.error('Error fetching admin reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  const summary = report?.summary || {};
  const monthly = report?.monthlyTrends || [];

  const gross = summary.grandGrossTotal || 0;
  const platformPct = gross > 0 ? Math.round(((summary.grandCommission || 0) / gross) * 100) : 10;
  const artisanPct = gross > 0 ? 100 - platformPct : 90;

  return (
    <div className="page-stack" style={{ gap: 'var(--space-xl)' }}>
      {/* Page header */}
      <div className="toolbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xxs)' }}>
          <span className="t-caption">Admin console</span>
          <h1 className="t-headline" style={{ margin: 0 }}>
            Platform Revenue &amp; Financial Reports
          </h1>
          <p className="t-body-sm w330" style={{ margin: 0 }}>
            Historical marketplace gross merchandise value, artisan payouts, and retained commission
          </p>
        </div>
      </div>

      {/* Summary KPI cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: 'var(--space-md)'
        }}
      >
        <div className="stat-card">
          <span className="stat-label">Total Marketplace GMV</span>
          <div className="stat-value w540">
            ₹{summary.grandGrossTotal?.toLocaleString('en-IN') || 0}
          </div>
          <span className="stat-sub">From {summary.totalEligibleOrders || 0} customer orders</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Platform Commission Earned</span>
          <div className="stat-value w540">
            ₹{summary.grandCommission?.toLocaleString('en-IN') || 0}
          </div>
          <span className="stat-sub">Retained CraftNest operating revenue</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Artisan Payouts Released</span>
          <div className="stat-value w540">
            ₹{summary.grandSellerPayouts?.toLocaleString('en-IN') || 0}
          </div>
          <span className="stat-sub">Net earnings delivered to craft makers</span>
        </div>
      </div>

      {/* The single informational color block — how each order is split */}
      <div
        className="color-block block-cream"
        style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}
      >
        <span className="t-caption">How each order is split</span>
        <p className="t-body" style={{ margin: 0 }}>
          Every platform order splits automatically: CraftNest retains the platform commission while
          artisans receive the remainder as their net payout. The figures below are derived from
          recorded order history.
        </p>
        <div className="toolbar">
          <span className="badge badge-outline">Platform share — {platformPct}%</span>
          <span className="badge badge-outline">Artisan share — {artisanPct}%</span>
        </div>
      </div>

      {/* Monthly financial breakdown */}
      <div className="table-wrap">
        <div
          style={{
            padding: 'var(--space-md) var(--space-lg)',
            borderBottom: '1px solid var(--color-hairline)'
          }}
        >
          <h3 className="t-card-title">Monthly Financial Performance</h3>
        </div>

        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Orders Processed</th>
                <th>Gross Revenue</th>
                <th>CraftNest Commission</th>
                <th>Artisan Share (Net)</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((row, idx) => (
                <tr key={idx}>
                  <td className="t-body-sm w480">{row.month}</td>
                  <td className="t-body-sm">{row.ordersCount} orders</td>
                  <td className="t-body-sm w540">₹{row.revenue.toLocaleString('en-IN')}</td>
                  <td>
                    <span className="t-caption">₹{row.commission.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="t-body-sm w540">
                    ₹{(row.revenue - row.commission).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {monthly.length === 0 && (
          <div style={{ padding: '0 var(--space-lg) var(--space-xl)' }}>
            <div className="empty-state">
              <h3 className="t-headline">No recorded monthly batches yet</h3>
              <p className="t-body-sm w330">
                Monthly financial summaries appear here after the first settlement batch is recorded.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;
