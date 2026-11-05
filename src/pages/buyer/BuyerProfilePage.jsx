import React, { useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';

const BuyerProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [removingIndex, setRemovingIndex] = useState(null);

  // New address form modal/toggle
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await api.patch('/auth/profile', { name, phone });
      if (res.data.success) {
        updateUser(res.data.user);
        addToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      addToast('Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.street || !newAddr.city || !newAddr.postalCode) {
      addToast('Please fill out all address fields', 'error');
      return;
    }

    try {
      setSavingAddress(true);
      const updatedAddresses = [...addresses, newAddr];
      const res = await api.patch('/auth/profile', { addresses: updatedAddresses });
      if (res.data.success) {
        setAddresses(res.data.user.addresses);
        updateUser(res.data.user);
        setShowAddressForm(false);
        setNewAddr({
          fullName: user?.name || '',
          phone: user?.phone || '',
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India',
          isDefault: false
        });
        addToast('Delivery address saved!', 'success');
      }
    } catch (err) {
      addToast('Failed to save address', 'error');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      setRemovingIndex(index);
      const updated = addresses.filter((_, i) => i !== index);
      const res = await api.patch('/auth/profile', { addresses: updated });
      if (res.data.success) {
        setAddresses(res.data.user.addresses);
        updateUser(res.data.user);
        addToast('Address removed', 'info');
      }
    } catch (err) {
      addToast('Failed to remove address', 'error');
    } finally {
      setRemovingIndex(null);
    }
  };

  const initials = (user?.name || 'CN')
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="container" style={{ maxWidth: '850px', paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xxl)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="t-caption" style={{ marginBottom: 'var(--space-xs)' }}>
          Account
        </p>
        <h1 className="t-display-lg" style={{ marginBottom: 'var(--space-xs)' }}>
          My account
        </h1>
        <p className="t-body-sm">Manage your personal profile and saved delivery addresses</p>
      </div>

      {/* Profile header card + stats */}
      <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div className="avatar" style={{ width: '56px', height: '56px', fontSize: '20px' }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <h2 className="t-headline">{user?.name}</h2>
            <p className="t-caption">{user?.email}</p>
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: 'var(--space-lg)' }}>
          <div className="stat-card">
            <span className="stat-label">Saved addresses</span>
            <span className="stat-value">{addresses.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Account type</span>
            <span className="stat-value" style={{ textTransform: 'capitalize' }}>
              {user?.role || 'Buyer'}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Phone on file</span>
            <span className="stat-value">{user?.phone ? 'Set' : '—'}</span>
          </div>
        </div>
      </div>

      {/* Personal Details Card */}
      <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
        <h3 className="t-headline" style={{ marginBottom: 'var(--space-lg)' }}>
          Personal details
        </h3>

        <form onSubmit={handleProfileSave}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
              gap: 'var(--space-md)',
              marginBottom: 'var(--space-lg)'
            }}
          >
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">
                Email Address (read-only)
              </label>
              <input
                id="profile-email"
                type="email"
                value={user?.email || ''}
                readOnly
                className="form-input"
                style={{ backgroundColor: 'var(--color-surface-soft)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-phone">
                Phone Number
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                placeholder="+91…"
              />
            </div>
          </div>

          <button type="submit" disabled={savingProfile} className="btn btn-primary">
            {savingProfile ? (
              <>
                <div className="spinner-sm" />
                <span>Saving…</span>
              </>
            ) : (
              <span>Save profile changes</span>
            )}
          </button>
        </form>
      </div>

      {/* Saved Addresses Card */}
      <div className="card" style={{ padding: 'var(--space-xl)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-lg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xxs)' }}>
            <MapPin size={18} aria-hidden="true" />
            <h3 className="t-headline">Saved delivery addresses</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAddressForm(!showAddressForm)}
            className="btn btn-secondary btn-sm"
          >
            <Plus size={15} aria-hidden="true" />
            <span>Add new address</span>
          </button>
        </div>

        {/* New address form */}
        {showAddressForm && (
          <form
            onSubmit={handleAddAddress}
            className="card-tile"
            style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}
          >
            <div className="t-body-sm w540" style={{ marginBottom: 'var(--space-md)' }}>
              Add new address
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="addr-name">
                  Full Name
                </label>
                <input
                  id="addr-name"
                  type="text"
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="addr-phone">
                  Phone
                </label>
                <input
                  id="addr-phone"
                  type="tel"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label" htmlFor="addr-street">
                  Street Address &amp; Flat / House No.
                </label>
                <input
                  id="addr-street"
                  type="text"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="addr-city">
                  City
                </label>
                <input
                  id="addr-city"
                  type="text"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="addr-state">
                  State
                </label>
                <input
                  id="addr-state"
                  type="text"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="addr-postal">
                  Postal / PIN Code
                </label>
                <input
                  id="addr-postal"
                  type="text"
                  value={newAddr.postalCode}
                  onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div className="btn-row">
              <button type="submit" disabled={savingAddress} className="btn btn-sm btn-primary">
                {savingAddress ? (
                  <>
                    <div className="spinner-sm" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <span>Save address</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAddressForm(false)}
                className="btn btn-sm btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* List of addresses */}
        {addresses.length === 0 ? (
          <p className="t-body-sm">
            No saved addresses yet. Add one above or during checkout.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 'var(--space-md)' }}>
            {addresses.map((addr, idx) => (
              <div
                key={idx}
                className="card-tile"
                style={{
                  padding: 'var(--space-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 'var(--space-sm)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <div>
                    <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-xxs)' }}>
                      Recipient
                    </span>
                    <div className="t-body-sm w540">{addr.fullName}</div>
                  </div>
                  <div>
                    <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-xxs)' }}>
                      Address
                    </span>
                    <div className="t-body-sm">
                      {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                    </div>
                  </div>
                  <div>
                    <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-xxs)' }}>
                      Phone
                    </span>
                    <div className="t-body-sm">{addr.phone}</div>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--color-hairline-soft)',
                    paddingTop: 'var(--space-xs)',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(idx)}
                    disabled={removingIndex === idx}
                    className="btn btn-danger btn-sm"
                  >
                    {removingIndex === idx ? (
                      <>
                        <div className="spinner-sm" />
                        <span>Removing…</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} aria-hidden="true" />
                        <span>Remove</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerProfilePage;
