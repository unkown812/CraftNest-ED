import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck } from 'lucide-react';
import api from '../../api/client';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${id}`);
          if (res.data.success && res.data.order) {
            setOrder(res.data.order);
          }
        } catch (err) {
          console.error('Error fetching order:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '680px', paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xxl)' }}>
      {/* Hero — white canvas, celebratory but flat */}
      <div style={{ textAlign: 'center' }}>
        {/* Single mint band behind the check glyph — one color block per viewport */}
        <div
          className="color-block block-mint"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'fit-content',
            padding: 'var(--space-lg)',
            borderRadius: 'var(--radius-lg)',
            margin: '0 auto var(--space-lg) auto'
          }}
        >
          <CheckCircle2 size={40} color="var(--color-semantic-success)" aria-hidden="true" />
        </div>

        <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
          Order confirmed
        </span>

        <h1 className="t-display-lg" style={{ marginBottom: 'var(--space-sm)' }}>
          Thank you for supporting artisans!
        </h1>

        {order && (
          <p className="t-caption" style={{ marginBottom: 'var(--space-lg)' }}>
            Order {order.orderNumber}
          </p>
        )}

        <p className="t-body" style={{ maxWidth: '460px', margin: '0 auto var(--space-lg) auto' }}>
          Your order has been received and confirmed. Independent makers have been notified and will begin preparing
          your handcrafted items with mindful care.
        </p>

        {/* Actions */}
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link to="/buyer/orders" className="btn btn-primary btn-lg">
            <Package size={18} aria-hidden="true" />
            <span>Track my order</span>
          </Link>

          <Link to="/shop" className="btn btn-ghost btn-lg">
            <span>Keep shopping</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Order Details Card */}
      {order && (
        <section className="card" style={{ padding: 'var(--space-lg)', textAlign: 'left', marginTop: 'var(--space-xl)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              borderBottom: '1px solid var(--color-hairline-soft)',
              paddingBottom: 'var(--space-md)',
              marginBottom: 'var(--space-md)'
            }}
          >
            <div>
              <div className="t-caption" style={{ marginBottom: 'var(--space-xxs)' }}>Order reference</div>
              <div className="t-body-sm w540">{order.orderNumber}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="t-caption" style={{ marginBottom: 'var(--space-xxs)' }}>Total amount</div>
              <div className="t-card-title">₹{order.total?.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)' }}>
              <span className="t-body-sm">Deliver to</span>
              <span className="t-body-sm" style={{ textAlign: 'right', maxWidth: '70%' }}>
                {order.shippingAddressSnapshot?.fullName} • {order.shippingAddressSnapshot?.street},{' '}
                {order.shippingAddressSnapshot?.city}, {order.shippingAddressSnapshot?.state} -{' '}
                {order.shippingAddressSnapshot?.postalCode}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="t-body-sm">Payment method</span>
              <span className="t-body-sm w540">
                {order.paymentMethod} ({order.paymentStatus})
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)' }}>
              <span className="t-body-sm">Estimated delivery</span>
              <span className="t-body-sm w540" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xxs)' }}>
                <Truck size={16} aria-hidden="true" />
                Within 4–7 business days across India
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default OrderSuccessPage;
