import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ArrowLeft, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Shared dashboard shell for Seller Studio & Admin Console.
 * White canvas chrome; mono captions; the active item uses the primary
 * (black) surface — "selected = primary", same pattern as pricing tabs.
 */
const DashboardLayout = ({
  menuItems,
  sidebarKicker,
  sidebarTitle,
  headerTitle,
  headerAction = null,
  accentBadge = null
}) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-canvas)' }}>
      {/* Sidebar — white canvas, hairline edge, black selected pill */}
      <aside
        className={`dash-sidebar${sidebarOpen ? ' is-open' : ''}`}
        style={{
          width: '264px',
          backgroundColor: 'var(--color-canvas)',
          borderRight: '1px solid var(--color-hairline)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 1000,
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Brand */}
        <div style={{ padding: '20px 20px', borderBottom: '1px solid var(--color-hairline-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" aria-label="CraftNest home">
            <span className="wordmark" style={{ fontSize: 19 }}>
              <span className="wordmark-hat" style={{ width: 28, height: 28 }} aria-hidden="true">
                <Heart size={13} fill="currentColor" />
              </span>
              CraftNest
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="btn-icon btn-icon-ghost dash-sidebar-close"
            aria-label="Close menu"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Context block */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-hairline-soft)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="t-caption" style={{ letterSpacing: 0.6 }}>{sidebarKicker}</span>
          <span style={{ fontSize: 16, fontWeight: 540, color: 'var(--color-ink)', wordBreak: 'break-word' }}>{sidebarTitle}</span>
          <span className="badge badge-cream" style={{ alignSelf: 'flex-start' }}>{accentBadge}</span>
        </div>

        {/* Nav */}
        <nav
          aria-label={`${sidebarKicker} navigation`}
          style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}
          onClick={() => setSidebarOpen(false)}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={isActive ? 'badge-selected' : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: 15,
                  fontWeight: isActive ? 540 : 330,
                  backgroundColor: isActive ? 'var(--color-surface-soft)' : 'transparent',
                  color: 'var(--color-ink)',
                  transition: 'background-color var(--transition-fast), color var(--transition-fast)'
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--color-surface-soft)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Icon size={17} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--color-hairline-soft)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link
            to="/shop"
            className="btn btn-ghost"
            style={{ justifyContent: 'flex-start', fontSize: 14, padding: '8px 12px', minHeight: 40 }}
          >
            <ArrowLeft size={15} aria-hidden="true" />
            <span>Marketplace Storefront</span>
          </Link>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="btn btn-ghost"
            style={{ justifyContent: 'flex-start', fontSize: 14, padding: '8px 12px', minHeight: 40, color: 'var(--color-error)' }}
          >
            <LogOut size={15} aria-hidden="true" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div style={{ flex: 1, marginLeft: '264px', display: 'flex', flexDirection: 'column', minWidth: 0 }} className="dash-main-wrapper">
        {/* Top bar */}
        <header
          style={{
            minHeight: '64px',
            backgroundColor: 'var(--color-canvas)',
            borderBottom: '1px solid var(--color-hairline)',
            padding: '12px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            position: 'sticky',
            top: 0,
            zIndex: 900
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn-icon btn-icon-ghost dash-mobile-toggle"
              aria-label="Open navigation menu"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            <h2 style={{ fontSize: 20, fontWeight: 540, letterSpacing: '-0.2px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {headerTitle}
            </h2>
          </div>
          {headerAction}
        </header>

        {/* Page outlet */}
        <main style={{ padding: '32px', flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .dash-sidebar { transform: translateX(-100%); box-shadow: none; }
          .dash-sidebar.is-open { transform: translateX(0) !important; box-shadow: 0 0 60px rgba(0,0,0,0.25); }
          .dash-main-wrapper { margin-left: 0 !important; }
          .dash-mobile-toggle { display: inline-flex !important; }
          .dash-sidebar-close { display: inline-flex !important; }
          main { padding: 20px !important; }
          header { padding: 12px 20px !important; }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
