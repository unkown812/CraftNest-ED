import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import api from '../../api/client';
import ProductCard from '../../components/common/ProductCard';

const CATEGORIES_LIST = [
  {
    name: 'Handmade Candles',
    desc: 'Soy wax, botanicals & crackling wooden wicks',
    img: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    color: '#F7EBE5'
  },
  {
    name: 'Jewellery',
    desc: 'Pressed botanicals, resin & terracotta earrings',
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    color: '#EBF1EC'
  },
  {
    name: 'Crochet and Knitting',
    desc: 'Organic cotton blankets, toys & eternal blossoms',
    img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    color: '#FDF7EB'
  },
  {
    name: 'Home Décor',
    desc: 'Ceramic mugs, macramé tapestries & wall art',
    img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    color: '#F2EDE4'
  },
  {
    name: 'Paintings and Art',
    desc: 'Original folk Madhubani & watercolor pieces',
    img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    color: '#EAF3EF'
  },
  {
    name: 'Greeting Cards',
    desc: 'Pressed marigold deckle-edge cards with envelopes',
    img: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80',
    color: '#F9EFE9'
  },
  {
    name: 'Gift Hampers',
    desc: 'Artisanal self-care crates & festival curations',
    img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    color: '#F5EAE1'
  },
  {
    name: 'Personalized Gifts',
    desc: 'Custom pyrography wood nameplates & keepsakes',
    img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    color: '#E8EFEA'
  }
];

/* Chips assigned via block-* badge surfaces — the legacy hex `color` field is
   no longer used for backgrounds. */
const CATEGORY_BADGES = [
  'badge-forest',
  'badge-mint',
  'badge-pink',
  'badge-terracotta',
  'badge-cream',
  'badge-coral',
  'badge-forest',
  'badge-mint'
];

const ARTISANS = [
  {
    name: 'Aarohi Sharma',
    shopName: 'Aarohi Botanicals & Candles',
    slug: 'aarohi-botanicals',
    city: 'Jaipur, Rajasthan',
    speciality: 'Hand-poured 100% soy candles and botanical aromatherapy',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    craft: 'Candle Maker'
  },
  {
    name: 'Kavya Patel',
    shopName: 'Kavya Knotwork & Crochet',
    slug: 'kavya-knotwork',
    city: 'Ahmedabad, Gujarat',
    speciality: 'Slow-crafted merino blankets and organic macramé wall tapestries',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=500&q=80',
    rating: 4.8,
    craft: 'Fiber Artist'
  },
  {
    name: 'Dhruv Verma',
    shopName: 'Mitti & Clay Studio',
    slug: 'mitti-and-clay',
    city: 'Pune, Maharashtra',
    speciality: 'Earth-fired stoneware pottery and pressed wildflower botanical resin',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    craft: 'Master Potter'
  }
];

const TESTIMONIALS = [
  {
    name: 'Ananya Deshmukh',
    city: 'Mumbai',
    quote: 'The handcrafted lavender candle arrived packaged like a precious gift with real dried flower petals. It fills my reading nook with such serene natural calmness.',
    product: 'Lavender & Dried Botanical Candle',
    rating: 5
  },
  {
    name: 'Vikram Sethi',
    city: 'Bengaluru',
    quote: 'I commissioned a personalized wood nameplate for our new house warming. The pyrography detail and teak grain are stunning. Supporting actual artisans feels deeply rewarding.',
    product: 'Hand-Engraved Teak Wood Plaque',
    rating: 5
  },
  {
    name: 'Meenakshi Iyer',
    city: 'Chennai',
    quote: 'CraftNest makes finding authentic handmade Indian artistry effortless. The ceramic coffee mug has such a gorgeous forest reactive glaze. Exceptional craftsmanship!',
    product: 'Hand-Thrown Ceramic Coffee Mug',
    rating: 5
  }
];

/* Presentation-only editorial content for the lime craft-systems block */
const SYSTEM_STEPS = [
  {
    label: 'Step 01',
    title: 'Sourced by hand',
    desc: 'Artisans gather soy wax, raw terracotta clay, organic cotton and reclaimed teak from trusted local suppliers.'
  },
  {
    label: 'Step 02',
    title: 'Slow-crafted in home studios',
    desc: 'Poured, knotted, thrown and painted in small batches — never on assembly lines.'
  },
  {
    label: 'Step 03',
    title: 'Inspected & shipped with care',
    desc: 'Every order is quality-checked, wrapped in sustainable protective packaging, then tracked to your door.'
  }
];

/* Presentation-only gifting notes for the navy block */
const GIFT_NOTES = [
  { tone: '', label: 'Bestseller', text: 'Engraved teak wood nameplates' },
  { tone: 'sticky-note--lilac', label: 'Made to order', text: 'Embroidered monogram keepsakes' },
  { tone: 'sticky-note--pink', label: 'New arrivals', text: 'Pressed-flower greeting sets' },
  { tone: '', label: 'Festive pick', text: 'Curated self-care gift hampers' }
];

