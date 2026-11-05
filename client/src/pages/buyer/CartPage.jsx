import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const isCartEmpty = !cart.items || cart.items.length === 0;
  const freeShippingThreshold = cart.freeShippingThreshold || 999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const freeShippingProgress = Math.min(100, Math.round((cart.subtotal / freeShippingThreshold) * 100));

  if (isCartEmpty) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xxl)' }}>
        <div className="empty-state">
          <div className="empty-icon">
            <ShoppingBag size={24} aria-hidden="true" />
          </div>
          <h3 className="t-headline">Your Basket is Empty</h3>
          <p className="t-body-sm">
            You haven't added any artisanal creations yet. Browse our handmade candle, crochet, and pottery collections!
          </p>
          <Link to="/shop" className="btn btn-primary">
            <span>Explore crafts</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xxl)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="t-caption" style={{ marginBottom: 'var(--space-xs)' }}>
          Basket — {cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'}
        </p>
        <h1 className="t-display-lg">Your basket</h1>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xxs)', marginBottom: 'var(--space-xs)' }}>
          <Truck size={16} aria-hidden="true" />
          {amountNeededForFreeShipping > 0 ? (
            <span className="t-caption">
              ₹{amountNeededForFreeShipping.toLocaleString('en-IN')} away from free shipping
            </span>
          ) : (
            <span className="t-caption">Free pan-India delivery unlocked</span>
          )}
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${freeShippingProgress}%` }} />
        </div>
      </div>

      {/* Cart Layout: Items List + Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: 'var(--space-xl)',
          alignItems: 'start'
        }}
      >
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="t-headline">Basket items ({cart.items.length})</h2>
            <button type="button" onClick={clearCart} className="btn btn-danger btn-sm">
              Clear all
            </button>
          </div>

          {cart.items.map((item) => (
            <div
              key={item._id || item.productId}
              className="card"
              style={{
                padding: 'var(--space-md)',
                display: 'flex',
                gap: 'var(--space-md)',
                alignItems: 'center'
              }}
            >
              {/* Thumbnail */}
              <Link
                to={`/product/${item.slug || item.productId}`}
                className="img-frame"
                style={{ width: '96px', height: '96px', flexShrink: 0 }}
              >
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Link>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-xxs)' }}>
                  {item.category}
                </span>
                <Link
                  to={`/product/${item.slug || item.productId}`}
                  className="t-body-sm w540"
                  style={{ display: 'block' }}
                >
                  {item.name}
                </Link>
                <span className="t-caption" style={{ display: 'block', marginTop: 'var(--space-xxs)' }}>
                  ₹{item.price.toLocaleString('en-IN')} each
                </span>
              </div>

              {/* Quantity + removal */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xxs)' }}>
                  <button
                    type="button"
                    className="btn-icon btn-sm"
                    onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} aria-hidden="true" />
                  </button>
                  <span className="t-caption" style={{ minWidth: '24px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="btn-icon btn-sm"
                    onClick={() => updateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))}
                    disabled={item.quantity >= item.stock}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} aria-hidden="true" />
                  </button>
                </div>

                <span className="t-body-sm w540">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.productId)}
                  className="btn-icon btn-icon-ghost"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}

          <div>
            <Link to="/shop" className="btn btn-ghost btn-sm">
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Continue shopping for crafts</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Box */}
        <aside className="card" style={{ padding: 'var(--space-lg)', position: 'sticky', top: '96px' }}>
          <h2 className="t-headline" style={{ marginBottom: 'var(--space-md)' }}>
            Order summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="t-body-sm">Crafts subtotal</span>
              <span className="t-body-sm w540">₹{cart.subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="t-body-sm">Artisan shipping</span>
              <span className="t-body-sm w540">
                {cart.shippingFee === 0 ? 'Free' : `₹${cart.shippingFee.toLocaleString('en-IN')}`}
              </span>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--color-hairline)',
              paddingTop: 'var(--space-md)',
              marginBottom: 'var(--space-lg)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline'
            }}
          >
            <span className="t-body w540">Total</span>
            <span className="t-card-title">₹{cart.total.toLocaleString('en-IN')}</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: 'var(--space-md)' }}
          >
            <span>Proceed to checkout</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>

          <div
            className="card-tile"
            style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xxs)' }}>
              <ShieldCheck size={16} aria-hidden="true" />
              <span className="t-caption">Price &amp; stock verified on server</span>
            </div>
            <span className="t-caption">Secure checkout · Artisan direct payouts</span>
            <span className="t-caption">Safe eco-friendly packaging included</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
