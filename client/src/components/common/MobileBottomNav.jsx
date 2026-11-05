import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, ShoppingBag, User as UserIcon } from 'lucide-react';

/**
 * Mobile primary navigation — fixed bottom bar (phones, < 900px).
 * Three to five primary destinations, large touch targets, safe-area aware.
 * Secondary navigation (categories, search) stays in the top bar hamburger
 * overlay so the underlying IA is unchanged.
 */
const MobileBottomNav = () => (
  <nav className="mobile-bottom-nav" aria-label="Primary">
    <NavLink
      to="/"
      end
      className={({ isActive }) => `mobile-nav-item${isActive ? ' is-active' : ''}`}
      aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
    >
      <Home size={22} aria-hidden="true" />
      <span>Home</span>
    </NavLink>
    <NavLink
      to="/shop"
      className={({ isActive }) => `mobile-nav-item${isActive ? ' is-active' : ''}`}
      aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
    >
      <Compass size={22} aria-hidden="true" />
      <span>Shop</span>
    </NavLink>
    <NavLink
      to="/cart"
      className={({ isActive }) => `mobile-nav-item${isActive ? ' is-active' : ''}`}
      aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
    >
      <ShoppingBag size={22} aria-hidden="true" />
      <span>Cart</span>
    </NavLink>
    <NavLink
      to="/buyer/dashboard"
      className={({ isActive }) => `mobile-nav-item${isActive ? ' is-active' : ''}`}
      aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
    >
      <UserIcon size={22} aria-hidden="true" />
      <span>Account</span>
    </NavLink>
  </nav>
);

export default MobileBottomNav;
