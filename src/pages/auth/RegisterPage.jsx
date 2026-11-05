import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Store, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      addToast('Please enter your name, email, and password', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (role === 'seller' && !shopName.trim()) {
      addToast('Please provide a name for your artisan shop', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        phone: phone.trim()
      };

      if (role === 'seller') {
        payload.shopName = shopName.trim();
        payload.shopDescription = shopDescription.trim();
      }

      const user = await register(payload);
      addToast(`Welcome to CraftNest, ${user.name}!`, 'success');

      if (role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-xxl)',
        padding: 'var(--space-xl) var(--container-gutter)'
      }}
    >
      {/* Desktop-only decorative panel — the single color block of the viewport */}
      <style>{`@media (max-width: 1100px) { .auth-side-block { display: none !important; } }`}</style>
      <div
        className="color-block block-cream auth-side-block"
        aria-hidden="true"
        style={{
          width: '400px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-lg)'
        }}
      >
        <span className="t-eyebrow">Join the makers</span>
        <h2 className="t-display-lg">Sell what you make.</h2>
        <p className="t-body">
          Open a studio page in minutes, keep direct payouts, and ship your work to conscious buyers
          pan-India.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="sticky-note t-body-sm w540">Zero listing fees to start</div>
          <div className="sticky-note sticky-note--lilac t-body-sm w540">Artisan-direct payouts</div>
          <div className="sticky-note sticky-note--mint t-body-sm w540">Eco-friendly packaging</div>
        </div>
      </div>

      {/* Register card — centered on white canvas */}
      <div className="card" style={{ width: '100%', maxWidth: '520px', padding: 'var(--space-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          
          <h1 className="t-display-lg" style={{ marginBottom: 'var(--space-xs)' }}>
            Join CraftNest
          </h1>
          <p className="t-body-sm">
            Connect with independent artisans and conscious buyers across India
          </p>
        </div>

        {/* Role selection — pill toggle, selected = black surface */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-xs)',
            marginBottom: 'var(--space-lg)'
          }}
        >
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className="btn"
            style={
              role === 'buyer'
                ? {
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                    borderColor: 'var(--color-primary)'
                  }
                : {
                    backgroundColor: 'var(--color-canvas)',
                    color: 'var(--color-ink)',
                    borderColor: 'var(--color-hairline)'
                  }
            }
          >
            <User size={16} aria-hidden="true" />
            <span>I want to shop</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('seller')}
            className="btn"
            style={
              role === 'seller'
                ? {
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                    borderColor: 'var(--color-primary)'
                  }
                : {
                    backgroundColor: 'var(--color-canvas)',
                    color: 'var(--color-ink)',
                    borderColor: 'var(--color-hairline)'
                  }
            }
          >
            <Store size={16} aria-hidden="true" />
            <span>I make / sell</span>
          </button>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">
              Full Name *
            </label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="e.g. Priya Sundaram"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              Email Address *
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">
              Password * (min 6 characters)
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
            <label className="form-label" htmlFor="register-phone">
              Mobile Number
            </label>
            <input
              id="register-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
              placeholder="+91…"
            />
          </div>

          {/* Seller Specific Fields */}
          {role === 'seller' && (
            <div className="card-tile" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
              <div className="t-body-sm w540" style={{ marginBottom: 'var(--space-md)' }}>
                Artisan shop details
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-shop-name">
                  Shop / Studio Name *
                </label>
                <input
                  id="register-shop-name"
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Aarohi Botanicals & Candles"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="register-shop-desc">
                  Short Craft Story
                </label>
                <textarea
                  id="register-shop-desc"
                  rows={2}
                  value={shopDescription}
                  onChange={(e) => setShopDescription(e.target.value)}
                  className="form-textarea"
                  placeholder="What makes your handmade creations special?"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 'var(--space-xs)', marginBottom: 'var(--space-md)' }}
          >
            {isSubmitting ? (
              <>
                <div className="spinner-sm" />
                <span>Creating account…</span>
              </>
            ) : (
              <>
                <span>Complete registration</span>
                <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </button>

          <div style={{ textAlign: 'center' }} className="t-body-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="w540"
              style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
