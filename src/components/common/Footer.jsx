import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Send, Mail, MapPin } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const CATEGORY_LINKS = [
  { label: 'Handmade Candles', to: '/shop?category=Handmade%20Candles' },
  { label: 'Artisanal Jewellery', to: '/shop?category=Jewellery' },
  { label: 'Crochet & Knitting', to: '/shop?category=Crochet%20and%20Knitting' },
  { label: 'Pottery & Home Décor', to: '/shop?category=Home%20D%C3%A9cor' },
  { label: 'Paintings & Art', to: '/shop?category=Paintings%20and%20Art' },
  { label: 'Curated Gift Hampers', to: '/shop?category=Gift%20Hampers' }
];

const CARE_LINKS = [
  { label: 'About CraftNest', to: '/about' },
  { label: 'Become a Seller', to: '/become-seller' },
  { label: 'Shipping & Delivery Policy', to: '/shipping-policy' },
  { label: 'Returns & Cancellations', to: '/returns-policy' },
  { label: 'Privacy & Data Policy', to: '/privacy-policy' },
  { label: 'Contact Artisan Support', to: '/contact' }
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const { addToast } = useToast();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    if (!agreed) {
      addToast('Please consent to receiving CraftNest newsletter updates', 'error');
      return;
    }
    addToast('Welcome to CraftNest Stories! You have subscribed.', 'success');
    setEmail('');
    setAgreed(false);
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* Wordmark + promise, set generously like the top of an editorial page */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: 'var(--space-xxl)', maxWidth: 560 }}>
          <img src="/namebrand.png" alt="CraftNest" className="footer-namebrand" />
          <span className="t-display-lg" style={{ letterSpacing: '-0.02em' }}>
            CraftNest
          </span>
          <p className="t-body">
            CraftNest connects home-based creators and independent artisans with conscious
            shoppers looking for one-of-a-kind handmade treasures.
          </p>
          <a href="mailto:support@craftnest.in" className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: 'fit-content' }}>
            <Mail size={15} aria-hidden="true" /> support@craftnest.in
          </a>
          <span className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: 'fit-content' }}>
            <MapPin size={15} aria-hidden="true" /> Mumbai, Maharashtra, India
          </span>
        </div>

        {/* Dense link grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 'var(--space-xl)',
            paddingTop: 'var(--space-xl)',
            borderTop: '1px solid var(--color-hairline-soft)'
          }}
        >
          <nav aria-label="Categories">
            <div className="footer-head">Categories</div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {CATEGORY_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Customer care">
            <div className="footer-head">Customer Care</div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {CARE_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div>
            <div className="footer-head">CraftNest Stories</div>
            <p className="footer-link" style={{ padding: 0, paddingBottom: 12 }}>
              Receive stories from independent makers, secret artisan discounts, and new collection launches.
            </p>
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="nav-search"
                  placeholder="Your email address"
                  aria-label="Email address for newsletter"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn-icon btn-icon-primary"
                  aria-label="Subscribe to newsletter"
                  title="Subscribe"
                  style={{ position: 'absolute', right: 4, top: 3 }}
                >
                  <Send size={15} aria-hidden="true" />
                </button>
              </div>
              <label className="form-check" style={{ alignItems: 'flex-start' }}>
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>I agree to receive handmade inspiration and accept the privacy policy.</span>
              </label>
            </form>
          </div>
        </div>

        {/* Copyright bar */}
        <hr className="footer-rule" style={{ margin: 'var(--space-xl) 0 var(--space-lg) 0' }} />
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--space-sm)'
          }}
        >
          <span className="caption" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            © {new Date().getFullYear()} CraftNest · <Heart size={12} fill="currentColor" aria-hidden="true" /> Handmade with heart · All rights reserved
          </span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/privacy-policy" className="footer-link" style={{ display: 'inline' }}>Privacy</Link>
            <Link to="/returns-policy" className="footer-link" style={{ display: 'inline' }}>Terms</Link>
            <Link to="/shipping-policy" className="footer-link" style={{ display: 'inline' }}>Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
