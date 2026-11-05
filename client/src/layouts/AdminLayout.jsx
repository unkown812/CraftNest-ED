import React from 'react';
import { LayoutDashboard, Users, Store, ShoppingBag, BarChart3, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../components/common/DashboardLayout';

const AdminLayout = () => {
  const navLinks = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Sellers & Approvals', path: '/admin/sellers', icon: Store },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Marketplace Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Revenue & Commission', path: '/admin/reports', icon: BarChart3 }
  ];

  return (
    <DashboardLayout
      menuItems={navLinks}
      sidebarKicker="Administration"
      sidebarTitle="CraftNest Console"
      accentBadge="Super Admin"
      headerTitle="Marketplace Administration & Control"
      headerAction={
        <span className="badge badge-navy" style={{ gap: 6 }}>
          <ShieldCheck size={12} aria-hidden="true" /> Super Admin
        </span>
      }
    />
  );
};

export default AdminLayout;
