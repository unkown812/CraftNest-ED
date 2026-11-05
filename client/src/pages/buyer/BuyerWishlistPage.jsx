import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/common/ProductCard';

const BuyerWishlistPage = () => {
  const { wishlist, wishlistCount, loading } = useWishlist();

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xxl)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="t-caption" style={{ marginBottom: 'var(--space-xs)' }}>
          Wishlist — {wishlistCount} {wishlistCount === 1 ? 'Item' : 'Items'}
        </p>
        <h1 className="t-display-lg" style={{ marginBottom: 'var(--space-xs)' }}>
          My wishlist
        </h1>
        <p className="t-body-sm">
          Handcrafted creations you have saved for yourself or upcoming celebrations
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Heart size={24} aria-hidden="true" />
          </div>
          <h3 className="t-headline">No saved items yet</h3>
          <p className="t-body-sm">
            Explore our catalogue and click the heart icon to save beautiful handmade items.
          </p>
          <Link to="/shop" className="btn btn-primary">
            <span>Discover crafts</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="grid-4">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerWishlistPage;
