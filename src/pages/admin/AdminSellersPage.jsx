import React, { useState, useEffect } from 'react';
import { Store, Check, RotateCcw, ShieldAlert } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const AdminSellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { addToast } = useToast();

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/sellers');
      if (res.data.success) {
        setSellers(res.data.sellers);
      }
    } catch (err) {
      console.error('Error fetching sellers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleUpdateStatus = async (sellerId, newStatus) => {
    try {
      setUpdatingId(sellerId);
      const res = await api.patch(`/admin/sellers/${sellerId}/approval`, {
        approvalStatus: newStatus
      });
      if (res.data.success) {
        addToast(`Seller account status set to ${newStatus}`, 'success');
        fetchSellers();
      }
    } catch (err) {
      addToast('Failed to update seller status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  const statusBadge = (status) =>
    status === 'approved' ? 'badge-success' : status === 'pending' ? 'badge-cream' : 'badge-error';

  return (
    <div className="page-stack" style={{ gap: 'var(--space-lg)' }}>
      {/* Page header */}
      <div className="toolbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xxs)' }}>
          <span className="t-caption">Admin console</span>
          <h1 className="t-headline" style={{ margin: 0 }}>
            Seller Verification &amp; Directory
          </h1>
          <p className="t-body-sm w330" style={{ margin: 0 }}>
            Inspect artisan applications, verify maker profiles, approve or suspend seller accounts
          </p>
        </div>
        <div className="toolbar-spacer" />
        <span className="badge badge-neutral">{sellers.length} sellers</span>
      </div>

      {/* Seller directory */}
      <div className="table-wrap">
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Shop &amp; Artisan</th>
                <th>Craft Speciality</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Approval Status</th>
                <th style={{ textAlign: 'right' }}>Moderation Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => {
                const status = seller.approvalStatus;

                return (
                  <tr key={seller._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          className="avatar"
                          style={{ width: '40px', height: '40px', fontSize: '15px' }}
                        >
                          {seller.shopName ? seller.shopName[0] : 'S'}
                        </span>
                        <div>
                          <div className="t-body-sm w480">{seller.shopName}</div>
                          <div className="t-caption" style={{ marginTop: 'var(--space-xxs)' }}>
                            {seller.userId?.name || 'Artisan Maker'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="t-body-sm">
                      {seller.contactDetails?.craftSpeciality || 'Handmade Crafts'}
                    </td>

                    <td className="t-body-sm">
                      {seller.contactDetails?.city || 'India'}, {seller.contactDetails?.state || ''}
                    </td>

                    <td className="t-body-sm">
                      <div>{seller.contactDetails?.email || seller.userId?.email}</div>
                      <div className="t-caption" style={{ marginTop: 'var(--space-xxs)' }}>
                        {seller.contactDetails?.phone || seller.userId?.phone || 'No phone'}
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${statusBadge(status)}`}>{status}</span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          gap: 'var(--space-xxs)',
                          alignItems: 'center'
                        }}
                      >
                        {status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(seller._id, 'approved')}
                            disabled={updatingId === seller._id}
                            className="btn-icon btn-icon-ghost"
                            aria-label={`Approve ${seller.shopName || 'seller'}`}
                          >
                            <Check size={16} aria-hidden="true" />
                          </button>
                        )}

                        {status === 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(seller._id, 'suspended')}
                            disabled={updatingId === seller._id}
                            className="btn btn-sm btn-danger"
                            aria-label={`Suspend ${seller.shopName || 'seller'}`}
                          >
                            <ShieldAlert size={14} aria-hidden="true" />
                            <span>Suspend</span>
                          </button>
                        )}

                        {status === 'suspended' && (
                          <button
                            onClick={() => handleUpdateStatus(seller._id, 'approved')}
                            disabled={updatingId === seller._id}
                            className="btn-icon btn-icon-ghost"
                            aria-label={`Reinstate ${seller.shopName || 'seller'}`}
                          >
                            <RotateCcw size={16} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sellers.length === 0 && (
          <div style={{ padding: '0 var(--space-lg) var(--space-xl)' }}>
            <div className="empty-state">
              <span className="empty-icon">
                <Store size={22} aria-hidden="true" />
              </span>
              <h3 className="t-headline">No artisan applications yet</h3>
              <p className="t-body-sm w330">
                Seller applications will appear here as makers onboard to the marketplace.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSellersPage;
