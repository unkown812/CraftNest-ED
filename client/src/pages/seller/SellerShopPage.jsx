import React, { useState, useEffect } from 'react';
import { Eye, Save, MapPin, Image as ImageIcon } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const SellerShopPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    shopName: '',
    description: '',
    banner: '',
    logo: '',
    contactDetails: {
      email: '',
      phone: '',
      city: '',
      state: '',
      craftSpeciality: ''
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/seller/profile');
        if (res.data.success && res.data.profile) {
          setProfile(res.data.profile);
          setFormData({
            shopName: res.data.profile.shopName || '',
            description: res.data.profile.description || '',
            banner: res.data.profile.banner || '',
            logo: res.data.profile.logo || '',
            contactDetails: {
              email: res.data.profile.contactDetails?.email || '',
              phone: res.data.profile.contactDetails?.phone || '',
              city: res.data.profile.contactDetails?.city || '',
              state: res.data.profile.contactDetails?.state || '',
              craftSpeciality: res.data.profile.contactDetails?.craftSpeciality || 'Handmade Crafts'
            }
          });
        }
      } catch (err) {
        console.error('Error fetching seller profile:', err);
        setError(err.response?.data?.message || 'Failed to load your shop settings');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact_')) {
      const field = name.replace('contact_', '');
      setFormData(prev => ({
        ...prev,
        contactDetails: { ...prev.contactDetails, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.shopName.trim()) {
      addToast('Shop name is required', 'error');
      return;
    }

    try {
      setSaving(true);
      const res = await api.patch('/seller/profile', formData);
      if (res.data.success) {
        setProfile(res.data.profile);
        addToast('Shop profile updated successfully!', 'success');
      }
    } catch (err) {
      addToast('Failed to update shop profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading" style={{ flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <div className="spinner" />
        <p className="t-caption">Loading shop settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-surface" style={{ marginTop: 'var(--space-lg)' }}>
        <span>{error}</span>
        <button onClick={() => { setError(''); window.location.reload(); }} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px' }}>
      {/* Page header */}
      <div className="toolbar" style={{ marginBottom: 'var(--space-lg)' }}>
        <div>
          <p className="t-caption" style={{ marginBottom: 'var(--space-xs)' }}>Storefront</p>
          <h1 className="t-headline" style={{ margin: 0 }}>Artisan Shop Profile</h1>
          <p className="t-body-sm" style={{ margin: 'var(--space-xxs) 0 0 0' }}>
            Customize your maker identity, brand story, and contact details
          </p>
        </div>

        <div className="toolbar-spacer" />
        {profile?.slug && (
          <a
            href={`/shop?search=${encodeURIComponent(formData.shopName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <Eye size={15} aria-hidden="true" />
            <span>View Public Storefront</span>
          </a>
        )}
      </div>

      {/* Single block-cream intro band */}
      <div
        style={{
          backgroundColor: 'var(--color-block-cream)',
          border: '1px solid var(--color-hairline)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-lg)',
          marginBottom: 'var(--space-lg)'
        }}
      >
        <p className="t-caption" style={{ marginBottom: 'var(--space-xs)' }}>Your Storefront</p>
        <p className="t-body" style={{ margin: 0, maxWidth: '640px' }}>
          This profile shapes your public maker page across CraftNest — customers see your shop name,
          story, craft speciality, and how to reach your workshop when they visit your storefront.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Brand Info */}
        <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)', borderBottom: '1px solid var(--color-hairline-soft)', paddingBottom: 'var(--space-xs)' }}>
            <ImageIcon size={18} aria-hidden="true" />
            <h3 className="t-card-title" style={{ margin: 0 }}>Shop Identity</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Shop Name *</label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Aarohi Botanicals & Candles"
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Artisan Story &amp; Bio</label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Tell customers about your passion, traditional techniques, and handcrafted philosophy..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Logo / Avatar Image URL</label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://..."
              />
              {formData.logo && (
                <div className="img-frame" style={{ width: '72px', height: '72px', marginTop: 'var(--space-xs)' }}>
                  <img
                    src={formData.logo}
                    alt="Shop logo preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Shop Banner URL</label>
              <input
                type="url"
                name="banner"
                value={formData.banner}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://..."
              />
              {formData.banner && (
                <div className="img-frame" style={{ width: '144px', height: '72px', marginTop: 'var(--space-xs)' }}>
                  <img
                    src={formData.banner}
                    alt="Shop banner preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Business & Location Info */}
        <div className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)', borderBottom: '1px solid var(--color-hairline-soft)', paddingBottom: 'var(--space-xs)' }}>
            <MapPin size={18} aria-hidden="true" />
            <h3 className="t-card-title" style={{ margin: 0 }}>Workshop Location &amp; Craft Speciality</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Craft Speciality</label>
              <input
                type="text"
                name="contact_craftSpeciality"
                value={formData.contactDetails.craftSpeciality}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Soy Wax Candles, Organic Macramé, Terracotta Pottery"
              />
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="contact_city"
                value={formData.contactDetails.city}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Jaipur"
              />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="contact_state"
                value={formData.contactDetails.state}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Rajasthan"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Support Email</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contactDetails.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="artisan@craftnest.in"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Support Phone</label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contactDetails.phone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="+91..."
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving && <div className="spinner spinner-sm" aria-hidden="true" />}
          <Save size={16} aria-hidden="true" />
          <span>{saving ? 'Saving Profile...' : 'Save Shop Settings'}</span>
        </button>
      </form>
    </div>
  );
};

export default SellerShopPage;