const HERO_TRUST_POINTS = ['100% Authentic Handmade', 'Direct Artisan Support', 'Secure Pan-India Delivery'];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featRes, trendRes] = await Promise.all([
          api.get('/products?featured=true&limit=4'),
          api.get('/products?sort=popular&limit=4')
        ]);
        if (featRes.data.success) setFeaturedProducts(featRes.data.products);
        if (trendRes.data.success) setTrendingProducts(trendRes.data.products);
      } catch (err) {
        console.error('Error fetching home products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div>
      {/* Hero — white canvas, oversized display type */}
      <section style={{ padding: 'var(--space-section) 0 var(--space-xxl) 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 'var(--space-xxl)',
              alignItems: 'center'
            }}
          >
            {/* Left hero text */}
            <div>
              <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
                Handmade with heart
              </span>

              <h1 className="t-display-xl">Discover handmade treasures.</h1>

              <p className="t-body-lg" style={{ maxWidth: '540px', margin: 'var(--space-lg) 0 var(--space-xl)' }}>
                Unique creations, crafted with care by independent makers. Direct from the hands and hearts of local
                potters, weavers, candle artisans, and creators across India.
              </p>

              <div className="btn-row">
                <Link to="/shop" className="btn btn-primary btn-lg">
                  <span>Shop handmade</span>
                </Link>
                <Link to="/become-seller" className="btn btn-secondary btn-lg">
                  <span>Become a seller</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>

              {/* Artisan trust points */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-lg)',
                  marginTop: 'var(--space-xl)',
                  paddingTop: 'var(--space-lg)',
                  borderTop: '1px solid var(--color-hairline-soft)'
                }}
              >
                {HERO_TRUST_POINTS.map((point) => (
                  <div key={point} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={16} aria-hidden="true" style={{ color: 'var(--color-semantic-success)' }} />
                    <span className="t-body-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right hero image */}
            <div style={{ position: 'relative' }}>
              <div className="img-frame" style={{ borderRadius: 'var(--radius-xl)' }}>
                <img
                  src="/assets/hero-artisan.jpg"
                  alt="CraftNest artisan studio"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
              </div>

              <div
                className="card-floating"
                style={{
                  position: 'absolute',
                  bottom: 'var(--space-md)',
                  left: 'var(--space-md)',
                  padding: 'var(--space-sm) var(--space-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-xxs)'
                }}
              >
                <span className="t-body-sm w540">100+ Master Artisans</span>
                <span className="t-caption">From 22 states across India</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular categories — white canvas grid of soft tiles */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
              Curated collections
            </span>
            <h2 className="t-subhead" style={{ marginBottom: 'var(--space-sm)' }}>
              Explore popular categories
            </h2>
            <p className="t-body">
              From scented aromatherapy candles to hand-woven chunky blankets and heritage paintings, every craft tells
              a story.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
              gap: 'var(--space-lg)'
            }}
          >
            {CATEGORIES_LIST.map((cat, idx) => (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="card-tile is-clickable"
                style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}
              >
                <div style={{ height: '170px', overflow: 'hidden', borderBottom: '1px solid var(--color-hairline)' }}>
                  <img
                    src={cat.img}
                    alt={cat.name}
                    loading="lazy"
                    className="product-img-hover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div
                  style={{
                    padding: 'var(--space-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-xs)',
                    flex: 1
                  }}
                >
                  <span className={`badge ${CATEGORY_BADGES[idx % CATEGORY_BADGES.length]}`} style={{ alignSelf: 'flex-start' }}>
                    {cat.name}
                  </span>
                  <p className="t-body-sm">{cat.desc}</p>
                  <span
                    className="t-caption"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: 'auto' }}
                  >
                    Browse collection
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Craft-systems story — lime color block */}
      <section className="section-padding">
        <div className="container">
          <div className="color-block block-lime">
            <div style={{ maxWidth: '760px' }}>
              <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
                How the craft is made
              </span>
              <h2 className="t-display-lg" style={{ marginBottom: 'var(--space-md)' }}>
                Every piece starts long before it sells.
              </h2>
              <p className="t-body" style={{ marginBottom: 'var(--space-xl)' }}>
                No factories, no molds, no rush. Each craft on CraftNest follows a slow, transparent system from source
                material to your doorstep.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                  gap: 'var(--space-lg)'
                }}
              >
                {SYSTEM_STEPS.map((step) => (
                  <div key={step.label} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                    <span className="t-caption">{step.label}</span>
                    <h3 style={{ fontSize: '20px', margin: 0 }}>{step.title}</h3>
                    <p className="t-body-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured handmade products — white canvas */}
      <section className="section-padding">
        <div className="container">
          <div
            className="toolbar"
            style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-xl)' }}
          >
            <div>
              <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
                Artisan highlights
              </span>
              <h2 className="t-subhead" style={{ margin: 0 }}>
                Featured handmade products
              </h2>
            </div>
            <Link to="/shop?featured=true" className="btn btn-ghost">
              <span>View all featured</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {loading ? (
            <div className="page-loading">
              <div className="spinner" />
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="empty-state">
              <h3>Nothing featured yet</h3>
              <p>New artisan pieces land every week — browse the full shop in the meantime.</p>
              <Link to="/shop" className="btn btn-secondary">
                <span>Browse the shop</span>
              </Link>
            </div>
          ) : (
            <div className="grid-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending products — white canvas */}
      <section className="section-padding">
        <div className="container">
          <div
            className="toolbar"
            style={{ justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-xl)' }}
          >
            <div>
              <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
                Community favorites
              </span>
              <h2 className="t-subhead" style={{ margin: 0 }}>
                Trending in the nest
              </h2>
            </div>
            <Link to="/shop?sort=popular" className="btn btn-ghost">
              <span>View all trending</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {loading ? (
            <div className="page-loading">
              <div className="spinner" />
            </div>
          ) : trendingProducts.length === 0 ? (
            <div className="empty-state">
              <h3>No trending pieces yet</h3>
              <p>Once the community starts favoriting, the most-loved creations will show up here.</p>
              <Link to="/shop?sort=popular" className="btn btn-secondary">
                <span>Browse the shop</span>
              </Link>
            </div>
          ) : (
            <div className="grid-4">
              {trendingProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gifting story — navy color block with sticky-note accents */}
      <section className="section-padding">
        <div className="container">
          <div className="color-block block-navy">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: 'var(--space-xxl)',
                alignItems: 'center'
              }}
            >
              <div>
                <span
                  className="t-caption"
                  style={{ display: 'block', marginBottom: 'var(--space-sm)', color: 'var(--color-inverse-ink)' }}
                >
                  Meaningful gifting
                </span>

                <h2 className="t-display-lg" style={{ marginBottom: 'var(--space-md)' }}>
                  Handcrafted & personalized gifts for every occasion
                </h2>

                <p className="t-body" style={{ marginBottom: 'var(--space-xl)' }}>
                  Make weddings, birthdays, and anniversaries unforgettable. Many of our makers offer custom engravings,
                  embroidered monograms, and personalized calligraphy messages.
                </p>

                <div className="btn-row">
                  <Link to="/shop?category=Personalized%20Gifts" className="btn btn-secondary btn-lg">
                    <span>Explore personalized gifts</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', maxWidth: '340px', justifySelf: 'center' }}>
                {GIFT_NOTES.map((note) => (
                  <div key={note.text} className={`sticky-note${note.tone ? ` ${note.tone}` : ''}`}>
                    <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>
                      {note.label}
                    </span>
                    <span className="t-body-sm">{note.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured local artisans — white canvas */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
              Meet the makers
            </span>
            <h2 className="t-subhead" style={{ marginBottom: 'var(--space-sm)' }}>
              Featured local artisans
            </h2>
            <p className="t-body">
              Behind every product is a dedicated craftsman, independent artist, or home maker honing their slow craft.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 'var(--space-xl)'
            }}
          >
            {ARTISANS.map((artisan) => (
              <div
                key={artisan.shopName}
                className="card"
                style={{
                  padding: 'var(--space-xl) var(--space-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 'var(--space-md)'
                }}
              >
                <div
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    border: '1px solid var(--color-hairline)'
                  }}
                >
                  <img src={artisan.image} alt={artisan.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                  <span className="badge badge-neutral" style={{ alignSelf: 'center' }}>
                    {artisan.craft}
                  </span>
                  <h3 style={{ fontSize: '20px', margin: 0 }}>{artisan.shopName}</h3>
                  <span className="t-body-sm w540">{artisan.name}</span>
                  <span className="t-caption">{artisan.city}</span>
                  <p className="t-body-sm" style={{ margin: 0 }}>
                    {artisan.speciality}
                  </p>
                </div>

                <Link
                  to={`/shop?search=${encodeURIComponent(artisan.name)}`}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: 'auto' }}
                >
                  <span>Visit shop storefront</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer testimonials — white canvas */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
              Real experiences
            </span>
            <h2 className="t-subhead" style={{ marginBottom: 'var(--space-sm)' }}>
              Loved by conscious shoppers
            </h2>
            <p className="t-body">
              Read verified feedback from customers who welcomed our handcrafted pieces into their homes.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 'var(--space-lg)'
            }}
          >
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: 'var(--space-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 'var(--space-md)'
                }}
              >
                <div>
                  <div aria-hidden="true" style={{ display: 'flex', gap: 'var(--space-xxs)', color: 'var(--color-star)', marginBottom: 'var(--space-sm)' }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <p className="t-body" aria-label={`Rated ${t.rating} out of 5 stars`}>
                    "{t.quote}"
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--color-hairline-soft)', paddingTop: 'var(--space-md)' }}>
                  <div className="t-body-sm w540">{t.name}</div>
                  <span className="t-caption">Verified buyer • {t.city}</span>
                  <span className="t-caption" style={{ display: 'block', marginTop: 'var(--space-xxs)' }}>
                    Purchased: {t.product}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
