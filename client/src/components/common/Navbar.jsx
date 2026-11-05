import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Store,
  ShieldCheck,
  Package,
  LogOut,
  ChevronDown,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, isSeller, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* {components.top-nav} — sticky white bar, 64px chrome */}
      <header className="top-nav">
        <div className="container top-nav-inner">
          {/* Wordmark */}
          <Link to="/" aria-label="CraftNest home" style={{ flexShrink: 0 }}>
            <span className="wordmark">
              <img src="/favicon.png" alt="" className="wordmark-hat-img" aria-hidden="true" />
              CraftNest
            </span>
          </Link>

          {/* Desktop search */}
          <form
            onSubmit={handleSearchSubmit}
            className="nav-desktop-search"
            style={{ position: 'relative', maxWidth: '400px', width: '100%' }}
          >
            <input
              type="text"
              className="nav-search"
              placeholder="Search candles, pottery, crochet…"
              aria-label="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={16}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-ink)',
                pointerEvents: 'none'
              }}
            />
          </form>

          {/* Desktop links */}
          <nav className="nav-desktop-links" aria-label="Primary">
            <div className="nav-links">
              <Link
                to="/shop"
                className={`nav-link${location.pathname === '/shop' ? ' is-active' : ''}`}
              >
                Shop All
              </Link>
              <Link to="/shop?category=Handmade%20Candles" className="nav-link">
                Candles
              </Link>
              <Link to="/shop?category=Crochet%20and%20Knitting" className="nav-link">
                Crochet
              </Link>
              {!isSeller && !isAdmin && (
                <Link to="/become-seller" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Store size={15} aria-hidden="true" />
                  <span>Sell on CraftNest</span>
                </Link>
              )}
            </div>
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <Link
              to="/buyer/wishlist"
              className="btn-icon"
              aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ''}`}
            >
              <Heart size={18} aria-hidden="true" />
              {wishlistCount > 0 && <span className="nav-count-badge">{wishlistCount}</span>}
            </Link>

            <Link
              to="/cart"
              className="btn-icon btn-icon-ghost"
              aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ''}`}
            >
              <ShoppingBag size={18} aria-hidden="true" />
              {cartCount > 0 && <span className="nav-count-badge">{cartCount}</span>}
            </Link>

            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="menu"
                  className="btn btn-ghost"
                  style={{ padding: '4px 10px 4px 4px', minHeight: 40 }}
                >
                  <span className="avatar" style={{ width: 30, height: 30, fontSize: 13 }}>
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 480,
                      maxWidth: 90,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} aria-hidden="true" />
                </button>

                {userDropdownOpen && (
                  <div className="menu-popover" role="menu">
                    <div className="menu-popover-head">
                      <span style={{ fontSize: 15, fontWeight: 540 }}>{user.name}</span>
                      <span className="caption" style={{ wordBreak: 'break-all' }}>{user.email}</span>
                      <span className={`badge ${
                        user.role === 'admin' ? 'badge-navy' : user.role === 'seller' ? 'badge-mint' : 'badge-cream'
                      }`} style={{ alignSelf: 'flex-start' }}>
                        {user.role}
                      </span>
                    </div>

                    <Link to="/buyer/orders" role="menuitem" className="menu-item" onClick={() => setUserDropdownOpen(false)}>
                      <Package size={16} aria-hidden="true" /> My Orders
                    </Link>
                    <Link to="/buyer/dashboard" role="menuitem" className="menu-item" onClick={() => setUserDropdownOpen(false)}>
                      <UserIcon size={16} aria-hidden="true" /> Account Profile
                    </Link>

                    {isSeller && (
                      <Link to="/seller/dashboard" role="menuitem" className="menu-item" style={{ fontWeight: 540 }} onClick={() => setUserDropdownOpen(false)}>
                        <Store size={16} aria-hidden="true" /> Seller Studio
                      </Link>
                    )}
                    {isAdmin && (
                      <Link to="/admin/dashboard" role="menuitem" className="menu-item" style={{ fontWeight: 540 }} onClick={() => setUserDropdownOpen(false)}>
                        <ShieldCheck size={16} aria-hidden="true" /> Admin Panel
                      </Link>
                    )}

                    <hr className="menu-rule" />
                    <button onClick={handleLogout} className="menu-item menu-item--danger">
                      <LogOut size={16} aria-hidden="true" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth-desktop">
                <Link to="/login" className="btn btn-ghost">Log In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Join</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-icon btn-icon-ghost nav-mobile-toggle"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile overlay menu — full-canvas */}
        {mobileMenuOpen && (
          <nav
            style={{
              borderTop: '1px solid var(--color-hairline)',
              padding: 'var(--space-md) var(--container-gutter) var(--space-lg) var(--container-gutter)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              background: 'var(--color-canvas)'
            }}
            aria-label="Mobile"
          >
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', marginBottom: '12px' }}>
              <input
                type="text"
                className="nav-search"
                placeholder="Search handmade items…"
                aria-label="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                size={16}
                aria-hidden="true"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
            </form>

            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 17, fontWeight: 480, padding: '10px 0' }}>
              Explore All Crafts
            </Link>
            <Link to="/shop?category=Handmade%20Candles" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 17, fontWeight: 330, padding: '10px 0' }}>
              Handmade Candles
            </Link>
            <Link to="/shop?category=Jewellery" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 17, fontWeight: 330, padding: '10px 0' }}>
              Jewellery
            </Link>
            <Link to="/shop?category=Crochet%20and%20Knitting" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 17, fontWeight: 330, padding: '10px 0' }}>
              Crochet &amp; Knitting
            </Link>
            <Link to="/shop?category=Home%20D%C3%A9cor" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 17, fontWeight: 330, padding: '10px 0' }}>
              Home Décor
            </Link>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--color-hairline-soft)', paddingTop: '16px' }}>
              {!isAuthenticated && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Log In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>
                    Join CraftNest
                  </Link>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link to="/become-seller" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Become a Seller
                </Link>
                <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>
                  <Plus size={16} aria-hidden="true" /> Shop
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* {components.marquee-strip} — thin black ribbon directly under the nav */}
      <div className="marquee-strip">
        <span>
          Handmade with heart · Free shipping across India on orders above ₹999 ·{' '}
          <Link to="/shop">Explore crafts</Link>
        </span>
      </div>
    </>
  );
};

export default Navbar;
