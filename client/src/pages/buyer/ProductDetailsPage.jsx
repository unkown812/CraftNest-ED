import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Store,
  CheckCircle2,
  Plus,
  Minus
} from 'lucide-react';
import api from '../../api/client';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ProductCard from '../../components/common/ProductCard';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewEligibility, setReviewEligibility] = useState({ eligible: false, reason: 'loading' });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        if (res.data.success && res.data.product) {
          setProduct(res.data.product);
          setReviews(res.data.product.reviews || []);
          setSelectedImageIndex(0);
          setQuantity(1);

          // Check review eligibility if user is logged in
          if (isAuthenticated) {
            try {
              const eligRes = await api.get(`/products/${res.data.product._id}/reviews/eligibility`);
              if (eligRes.data.success) {
                setReviewEligibility(eligRes.data);
              }
            } catch {
              setReviewEligibility({ eligible: false, reason: 'error' });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, isAuthenticated]);

  // Surface-soft skeleton while the product loads
  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-section)' }} aria-busy="true">
        <div role="status" aria-label="Loading product">
          <div
            style={{
              height: 12,
              width: 220,
              backgroundColor: 'var(--color-surface-soft)',
              borderRadius: 'var(--radius-pill)',
              marginBottom: 'var(--space-xl)'
            }}
          />
          <div className="grid-2" style={{ gap: 'var(--space-xl)', alignItems: 'start' }}>
            <div style={{ backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-lg)', minHeight: 480 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {[64, 40, 28, 180, 24, 120].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: i === 0 ? 26 : 16,
                    width: i === 0 ? '86%' : i === 3 ? '100%' : `${w * 2}px`,
                    backgroundColor: 'var(--color-surface-soft)',
                    borderRadius: 'var(--radius-pill)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: 'var(--space-section) 0', textAlign: 'center' }}>
        <h2 className="t-headline">Product not found</h2>
        <p className="t-body" style={{ margin: 'var(--space-sm) 0 var(--space-xl) 0' }}>
          This handcrafted treasure might have been moved or is no longer listed.
        </p>
        <Link to="/shop" className="btn btn-primary">
          Back to shop
        </Link>
      </div>
    );
  }

  const inWishlist = isWishlisted(product._id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 4;
  const currentImage = (product.images && product.images[selectedImageIndex]) || product.images?.[0];

  const handleAddToCart = async () => {
    if (isOutOfStock || addingToCart) return;
    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      addToast('Please write a comment for your review', 'error');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment.trim()
      });

      if (res.data.success) {
        addToast('Review submitted successfully!', 'success');
        setReviews([res.data.review, ...reviews]);
        setReviewComment('');
        setReviewEligibility({ eligible: false, reason: 'already_reviewed' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not submit review';
      addToast(msg, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div style={{ minHeight: '90vh' }}>
      <div className="container" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-section)' }}>
        {/* Breadcrumb — mono taxonomy */}
        <nav aria-label="Breadcrumb" className="t-caption" style={{ marginBottom: 'var(--space-xl)' }}>
          <Link to="/" style={{ color: 'inherit' }}>Home</Link> /{' '}
          <Link to="/shop" style={{ color: 'inherit' }}>Shop</Link> /{' '}
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} style={{ color: 'inherit' }}>
            {product.category}
          </Link>{' '}
          / <span>{product.name}</span>
        </nav>

        {/* Gallery + purchase panel */}
        <div className="grid-2" style={{ gap: 'var(--space-xl)', alignItems: 'start', marginBottom: 'var(--space-section)' }}>
          {/* Left gallery */}
          <div>
            <div className="img-frame" style={{ position: 'relative', aspectRatio: '1 / 1' }}>
              <img
                src={currentImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => toggleWishlist(product)}
                aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                aria-pressed={inWishlist}
                className="btn-icon"
                style={{ position: 'absolute', top: 'var(--space-sm)', right: 'var(--space-sm)', boxShadow: 'var(--shadow-card)' }}
              >
                <Heart
                  size={17}
                  color={inWishlist ? 'var(--color-primary)' : 'var(--color-ink)'}
                  fill={inWishlist ? 'var(--color-primary)' : 'none'}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 'var(--space-sm)', overflowX: 'auto' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`View image ${idx + 1} of ${product.images.length}`}
                    aria-pressed={selectedImageIndex === idx}
                    className={`thumb-ring ${selectedImageIndex === idx ? 'is-active' : ''}`}
                    style={{ width: 74, height: 74, padding: 0, flexShrink: 0, background: 'none' }}
                  >
                    <img src={img} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right purchase panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {product.shop && (
              <p className="t-caption" style={{ margin: 0 }}>
                Crafted by {product.shop.shopName}
              </p>
            )}

            <h1 className="t-display-lg w340" style={{ margin: 'calc(-1 * var(--space-xxs)) 0 0 0', overflowWrap: 'anywhere' }}>
              {product.name}
            </h1>

            {/* Rating row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xxs)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', color: 'var(--color-star)' }} aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.round(product.averageRating || 5) ? 'var(--color-star)' : 'none'}
                    color="var(--color-star)"
                  />
                ))}
              </div>
              <span style={{ fontWeight: 480 }}>
                {product.averageRating > 0 ? product.averageRating.toFixed(1) : '5.0'}
              </span>
              <span className="t-caption" style={{ letterSpacing: '0.5px' }}>
                {reviews.length} {reviews.length === 1 ? 'verified review' : 'verified reviews'}
              </span>
            </div>

            {/* Price + stock status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              <div>
                <p className="t-caption" style={{ margin: '0 0 var(--space-xxs) 0' }}>Artisan price</p>
                <div className="stat-value" style={{ margin: 0 }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </div>
              </div>
              {isOutOfStock ? (
                <span className="badge badge-error">Sold out</span>
              ) : isLowStock ? (
                <span className="badge badge-cream">Low stock · {product.stock} left</span>
              ) : (
                <span className="badge badge-mint">In stock</span>
              )}
              <p className="t-caption" style={{ margin: 'auto 0 0 0', letterSpacing: '0.4px' }}>
                Incl. all taxes · free delivery above ₹999
              </p>
            </div>

            <p className="t-body" style={{ margin: 0, whiteSpace: 'pre-line' }}>
              {product.description}
            </p>

            {/* Specification rows — key/value with hairline separators */}
            <div style={{ borderTop: '1px solid var(--color-hairline)', marginTop: 'var(--space-xs)' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(min(100%, 110px), 150px) 1fr',
                  gap: 'var(--space-sm)',
                  alignItems: 'baseline',
                  padding: 'var(--space-sm) 0',
                  borderBottom: '1px solid var(--color-hairline-soft)'
                }}
              >
                <span className="t-caption">Materials</span>
                <span className="t-body-sm">{product.materials || 'Handcrafted natural materials'}</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(min(100%, 110px), 150px) 1fr',
                  gap: 'var(--space-sm)',
                  alignItems: 'baseline',
                  padding: 'var(--space-sm) 0',
                  borderBottom: '1px solid var(--color-hairline-soft)'
                }}
              >
                <span className="t-caption">Dimensions</span>
                <span className="t-body-sm">{product.dimensions || 'Standard handcrafted sizing'}</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(min(100%, 110px), 150px) 1fr',
                  gap: 'var(--space-sm)',
                  alignItems: 'baseline',
                  padding: 'var(--space-sm) 0'
                }}
              >
                <span className="t-caption">Processing time</span>
                <span className="t-body-sm">{product.processingTime || '2–4 business days'}</span>
              </div>
              {product.customizationAvailable && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(min(100%, 110px), 150px) 1fr',
                    gap: 'var(--space-sm)',
                    alignItems: 'baseline',
                    padding: 'var(--space-sm) 0',
                    borderTop: '1px solid var(--color-hairline-soft)'
                  }}
                >
                  <span className="t-caption">Customisation</span>
                  <span className="t-body-sm" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-xxs)' }}>
                    <Sparkles size={15} aria-hidden="true" style={{ flexShrink: 0, marginTop: '3px' }} />
                    {product.customizationNotes || 'Gift inscriptions and custom sizes available on request.'}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xxs)' }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="btn-icon"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} aria-hidden="true" />
                </button>
                <span
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 480, minWidth: 32, textAlign: 'center' }}
                  aria-live="polite"
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="btn-icon"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
              <span className="t-caption">Quantity</span>
            </div>

            {/* Primary actions */}
            <div className="btn-row">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                className="btn btn-primary btn-lg"
                style={{ flex: 1, minWidth: 200 }}
              >
                {addingToCart ? <span className="spinner-sm" /> : <ShoppingBag size={18} aria-hidden="true" />}
                <span>{isOutOfStock ? 'Sold out' : addingToCart ? 'Adding…' : 'Add to basket'}</span>
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                aria-pressed={inWishlist}
                className={inWishlist ? 'btn-icon btn-icon-primary' : 'btn-icon'}
                style={{ width: 52, height: 52, minWidth: 52, minHeight: 52, border: inWishlist ? '1px solid var(--color-primary)' : '1px solid var(--color-hairline)', background: inWishlist ? undefined : 'var(--color-canvas)' }}
              >
                <Heart
                  size={18}
                  color={inWishlist ? 'var(--color-on-primary)' : 'var(--color-ink)'}
                  fill={inWishlist ? 'var(--color-on-primary)' : 'none'}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Artisan attribution tile */}
            {product.shop && (
              <div className="card-tile" style={{ padding: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <Store size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="t-caption" style={{ margin: 0 }}>The maker</p>
                  <p style={{ margin: 'var(--space-xxs) 0 0 0', fontWeight: 480, overflowWrap: 'anywhere' }}>
                    {product.shop.shopName}
                  </p>
                </div>
                {product.shop.contactDetails?.city && (
                  <span className="t-caption">{product.shop.contactDetails.city}</span>
                )}
              </div>
            )}

            {/* Trust assurances */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-sm)',
                paddingTop: 'var(--space-md)',
                borderTop: '1px solid var(--color-hairline)'
              }}
            >
              <span className="t-body-sm" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xxs)' }}>
                <Truck size={16} aria-hidden="true" /> Pan-India tracked courier
              </span>
              <span className="t-body-sm" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xxs)' }}>
                <ShieldCheck size={16} aria-hidden="true" /> Verified craft authenticity
              </span>
              <span className="t-body-sm" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xxs)' }}>
                <RotateCcw size={16} aria-hidden="true" /> 7-day artisan replacement
              </span>
            </div>
          </div>
        </div>

        {/* Customer reviews — white canvas */}
        <section style={{ marginBottom: 'var(--space-section)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: 'var(--space-md)',
              marginBottom: 'var(--space-lg)'
            }}
          >
            <div>
              <p className="t-caption" style={{ margin: '0 0 var(--space-xxs) 0' }}>Verified purchase feedback</p>
              <h2 className="t-headline" style={{ margin: 0 }}>Customer reviews</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <div className="stat-value" style={{ fontSize: 26 }}>
                {product.averageRating > 0 ? product.averageRating.toFixed(1) : '5.0'}
              </div>
              <div>
                <div style={{ display: 'flex', color: 'var(--color-star)' }} aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="var(--color-star)" />
                  ))}
                </div>
                <p className="t-caption" style={{ margin: 'var(--space-xxs) 0 0 0' }}>
                  {reviews.length} reviews
                </p>
              </div>
            </div>
          </div>

          {/* Review submission form (verified buyers only) */}
          {isAuthenticated ? (
            reviewEligibility.eligible ? (
              <form onSubmit={handleReviewSubmit} className="card-tile" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
                <p
                  className="t-body-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xxs)', margin: '0 0 var(--space-md) 0', fontWeight: 480 }}
                >
                  <CheckCircle2 size={17} color="var(--color-semantic-success)" aria-hidden="true" />
                  Verified purchase — share your experience with this craft
                </p>

                <div className="form-group">
                  <span className="form-label" id="review-rating-label">Rating</span>
                  <div role="radiogroup" aria-labelledby="review-rating-label" style={{ display: 'flex', gap: 'var(--space-xxs)' }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setReviewRating(num)}
                        aria-label={`Rate ${num} star${num > 1 ? 's' : ''}`}
                        className="btn-icon btn-icon-ghost"
                        style={{ width: 32, height: 32, minWidth: 32, minHeight: 32 }}
                      >
                        <Star
                          size={20}
                          fill={num <= reviewRating ? 'var(--color-star)' : 'none'}
                          color="var(--color-star)"
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="review-comment">Your review</label>
                  <textarea
                    id="review-comment"
                    rows={3}
                    placeholder="Describe the craft quality, packaging, textures, and sensory feel…"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="form-textarea"
                    required
                  />
                </div>

                <button type="submit" disabled={submittingReview} className="btn btn-secondary">
                  {submittingReview && <span className="spinner-sm" />}
                  <span>{submittingReview ? 'Submitting…' : 'Post verified review'}</span>
                </button>
              </form>
            ) : reviewEligibility.reason === 'already_reviewed' ? (
              <div
                className="card-tile"
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  color: 'var(--color-semantic-success)',
                  marginBottom: 'var(--space-lg)'
                }}
              >
                <CheckCircle2 size={17} aria-hidden="true" style={{ flexShrink: 0 }} />
                <span className="t-body-sm">
                  You have reviewed this handcrafted item. Thank you for supporting our artisans!
                </span>
              </div>
            ) : (
              <div
                className="card-tile"
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  marginBottom: 'var(--space-lg)'
                }}
              >
                <ShieldCheck size={17} aria-hidden="true" style={{ flexShrink: 0 }} />
                <span className="t-body-sm">
                  Reviews are reserved for customers who have ordered this item, to keep the feedback genuine.
                </span>
              </div>
            )
          ) : (
            <div className="card-tile" style={{ padding: 'var(--space-sm) var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              <span className="t-body-sm">
                Please <Link to="/login" className="t-link" style={{ fontSize: 16, fontWeight: 480 }}>log in</Link> to write a
                verified review.
              </span>
            </div>
          )}

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Star size={22} aria-hidden="true" /></div>
              <p>No reviews yet for this newly crafted item.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {reviews.map((rev) => (
                <article key={rev._id} className="card" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 'var(--space-xxs)',
                      marginBottom: 'var(--space-xxs)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xxs)', flexWrap: 'wrap' }}>
                      <span className="t-caption">{rev.buyerName || 'Verified patron'}</span>
                      <span className="badge badge-mint">Verified purchase</span>
                    </div>
                    <span className="t-caption">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div
                    role="img"
                    aria-label={`Rated ${rev.rating} out of 5`}
                    style={{ display: 'flex', color: 'var(--color-star)', gap: 3, marginBottom: 'var(--space-xxs)' }}
                  >
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="var(--color-star)" aria-hidden="true" />
                    ))}
                  </div>

                  <p className="t-body-sm" style={{ margin: 0 }}>
                    {rev.comment}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Related products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <section>
            <p className="t-caption" style={{ margin: '0 0 var(--space-xxs) 0' }}>More from {product.category}</p>
            <h2 className="t-headline" style={{ marginBottom: 'var(--space-lg)' }}>More handcrafted treasures</h2>
            <div className="grid-4">
              {product.relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
