import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Store, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');

      if (user.role === 'seller') {
        navigate('/seller/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Account Helpers for seamless testing
  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
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
        className="color-block block-lilac auth-side-block"
        aria-hidden="true"
        style={{
          width: '400px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-lg)'
        }}
      >
        <span className="t-eyebrow">Why CraftNest</span>
        <h2 className="t-display-lg">Craft, made slow.</h2>
        <p className="t-body">
          Every piece here is one of a kind — poured, crocheted, or thrown by hand in small artisan
          studios across India.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="sticky-note sticky-note--mint t-body-sm w540">1,200+ artisan studios</div>
          <div className="sticky-note sticky-note--pink t-body-sm w540">Pan-India delivery</div>
          <div className="sticky-note t-body-sm w540">Secure UPI checkout</div>
        </div>
      </div>

      {/* Sign-in card — centered on white canvas */}
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: 'var(--space-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <p className="t-caption" style={{ marginBottom: 'var(--space-xs)' }}>
            CraftNest · Artisan Marketplace
          </p>
          <h1 className="t-display-lg" style={{ marginBottom: 'var(--space-xs)' }}>
            Welcome back
          </h1>
          <p className="t-body-sm">Sign in to your CraftNest handmade account</p>
        </div>

        {/* Demo Account Pills for Testing */}
        <div className="card-tile" style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
          <p className="t-caption" style={{ marginBottom: 'var(--space-sm)' }}>
            Demo accounts
          </p>
          <div className="btn-row">
           

            <button
              type="button"
              onClick={() => fillDemo('admin@craftnest.in', 'Admin@123')}
              className="btn btn-secondary btn-sm"
            >
              <ShieldCheck size={14} aria-hidden="true" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="name@example.com"
                style={{ paddingLeft: '42px' }}
                required
              />
              <Mail
                size={16}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-ink)'
                }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                style={{ paddingLeft: '42px' }}
                required
              />
              <Lock
                size={16}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-ink)'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: 'var(--space-md)' }}
          >
            {isSubmitting ? (
              <>
                <div className="spinner-sm" />
                <span>Signing in…</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </button>

          <div style={{ textAlign: 'center' }} className="t-body-sm">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="w540"
              style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
