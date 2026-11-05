import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  Smartphone,
  ShoppingBag
} from 'lucide-react';
import api from '../../api/client';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const CheckoutPage = () => {
  const { cart, fetchCart, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Address form fields
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('TestCard');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill default user address if available
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setAddress({
        fullName: defaultAddr.fullName || user.name || '',
        phone: defaultAddr.phone || user.phone || '',
        street: defaultAddr.street || '',
        city: defaultAddr.city || '',
        state: defaultAddr.state || '',
        postalCode: defaultAddr.postalCode || '',
        country: defaultAddr.country || 'India'
      });
    }
  }, [user]);

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xxl)' }}>
        <div className="empty-state">
          <div className="empty-icon">
            <ShoppingBag size={24} aria-hidden="true" />
          </div>
          <h3 className="t-headline">Your basket is empty</h3>
          <p className="t-body-sm">Please add items to your basket before checking out.</p>
          <Link to="/shop" className="btn btn-primary">
            Explore crafts
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validations
    if (!address.fullName.trim() || !address.phone.trim() || !address.street.trim() || !address.city.trim() || !address.postalCode.trim()) {
      setErrorMessage('Please fill in all mandatory delivery address fields.');
      addToast('Incomplete delivery address', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          name: item.name
        })),
        shippingAddress: address,
        paymentMethod,
        notes: notes.trim()
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success && res.data.order) {
        addToast('Order confirmed! CraftNest makers are notified.', 'success');
        await clearCart();
        navigate(`/order-success/${res.data.order._id}`, { state: { order: res.data.order } });
      }
    } catch (err) {
      console.error('Order creation error:', err);
      const msg = err.response?.data?.message || 'Failed to place order. Please check item availability.';
      setErrorMessage(msg);
      addToast(msg, 'error');
      // Re-fetch cart in case of stock race condition
      fetchCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentOptions = [
    {
      value: 'TestCard',
      icon: <CreditCard size={18} aria-hidden="true" />,
      title: 'Instant Card Payment (Safe Sandbox Test Mode)',
      hint: 'Simulates verified payment gateway without real charges.',
      badge: 'Instant'
    },
    {
      value: 'UPI',
      icon: <Smartphone size={18} aria-hidden="true" />,
      title: 'UPI Simulation (Google Pay / PhonePe / Paytm / BHIM)',
      hint: 'Instant QR / VPA sandbox simulation.'
    },
    {
      value: 'COD',
      icon: <Truck size={18} aria-hidden="true" />,
      title: 'Cash on Delivery (COD)',
      hint: 'Pay cash upon arrival of your handmade parcel.'
    }
  ];

  return (
    <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xxl)' }}>
      {/* Breadcrumb + Title */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <p className="t-caption" style={{ marginBottom: 'var(--space-xs)' }}>
          <Link to="/cart">Basket</Link> / Safe checkout
        </p>
        <h1 className="t-display-lg">Checkout &amp; delivery</h1>
      </div>

      {/* Step indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          maxWidth: '520px',
          marginBottom: 'var(--space-xl)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xxs)' }}>
          <span className="step-dot is-done" aria-hidden="true">
            <CheckCircle2 size={13} />
          </span>
          <span className="t-caption">Basket</span>
        </div>
        <span className="step-line is-done" aria-hidden="true" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xxs)' }}>
          <span className="step-dot is-active" aria-hidden="true">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>2</span>
          </span>
          <span className="t-caption">Checkout</span>
        </div>
        <span className="step-line" aria-hidden="true" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xxs)' }}>
          <span className="step-dot" aria-hidden="true">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>3</span>
          </span>
          <span className="t-caption">Confirmation</span>
        </div>
      </div>

      {errorMessage && (
        <div className="error-surface" role="alert" style={{ marginBottom: 'var(--space-lg)' }}>
          <AlertCircle size={18} aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: 'var(--space-xl)',
            alignItems: 'start'
          }}
        >
          {/* Left: Shipping Address + Payment Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {/* Shipping Address */}
            <section className="card" style={{ padding: 'var(--space-lg)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  marginBottom: 'var(--space-lg)',
                  borderBottom: '1px solid var(--color-hairline-soft)',
                  paddingBottom: 'var(--space-md)'
                }}
              >
                <Truck size={18} aria-hidden="true" />
                <h2 className="t-headline">Delivery address (India)</h2>
              </div>

              <div className="grid-2">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" htmlFor="co-fullname">Full name *</label>
                  <input
                    id="co-fullname"
                    type="text"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Receiver's full name"
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" htmlFor="co-phone">Phone number *</label>
                  <input
                    id="co-phone"
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Mobile number for courier tracking"
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" htmlFor="co-street">Street address &amp; flat / house no. *</label>
                  <input
                    id="co-street"
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Building, street name, locality"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="co-city">City *</label>
                  <input
                    id="co-city"
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="City / town"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="co-state">State *</label>
                  <input
                    id="co-state"
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="State"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="co-postal">PIN / postal code *</label>
                  <input
                    id="co-postal"
                    type="text"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="6-digit PIN code"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="co-country">Country</label>
                  <input
                    id="co-country"
                    type="text"
                    name="country"
                    value={address.country}
                    readOnly
                    className="form-input"
                    style={{ backgroundColor: 'var(--color-surface-soft)' }}
                  />
                </div>
              </div>

              {/* Customization notes */}
              <div className="form-group" style={{ marginTop: 'var(--space-xs)' }}>
                <label className="form-label" htmlFor="co-notes">Artisan customization note / gift message (optional)</label>
                <textarea
                  id="co-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-textarea"
                  placeholder="e.g. Please inscribe 'Ananya & Kabir 2026' or attach a birthday gift note."
                />
              </div>
            </section>

            {/* Payment Method Selector */}
            <section className="card" style={{ padding: 'var(--space-lg)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  marginBottom: 'var(--space-md)',
                  borderBottom: '1px solid var(--color-hairline-soft)',
                  paddingBottom: 'var(--space-md)'
                }}
              >
                <Lock size={18} aria-hidden="true" />
                <h2 className="t-headline">Payment method</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {paymentOptions.map((option) => {
                  const isSelected = paymentMethod === option.value;
                  return (
                    <label
                      key={option.value}
                      className="card"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        padding: 'var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-hairline)',
                        cursor: 'pointer',
                        transition: 'border-color var(--transition-fast)'
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.value}
                        checked={isSelected}
                        onChange={() => setPaymentMethod(option.value)}
                      />
                      {option.icon}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="t-body-sm w540">{option.title}</div>
                        <div className="form-hint">{option.hint}</div>
                      </div>
                      {isSelected ? (
                        <span className="badge badge-selected">Selected</span>
                      ) : (
                        option.badge && <span className="badge badge-neutral">{option.badge}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right: Order Summary Preview & Button */}
          <aside className="card" style={{ padding: 'var(--space-lg)', position: 'sticky', top: '96px' }}>
            <h2 className="t-headline" style={{ marginBottom: 'var(--space-md)' }}>
              Items in order ({cart.items.length})
            </h2>

            {/* Items Mini List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-sm)',
                maxHeight: '240px',
                overflowY: 'auto',
                marginBottom: 'var(--space-md)'
              }}
            >
              {cart.items.map((it) => (
                <div key={it._id || it.productId} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                  <span className="img-frame" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                    <img
                      src={it.images?.[0] || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'}
                      alt={it.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="t-body-sm w540">{it.name}</div>
                    <div className="t-caption">Qty {it.quantity}</div>
                  </div>
                  <span className="t-body-sm w540">₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div
              style={{
                borderTop: '1px solid var(--color-hairline-soft)',
                paddingTop: 'var(--space-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-lg)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="t-body-sm">Subtotal</span>
                <span className="t-body-sm w540">₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="t-body-sm">Shipping</span>
                <span className="t-body-sm w540">
                  {cart.shippingFee === 0 ? 'Free' : `₹${cart.shippingFee.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div
                style={{
                  borderTop: '1px solid var(--color-hairline)',
                  paddingTop: 'var(--space-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}
              >
                <span className="t-body w540">Total to pay</span>
                <span className="t-card-title">₹{cart.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xxs)',
                marginBottom: 'var(--space-md)'
              }}
            >
              <ShieldCheck size={16} aria-hidden="true" />
              <span className="t-caption">Secure server-backed checkout</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: 'var(--space-sm)' }}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner spinner-sm" aria-hidden="true" />
                  <span>Placing order…</span>
                </>
              ) : (
                <>
                  <span>Confirm &amp; place order</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </>
              )}
            </button>

            <p style={{ fontSize: '13px', fontWeight: 330, textAlign: 'center' }}>
              By placing this order, you support independent Indian craft makers directly.
            </p>
          </aside>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
