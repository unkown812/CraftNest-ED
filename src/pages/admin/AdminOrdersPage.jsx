import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import api from '../../api/client';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/admin/orders', { params });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  const orderStatusBadge = (status) =>
    status === 'Delivered' ? 'badge-success' : status === 'Cancelled' ? 'badge-error' : 'badge-cream';

  return (
    <div className="page-stack" style={{ gap: 'var(--space-lg)' }}>
      {/* Page header + status filter */}
      <div className="toolbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xxs)' }}>
          <span className="t-caption">Admin console</span>
          <h1 className="t-headline" style={{ margin: 0 }}>
            Marketplace Orders Monitor
          </h1>
          <p className="t-body-sm w330" style={{ margin: 0 }}>
            Inspect all transactions, order statuses, and platform commission breakdown
          </p>
        </div>

        <div className="toolbar-spacer" />

        <div className="toolbar">
          <span className="badge badge-neutral">{orders.length} transactions</span>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="t-caption" htmlFor="order-status-filter">
              Status
            </label>
            <select
              id="order-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minHeight: '36px', padding: '6px 30px 6px 12px' }}
            >
              <option value="">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders ledger */}
      <div className="table-wrap">
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Date</th>
                <th>Buyer Name</th>
                <th>Gross Total</th>
                <th>Platform Cut</th>
                <th>Artisan Payout</th>
                <th>Payment</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord._id}>
                  <td className="t-body-sm w480">#{ord.orderNumber}</td>
                  <td className="t-body-sm w330">
                    {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="t-body-sm w480">
                    {ord.buyerId?.name || ord.shippingAddressSnapshot?.fullName || 'Customer'}
                  </td>
                  <td className="t-body-sm w540">₹{ord.total.toLocaleString('en-IN')}</td>
                  <td>
                    <span className="t-caption">
                      ₹{(ord.commissionAmount || Math.round(ord.subtotal * 0.1)).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td>
                    <span className="t-caption">
                      ₹{(ord.sellerEarnings || Math.round(ord.subtotal * 0.9)).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-neutral">
                      {ord.paymentMethod} ({ord.paymentStatus})
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${orderStatusBadge(ord.orderStatus)}`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div style={{ padding: '0 var(--space-lg) var(--space-xl)' }}>
            <div className="empty-state">
              <span className="empty-icon">
                <ShoppingBag size={22} aria-hidden="true" />
              </span>
              <h3 className="t-headline">No transactions found</h3>
              <p className="t-body-sm w330">
                Marketplace orders will appear here once customers complete checkouts.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
