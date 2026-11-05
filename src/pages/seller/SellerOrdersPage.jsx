import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_BADGES = {
  Pending: 'badge-neutral',
  Confirmed: 'badge-cream',
  Processing: 'badge-terracotta',
  Shipped: 'badge-cream',
  Delivered: 'badge-success',
  Cancelled: 'badge-error'
};

const statusBadge = (status) => STATUS_BADGES[status] || 'badge-neutral';

const paymentBadge = (paymentStatus) =>
  String(paymentStatus || '').toLowerCase() === 'paid' ? 'badge-success' : 'badge-warning';

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/seller/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching seller orders:', err);
      setError(err.response?.data?.message || 'Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, itemId, newStatus) => {
    try {
      setUpdatingId(itemId);
      const res = await api.patch(`/seller/orders/${orderId}/items/${itemId}/status`, {
        status: newStatus
      });

      if (res.data.success) {
        addToast(`Item status updated to ${newStatus}`, 'success');
        fetchOrders();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update item status';
      addToast(msg, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="page-loading" style={{ flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <div className="spinner" />
        <p className="t-caption">Loading order fulfillments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-surface" style={{ marginTop: 'var(--space-lg)' }}>
        <span>{error}</span>
        <button onClick={fetchOrders} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="page-stack">
      {/* Page header */}
      <div className="toolbar">
        <div>
          <p className="t-caption" style={{ marginBottom: 'var(--space-xs)' }}>Fulfillment</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            <h1 className="t-headline" style={{ margin: 0 }}>Order Fulfillment</h1>
            <span className="badge badge-outline">{orders.length} Orders</span>
          </div>
          <p className="t-body-sm" style={{ margin: 'var(--space-xxs) 0 0 0' }}>
            Manage packing, courier dispatch, and delivery updates for your creations
          </p>
        </div>
        <div className="toolbar-spacer" />
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <ShoppingBag size={24} aria-hidden="true" />
          </div>
          <h3>No orders to fulfill yet</h3>
          <p>When customers purchase your handcrafted items, orders will appear here.</p>
          <button onClick={fetchOrders} className="btn btn-secondary">
            Check Again
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Destination</th>
                  <th>Buyer</th>
                  <th>Items</th>
                  <th>Payment</th>
                  <th>Item Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) =>
                  order.items.map((item, itemIdx) => (
                    <tr key={item._id}>
                      {itemIdx === 0 && (
                        <>
                          <td rowSpan={order.items.length} style={{ verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 540 }}>#{order.orderNumber}</div>
                            <div className="t-caption" style={{ marginTop: 'var(--space-xxs)' }}>
                              Ordered on{' '}
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div style={{ fontWeight: 540, marginTop: 'var(--space-sm)' }}>
                              ₹{order.sellerSubtotal?.toLocaleString('en-IN')}
                            </div>
                            <div className="t-caption" style={{ marginTop: 'var(--space-xxs)' }}>
                              Your Item Subtotal
                            </div>
                          </td>
                          <td rowSpan={order.items.length} style={{ verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 540 }}>
                              {order.shippingAddress?.fullName} ({order.shippingAddress?.phone})
                            </div>
                            <div style={{ marginTop: 'var(--space-xxs)' }}>
                              {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} -{' '}
                              {order.shippingAddress?.postalCode}
                            </div>
                          </td>
                          <td rowSpan={order.items.length} style={{ verticalAlign: 'top' }}>
                            {order.buyer ? (
                              <>
                                <div style={{ fontWeight: 540 }}>{order.buyer.name}</div>
                                <div className="t-caption" style={{ marginTop: 'var(--space-xxs)' }}>
                                  {order.buyer.email}
                                </div>
                              </>
                            ) : (
                              '—'
                            )}
                          </td>
                        </>
                      )}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                          <div className="img-frame" style={{ width: '44px', height: '44px', flexShrink: 0 }}>
                            <img
                              src={item.imageSnapshot || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'}
                              alt={item.productNameSnapshot}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div>
                            <div style={{ fontWeight: 540 }}>{item.productNameSnapshot}</div>
                            <div className="t-caption" style={{ marginTop: 'var(--space-xxs)' }}>
                              Qty: {item.quantity} × ₹{item.unitPriceSnapshot.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${paymentBadge(order.paymentStatus)}`}>
                          Payment: {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                          <span className={`badge ${statusBadge(item.itemStatus)}`}>{item.itemStatus}</span>
                          <select
                            value={item.itemStatus}
                            onChange={(e) => handleStatusChange(order._id, item._id, e.target.value)}
                            disabled={updatingId === item._id || item.itemStatus === 'Cancelled'}
                            className="form-select"
                            aria-label={`Fulfillment status for ${item.productNameSnapshot}`}
                            style={{ width: 'auto', minHeight: '36px', padding: '4px 10px', fontSize: '14px' }}
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                          {updatingId === item._id && <div className="spinner spinner-sm" aria-hidden="true" />}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrdersPage;
