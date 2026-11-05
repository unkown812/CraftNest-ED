import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  X
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = [
  'Handmade Candles',
  'Jewellery',
  'Crochet and Knitting',
  'Home Décor',
  'Paintings and Art',
  'Greeting Cards',
  'Gift Hampers',
  'Personalized Gifts',
  'Other Crafts'
];

const INITIAL_FORM = {
  name: '',
  category: 'Handmade Candles',
  description: '',
  price: '',
  stock: 1,
  imageUrl: '',
  materials: '',
  dimensions: '',
  processingTime: '2-3 business days',
  customizationAvailable: false,
  customizationNotes: '',
  status: 'active'
};

const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/seller/products');
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Error fetching seller products:', err);
      setError(err.response?.data?.message || 'Failed to load your products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData(INITIAL_FORM);
    setSelectedFile(null);
    setShowModal(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      imageUrl: prod.images?.[0] || '',
      materials: prod.materials || '',
      dimensions: prod.dimensions || '',
      processingTime: prod.processingTime || '2-3 business days',
      customizationAvailable: Boolean(prod.customizationAvailable),
      customizationNotes: prod.customizationNotes || '',
      status: prod.status || 'active'
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim() || !formData.price) {
      addToast('Please provide product name, description, and price', 'error');
      return;
    }

    try {
      setSaving(true);
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('category', formData.category);
      data.append('description', formData.description.trim());
      data.append('price', Number(formData.price));
      data.append('stock', Number(formData.stock));
      data.append('materials', formData.materials.trim());
      data.append('dimensions', formData.dimensions.trim());
      data.append('processingTime', formData.processingTime.trim());
      data.append('customizationAvailable', formData.customizationAvailable);
      data.append('customizationNotes', formData.customizationNotes.trim());
      data.append('status', formData.status);

      if (selectedFile) {
        data.append('images', selectedFile);
      } else if (formData.imageUrl) {
        data.append('images', formData.imageUrl.trim());
      }

      if (editingProduct) {
        await api.patch(`/products/${editingProduct._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        addToast('Handcrafted product updated!', 'success');
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        addToast('New handcrafted product listed!', 'success');
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save product';
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from your listings?`)) {
      return;
    }

    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        addToast('Product listing removed', 'info');
        setProducts(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  if (loading) {
    return (
      <div className="page-loading" style={{ flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <div className="spinner" />
        <p className="t-caption">Loading your products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-surface" style={{ marginTop: 'var(--space-lg)' }}>
        <span>{error}</span>
        <button onClick={fetchProducts} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="page-stack">
      {/* Header */}
      <div className="toolbar">
        <div>
          <p className="t-caption" style={{ marginBottom: 'var(--space-xs)' }}>Product Studio</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            <h1 className="t-headline" style={{ margin: 0 }}>My Handcrafted Products</h1>
            <span className="badge badge-outline">{products.length} Listed</span>
          </div>
          <p className="t-body-sm" style={{ margin: 'var(--space-xxs) 0 0 0' }}>
            List, update stock, prices, and manage your artisan catalogue
          </p>
        </div>

        <div className="toolbar-spacer" />
        <button onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} aria-hidden="true" />
          <span>Add New Creation</span>
        </button>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Package size={24} aria-hidden="true" />
          </div>
          <h3>No products listed yet</h3>
          <p>
            Begin by adding your first candle, crochet creation, pottery piece, or handmade gift hamper.
          </p>
          <button onClick={openCreateModal} className="btn btn-primary">
            + Add First Listing
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Creation</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <div className="img-frame" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'}
                            alt={prod.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 540 }}>{prod.name}</div>
                          <div className="t-caption" style={{ marginTop: 'var(--space-xxs)' }}>
                            {prod.processingTime}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{prod.category}</span>
                    </td>
                    <td style={{ fontWeight: 540 }}>
                      ₹{prod.price.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span style={{ fontWeight: 540, color: prod.stock <= 3 ? 'var(--color-semantic-warning)' : 'var(--color-ink)' }}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-star)' }} aria-label={`Rated ${prod.averageRating > 0 ? prod.averageRating.toFixed(1) : '5.0'} of 5 by ${prod.reviewCount || 0} reviews`}>
                      ⭐ {prod.averageRating > 0 ? prod.averageRating.toFixed(1) : '5.0'} ({prod.reviewCount || 0})
                    </td>
                    <td>
                      <span className={`badge ${prod.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                        {prod.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => openEditModal(prod)}
                          className="btn btn-icon btn-sm btn-icon-ghost"
                          aria-label={`Edit ${prod.name}`}
                          title="Edit Product"
                        >
                          <Edit size={16} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id, prod.name)}
                          className="btn btn-icon btn-sm btn-icon-ghost"
                          aria-label={`Delete ${prod.name}`}
                          title="Delete Product"
                          style={{ color: 'var(--color-error)' }}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 'var(--space-lg)'
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={editingProduct ? 'Edit artisan creation' : 'List new handcrafted creation'}
            className="card-floating"
            style={{
              borderRadius: 'var(--radius-lg)',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 'var(--space-xl)',
              boxShadow: 'var(--shadow-floating)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-icon btn-icon-ghost"
              aria-label="Close editor"
              style={{ position: 'absolute', top: 'var(--space-md)', right: 'var(--space-md)' }}
            >
              <X size={18} aria-hidden="true" />
            </button>

            <p className="t-caption" style={{ marginBottom: 'var(--space-xs)' }}>Product Editor</p>
            <h2 className="t-headline" style={{ margin: 0 }}>
              {editingProduct ? 'Edit Artisan Creation' : 'List New Handcrafted Creation'}
            </h2>
            <p className="t-body-sm" style={{ margin: 'var(--space-xs) 0 var(--space-lg) 0' }}>
              Fill in the artisan details for customers across the CraftNest marketplace.
            </p>

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Product Title *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. Soy Wax Lavender Botanical Candle"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price in INR (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. 599"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Processing Time</label>
                  <input
                    type="text"
                    name="processingTime"
                    value={formData.processingTime}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. 1-3 business days"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Materials</label>
                  <input
                    type="text"
                    name="materials"
                    value={formData.materials}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. 100% soy wax, organic cotton wick, dried lavender"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Dimensions / Sizing</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. 8cm x 9cm (240g)"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Detailed Story &amp; Description *</label>
                  <textarea
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Describe your creative process, sensory notes, and care instructions..."
                    required
                  />
                </div>

                {/* Image Upload dropzone or URL */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Upload Product Image</label>
                  <label
                    className="card-tile"
                    style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)', cursor: 'pointer' }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      aria-label="Choose product image file"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                    <span
                      aria-hidden="true"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-canvas)',
                        border: '1px solid var(--color-hairline)',
                        color: 'var(--color-ink)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <ImageIcon size={18} />
                    </span>
                    <span className="t-caption" style={{ flex: 1 }}>
                      {selectedFile ? selectedFile.name : 'PNG / JPG product photo'}
                    </span>
                    <span className="btn btn-secondary btn-sm" aria-hidden="true">Choose File</span>
                  </label>
                  <div className="form-hint" style={{ marginTop: 'var(--space-xs)' }}>
                    Or specify an image URL:
                  </div>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {formData.imageUrl && (
                    <div className="img-frame" style={{ width: '96px', height: '96px', marginTop: 'var(--space-xs)' }}>
                      <img
                        src={formData.imageUrl}
                        alt="Product image preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>

                {/* Customization Available Toggle */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <span className="form-label">Customization</span>
                  <label className="form-check">
                    <input
                      type="checkbox"
                      name="customizationAvailable"
                      checked={formData.customizationAvailable}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <span style={{ fontWeight: 540 }}>Customization Available (inscriptions, colors, personalized messages)</span>
                  </label>
                  {formData.customizationAvailable && (
                    <>
                      <label className="form-label" htmlFor="customization-notes" style={{ marginTop: 'var(--space-xs)' }}>
                        Customization Notes
                      </label>
                      <input
                        type="text"
                        id="customization-notes"
                        name="customizationNotes"
                        value={formData.customizationNotes}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Notes on what can be customized"
                      />
                    </>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Listing Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="active">Active (Visible in shop)</option>
                    <option value="draft">Draft (Private)</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)', borderTop: '1px solid var(--color-hairline-soft)', paddingTop: 'var(--space-md)' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving && <div className="spinner spinner-sm" aria-hidden="true" />}
                  <span>{saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Publish Listing'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductsPage;
