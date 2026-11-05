import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShoppingBag,
  AlertTriangle
} from 'lucide-react';
import api from '../../api/client';
import ProductCard from '../../components/common/ProductCard';

const CATEGORIES = [
  'All',
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

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter States initialized from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Data states
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Sync state if URL query params change
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    const catFromUrl = searchParams.get('category');
    if (searchFromUrl !== null) setSearchTerm(searchFromUrl);
    if (catFromUrl !== null) setSelectedCategory(catFromUrl);
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const params = {
        page: currentPage,
        limit: 12,
        sort: sortBy
      };

      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/products', { params });
      if (res.data.success) {
        setProducts(res.data.products);
        setTotalCount(res.data.totalCount);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, selectedCategory, searchTerm, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div style={{ minHeight: '85vh', padding: 'var(--space-lg) 0 var(--space-section) 0' }}>
      <div className="container">
        {/* Page header — mono eyebrow + display headline + body lead */}
        <header style={{ marginBottom: 'var(--space-xl)' }}>
          <p className="t-caption" style={{ margin: '0 0 var(--space-sm) 0' }}>The catalogue</p>
          <h1 className="t-display-lg" style={{ margin: 0 }}>Handmade Marketplace</h1>
          <p className="t-body" style={{ margin: 'var(--space-sm) 0 0 0' }}>
            Authentic craft pieces made by Indian artisans, one drop at a time.
          </p>
        </header>

        {/* Filter toolbar — pill search, price range, sort */}
        <div className="toolbar shop-toolbar" style={{ marginBottom: 'var(--space-md)' }}>
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            style={{ position: 'relative', width: 'min(320px, 100%)', flexShrink: 1 }}
          >
            <label htmlFor="shop-search" className="t-caption" style={{ position: 'absolute', left: '-9999px' }}>
              Search creations
            </label>
            <Search size={16} aria-hidden="true" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              id="shop-search"
              type="text"
              placeholder="Keywords, maker, materials…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="nav-search"
            />
          </form>

          <div className="toolbar-spacer" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xxs)' }}>
            <label htmlFor="shop-min-price" className="t-caption">Min ₹</label>
            <input
              id="shop-min-price"
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="form-input"
              style={{ width: 110 }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xxs)' }}>
            <label htmlFor="shop-max-price" className="t-caption">Max ₹</label>
            <input
              id="shop-max-price"
              type="number"
              placeholder="∞"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="form-input"
              style={{ width: 110 }}
            />
          </div>

          <button onClick={() => { setCurrentPage(1); fetchProducts(); }} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-end' }}>
            Apply price
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xxs)' }}>
            <label htmlFor="shop-sort" className="t-caption">Sort</label>
            <select
              id="shop-sort"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="newest">Newest arrivals</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="popular">Popularity / sales</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
        </div>

        {/* Category chips — mono taxonomy pills, selected state = primary surface */}
        <div
          role="group"
          aria-label="Filter by category"
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)' }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={isSelected ? 'badge badge-selected' : 'badge badge-outline'}
                style={{ cursor: 'pointer', padding: 'var(--space-xxs) var(--space-sm)', border: isSelected ? '1px solid var(--color-primary)' : undefined }}
              >
                {cat}
              </button>
            );
          })}
          {(selectedCategory !== 'All' || searchTerm || minPrice || maxPrice) && (
            <button onClick={handleResetFilters} className="btn btn-ghost btn-sm">
              <RotateCcw size={14} aria-hidden="true" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Products state area */}
        {loading ? (
          <div className="page-loading" role="status" aria-label="Loading catalogue">
            <div className="spinner" aria-hidden="true" />
          </div>
        ) : error ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
            <div className="error-surface">
              <AlertTriangle size={16} aria-hidden="true" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>We couldn&apos;t reach the marketplace just now. Give it another go.</span>
            </div>
            <button onClick={() => { fetchProducts(); }} className="btn btn-danger btn-sm">
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><ShoppingBag size={26} aria-hidden="true" /></div>
            <h3>No creations match your filters</h3>
            <p>We couldn&apos;t find any handmade products for those filters. Try loosening your keywords or widening the price range.</p>
            <button onClick={handleResetFilters} className="btn btn-ghost">
              <span>Clear filters</span>
            </button>
          </div>
        ) : (
          <>
            <p className="t-caption" style={{ margin: '0 0 var(--space-md) 0' }}>
              {totalCount} results · page {currentPage} of {totalPages || 1}
            </p>
            <div className="grid-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="pagination" aria-label="Catalogue pages">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary btn-sm"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                  <span>Previous</span>
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      aria-current={isActive ? 'page' : undefined}
                      aria-label={`Page ${pageNum}`}
                      className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary btn-sm"
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {/* Responsive: below 560px the toolbar fields go full width and stack */}
      <style>{`
        @media (max-width: 560px) {
          .shop-toolbar > * { flex: 1 1 100%; }
          .shop-toolbar .form-input,
          .shop-toolbar .form-select { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ShopPage;
