import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, XCircle, Star, ArrowRight } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'badge badge-cream';
    case 'Confirmed':
    case 'Processing':
      return 'badge badge-mint';
    case 'Shipped':
      return 'badge badge-forest';
    case 'Delivered':
      return 'badge badge-success';
    case 'Cancelled':
      return 'badge badge-error';
    default:
      return 'badge badge-neutral';
  }
};

const BuyerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/orders/my');
      if (res.data.success && res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching buyer orders:', err);
      setError('Could not load your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be restored.')) {
      return;
    }
    try {
      setCancellingId(orderId);
      const res = await api.patch(`/orders/${orderId}/cancel`);
      if (res.data.success) {
        addToast('Order cancelled successfully', 'info');
        fetchOrders();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not cancel order';
      addToast(msg, 'error');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xxl)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="t-caption" style={{ marginBottom: 'var(--space-xs)' }}>
          My orders — {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </p>
        <h1 className="t-display-lg" style={{ marginBottom: 'var(--space-xs)' }}>
          Order history
        </h1>
        <p className="t-body-sm">
          Track the status of your handmade treasures from maker workshop to your doorstep
        </p>
      </div>

      {error ? (
        <div className="error-surface">
          <span className="t-body-sm" style={{ flex: 1 }}>
            {error}
          </span>
          <button type="button" onClick={fetchOrders} className="btn btn-secondary btn-sm">
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Package size={24} aria-hidden="true" />
          </div>
          <h3 className="t-headline">No orders placed yet</h3>
          <p className="t-body-sm">
            Explore handcrafted items from our community of artisans and place your first order.
          </p>
          <Link to="/shop" className="btn btn-primary">
            <span>Discover creations</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {orders.map((order) => {
            const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);
            const isCancelled = order.orderStatus === 'Cancelled';
            const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);
            const isCancelling = cancellingId === order._id;

            return (
              <div key={order._id} className="card" style={{ padding: 'var(--space-xl)' }}>
                {/* Card header: order meta + status + total */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 'var(--space-md)',
                    borderBottom: '1px solid var(--color-hairline-soft)',
                    paddingBottom: 'var(--space-md)',
                    marginBottom: 'var(--space-lg)'
                  }}
                >
                  <div>
                    <div className="t-caption" style={{ marginBottom: 'var(--space-xxs)' }}>
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="t-card-title">Order #{order.orderNumber}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <span className={getStatusBadgeClass(order.orderStatus)}>{order.orderStatus}</span>

                    <div style={{ textAlign: 'right' }}>
                      <div className="t-caption" style={{ marginBottom: 'var(--space-xxs)' }}>
                        Total amount
                      </div>
                      <div className="t-body-sm w540">₹{order.total.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>

                {/* Status progression stepper (hidden when cancelled) */}
                {!isCancelled && currentStepIndex >= 0 && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
                    {STATUS_STEPS.map((step, idx) => {
                      const isDone = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <React.Fragment key={step}>
                          {idx > 0 && (
                            <div
                              className={`step-line${isDone || isCurrent ? ' is-done' : ''}`}
                              style={{ marginTop: 'var(--space-sm)' }}
                            />
                          )}
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 'var(--space-xxs)',
                              minWidth: '64px'
                            }}
                          >
                            <div
                              className={`step-dot${isDone ? ' is-done' : isCurrent ? ' is-active' : ''}`}
                              style={{ fontSize: '12px', fontWeight: 700 }}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span className={`t-caption${isCurrent ? ' w540' : ''}`}>{step}</span>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}

                {/* Items list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="card-tile"
                      style={{
                        padding: 'var(--space-sm) var(--space-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-md)'
                      }}
                    >
                      <div className="img-frame" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                        <img
                          src={
                            item.imageSnapshot ||
                            'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={item.productNameSnapshot}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link to={`/product/${item.productId}`} className="t-body-sm w540" style={{ display: 'block' }}>
                          {item.productNameSnapshot}
                        </Link>
                        <span className="t-caption" style={{ display: 'block', marginTop: 'var(--space-xxs)' }}>
                          Qty {item.quantity} × ₹{item.unitPriceSnapshot.toLocaleString('en-IN')}
                        </span>
                        <span className="badge badge-cream" style={{ marginTop: 'var(--space-xxs)' }}>
                          {item.itemStatus}
                        </span>
                      </div>

                      {/* If order is Delivered, show review CTA */}
                      {order.orderStatus === 'Delivered' && (
                        <Link to={`/product/${item.productId}`} className="btn btn-secondary btn-sm">
                          <Star size={14} aria-hidden="true" />
                          <span>Review craft</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* Delivery info + cancellation footer */}
                <div
                  style={{
                    borderTop: '1px solid var(--color-hairline-soft)',
                    paddingTop: 'var(--space-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--space-md)'
                  }}
                >
                  <span className="t-body-sm">
                    Deliver to: <span className="w540">{order.shippingAddressSnapshot?.fullName}</span> •{' '}
                    {order.shippingAddressSnapshot?.street}, {order.shippingAddressSnapshot?.city},{' '}
                    {order.shippingAddressSnapshot?.postalCode}
                  </span>

                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={isCancelling}
                      className="btn btn-danger btn-sm"
                    >
                      {isCancelling ? (
                        <>
                          <div className="spinner-sm" />
                          <span>Cancelling…</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={15} aria-hidden="true" />
                          <span>Cancel order</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BuyerOrdersPage;
