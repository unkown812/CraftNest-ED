import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Store, BarChart3, Plus } from 'lucide-react';
import DashboardLayout from '../components/common/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const SellerLayout = () => {
  const { user } = useAuth();

  const menuItems = [
    { label: 'Overview', path: '/seller/dashboard', icon: LayoutDashboard },
    { label: 'My Products', path: '/seller/products', icon: Package },
    { label: 'Orders & Fulfillment', path: '/seller/orders', icon: ShoppingBag },
    { label: 'Shop Profile', path: '/seller/shop', icon: Store },
    { label: 'Sales & Analytics', path: '/seller/analytics', icon: BarChart3 }
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      sidebarKicker="Artisan Studio"
      sidebarTitle={user?.sellerProfile?.shopName || `${user?.name}'s Workshop`}
      accentBadge="Seller Partner"
      headerTitle="Artisan Maker Dashboard"
      headerAction={
        <Link to="/seller/products" className="btn btn-primary btn-sm">
          <Plus size={15} aria-hidden="true" />
          <span>Add Product</span>
        </Link>
      }
    />
  );
};

export default SellerLayout;
