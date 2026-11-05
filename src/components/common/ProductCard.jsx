import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!product) return null;

  const inWishlist = isWishlisted(product._id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 4;
  const imageUrl = (product.images && product.images.length > 0)
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80';

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product._id, 1);
    }
  };

  return (
    <div className="card product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Embedded preview inside a template-card tile */}
      <Link
        to={`/product/${product.slug || product._id}`}
        className="img-frame"
        style={{ position: 'relative', paddingTop: '88%', display: 'block', margin: '10px 10px 0 10px' }}
        aria-label={product.name}
      >
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="product-img-hover"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Wishlist — circular icon button overlaid on the image */}
        <button
          onClick={handleWishlistClick}
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={inWishlist}
          className="btn-icon"
          style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, minWidth: 36, minHeight: 36, boxShadow: 'var(--shadow-card)' }}
        >
          <Heart
            size={17}
            color={inWishlist ? 'var(--color-primary)' : 'var(--color-ink)'}
            fill={inWishlist ? 'var(--color-primary)' : 'none'}
            aria-hidden="true"
          />
        </button>
      </Link>

      {/* Content */}
      <div style={{ padding: '14px 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {product.shop && (
          <span className="t-caption" style={{ letterSpacing: '0.5px' }}>
            by {product.shop.shopName}
          </span>
        )}

        <h3 style={{ fontSize: '17px', fontWeight: 540, lineHeight: 1.35, letterSpacing: '-0.2px' }}>
          <Link
            to={`/product/${product.slug || product._id}`}
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {product.name}
          </Link>
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 330 }}>
          <Star size={14} fill="var(--color-star)" color="var(--color-star)" aria-hidden="true" />
          <span style={{ fontWeight: 480 }}>{product.averageRating > 0 ? product.averageRating.toFixed(1) : '5.0'}</span>
          <span style={{ fontWeight: 330 }}>
            ({product.reviewCount || 1} {product.reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        {/* Price & action — mono price hierarchy, circular add button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            paddingTop: 10,
            borderTop: '1px solid var(--color-hairline-soft)',
            marginTop: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="t-caption" style={{ letterSpacing: '0.5px' }}>₹{product.price.toLocaleString('en-IN')}</span>
            {isOutOfStock && <span className="badge badge-error">Sold out</span>}
            {isLowStock && <span className="badge badge-cream">Only {product.stock} left</span>}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="btn-icon btn-icon-primary btn-sm"
            aria-label={isOutOfStock ? `${product.name} is sold out` : `Add ${product.name} to cart`}
            title={isOutOfStock ? 'Item is sold out' : 'Add to cart'}
          >
            <ShoppingBag size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
