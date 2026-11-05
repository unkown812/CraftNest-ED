import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Send,
  Sparkles,
  Store,
  Truck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

/* ---------------------------------------------------------------------------
   Presentation-only supporting components for the marketing/info pages
   --------------------------------------------------------------------------- */

const SectionEyebrow = ({ children, style }) => (
  <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-sm)', ...style }}>
    {children}
  </span>
);

/* Shared editorial shell for the legal/policy pages — white canvas, hairline
   separated sections, mono taxonomy captions. */
const PolicySection = ({ label, children }) => (
  <div style={{ padding: 'var(--space-md) 0', borderTop: '1px solid var(--color-hairline-soft)' }}>
    <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>
      {label}
    </span>
    <p className="t-body" style={{ lineHeight: 1.7 }}>{children}</p>
  </div>
);

export const AboutPage = () => (
  <div>
    {/* Hero opener — white canvas */}
    <section className="section-padding" style={{ paddingBottom: 'var(--space-xl)' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <SectionEyebrow>Our story & vision</SectionEyebrow>
        <h1 className="t-display-lg" style={{ marginBottom: 'var(--space-md)' }}>
          CraftNest — handmade with heart
        </h1>
        <p className="t-body-lg">
          Celebrating independent Indian makers, traditional craftsmanship, and mindful slow living.
        </p>
      </div>
    </section>

    {/* Story content — white canvas, poster column */}
    <section style={{ paddingBottom: 'var(--space-section)' }}>
      <div className="container" style={{ maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <p className="t-body">
          In a world increasingly dominated by mass assembly lines and disposable plastic, <strong>CraftNest</strong> was
          founded with a singular belief: that everyday objects should carry soul, texture, and the warmth of human hands.
        </p>

        <div>
          <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>The mission</span>
          <p className="t-body">
            We bridge the gap between skilled home-based creators—from potters in Rajasthan and fiber artists in Gujarat to
            botanical candle makers in Karnataka—and conscious patrons who appreciate authentic craftsmanship. By ensuring
            transparent commission rates (90% payout to makers), we empower artisans to sustain their livelihoods and preserve
            heritage crafts.
          </p>
        </div>

        {/* Stats — dashboard cards on white canvas */}
        <div className="grid-3" style={{ margin: 'var(--space-md) 0' }}>
          <div className="stat-card">
            <span className="stat-label">Artisan makers</span>
            <span className="stat-value">100+</span>
            <span className="stat-sub">Independent studios across India</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Maker payout</span>
            <span className="stat-value">90%</span>
            <span className="stat-sub">Transparent commission, zero hidden fees</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Delivery time</span>
            <span className="stat-value">3–7 days</span>
            <span className="stat-sub">Tracked courier, pan-India</span>
          </div>
        </div>

        <div style={{ paddingTop: 'var(--space-sm)' }}>
          <Link to="/shop" className="btn btn-primary btn-lg">
            <span>Explore Artisan Creations</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>

    {/* Values — cream color block */}
    <section className="section-padding" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="color-block block-cream">
          <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
            The CraftNest promise
          </span>
          <h2 className="t-headline" style={{ marginBottom: 'var(--space-xl)' }}>
            Every order, held to three values.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
              gap: 'var(--space-lg)',
              marginBottom: 'var(--space-lg)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <span className="t-caption">01</span>
              <p className="t-body-sm" style={{ margin: 0 }}>
                <strong>100% Authentic Handcrafted:</strong> Every item listed is created by independent hands.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <span className="t-caption">02</span>
              <p className="t-body-sm" style={{ margin: 0 }}>
                <strong>Verified Makers:</strong> All seller studios are vetted for material purity and ethical processes.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <span className="t-caption">03</span>
              <p className="t-body-sm" style={{ margin: 0 }}>
                <strong>Pan-India Safe Courier:</strong> Sustainable, protective packaging to ensure intact delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export const BecomeSellerPage = () => {
  const SELLER_PERKS = [
    {
      icon: <Store size={20} aria-hidden="true" />,
      title: 'Your Custom Storefront',
      desc: 'Showcase your unique brand identity, artisan bio, and catalogue of creations.'
    },
    {
      icon: <Sparkles size={20} aria-hidden="true" />,
      title: '90% Payout Rate',
      desc: 'Keep 90% of all gross sales with complete transparent accounting and zero hidden fees.'
    },
    {
      icon: <Truck size={20} aria-hidden="true" />,
      title: 'Pan-India Patrons',
      desc: 'Reach conscious buyers seeking personalized gifts and genuine artisanal products.'
    }
  ];

  const SELLER_STEPS = [
    {
      label: '01',
      title: 'Apply as an artisan maker',
      desc: 'Tell us about your craft, materials, and studio through the artisan registration form.'
    },
    {
      label: '02',
      title: 'Get vetted',
      desc: 'We review every studio for material purity and ethical processes before listing.'
    },
    {
      label: '03',
      title: 'Open your storefront',
      desc: 'Upload your catalogue and start selling to conscious buyers across India.'
    }
  ];

  return (
    <div>
      {/* Hero opener — white canvas */}
      <section className="section-padding" style={{ paddingBottom: 'var(--space-xl)' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <SectionEyebrow>Artisan community</SectionEyebrow>
          <h1 className="t-display-lg" style={{ marginBottom: 'var(--space-md)' }}>
            Turn your craft into a thriving business
          </h1>
          <p className="t-body-lg">
            Join over 100+ independent makers selling handmade candles, crochet, jewellery, pottery, and art across India.
          </p>
        </div>
      </section>

      {/* Pitch block — lilac color block */}
      <section style={{ paddingBottom: 'var(--space-section)' }}>
        <div className="container">
          <div className="color-block block-lilac">
            <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
              Why sell with CraftNest
            </span>
            <h2 className="t-headline" style={{ marginBottom: 'var(--space-xl)' }}>
              Your studio, our full support.
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                gap: 'var(--space-lg)',
                marginBottom: 'var(--space-xl)'
              }}
            >
              {SELLER_PERKS.map((perk) => (
                <div key={perk.title} className="card" style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-surface-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {perk.icon}
                  </div>
                  <h3 style={{ fontSize: '18px', margin: 0 }}>{perk.title}</h3>
                  <p className="t-body-sm" style={{ margin: 0 }}>{perk.desc}</p>
                </div>
              ))}
            </div>

            <div className="btn-row">
              <Link to="/register?role=seller" className="btn btn-primary btn-lg">
                <span>Apply as an Artisan Maker</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Numbered steps — white canvas */}
      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <SectionEyebrow>How it works</SectionEyebrow>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SELLER_STEPS.map((step) => (
              <div
                key={step.label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-lg) 0',
                  borderTop: '1px solid var(--color-hairline-soft)',
                  alignItems: 'baseline'
                }}
              >
                <span className="t-eyebrow">{step.label}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                  <span className="t-body w540">{step.title}</span>
                  <p className="t-body-sm" style={{ margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Thank you! Your message has been sent to CraftNest Support.', 'success');
    setName('');
    setEmail('');
    setMsg('');
  };

  return (
    <div>
      {/* Hero opener — white canvas */}
      <section className="section-padding" style={{ paddingBottom: 'var(--space-lg)' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <SectionEyebrow>Support</SectionEyebrow>
          <h1 className="t-display-lg" style={{ marginBottom: 'var(--space-md)' }}>
            Contact Artisan Support
          </h1>
          <p className="t-body-lg">
            Have questions about a maker’s product, your delivery, or custom commissions?
          </p>
        </div>
      </section>

      {/* Contact form block — lime color block (contact-form block) */}
      <section style={{ paddingBottom: 'var(--space-section)' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          {/* Quiet lilac response-time banner */}
          <div
            className="block-lilac"
            style={{
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md) var(--space-lg)',
              marginBottom: 'var(--space-lg)'
            }}
          >
            <span className="t-caption">
              Response time — we reply to every inquiry within 1–2 business days
            </span>
          </div>

          <div className="color-block block-lime">
            <span className="t-caption" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>
              Write to us
            </span>
            <h2 className="t-headline" style={{ marginBottom: 'var(--space-lg)' }}>
              Send a message
            </h2>

            <form onSubmit={handleSubmit} style={{ maxWidth: '560px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Your Message / Inquiry</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="form-textarea"
                  placeholder="How can we assist you today?"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                <Send size={18} aria-hidden="true" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export const ShippingPolicyPage = () => (
  <div>
    <section className="section-padding">
      <div className="container" style={{ maxWidth: '780px' }}>
        <SectionEyebrow>Buyer support</SectionEyebrow>
        <h1 className="t-display-lg" style={{ marginBottom: 'var(--space-lg)' }}>
          Shipping & Delivery Policy
        </h1>

        <PolicySection label="Processing time">
          <strong>Processing Time:</strong> As every item is crafted by hand, artisans require 1–4 business days to prepare, inspect, and package your order.
        </PolicySection>
        <PolicySection label="Charges">
          <strong>Shipping Charges:</strong> We provide <strong>FREE standard delivery</strong> on all orders above ₹999. For orders below ₹999, a nominal flat fee of ₹79 is applied.
        </PolicySection>
        <PolicySection label="Delivery timelines">
          <strong>Delivery Timelines:</strong> Standard tracked courier delivery takes 3–7 business days depending on your delivery PIN code across India.
        </PolicySection>
        <PolicySection label="Courier partners">
          <strong>Courier Partners:</strong> We partner with trusted courier networks including BlueDart, Delhivery, and India Post for reliable tracking.
        </PolicySection>
      </div>
    </section>
  </div>
);

export const ReturnsPolicyPage = () => (
  <div>
    <section className="section-padding">
      <div className="container" style={{ maxWidth: '780px' }}>
        <SectionEyebrow>Buyer support</SectionEyebrow>
        <h1 className="t-display-lg" style={{ marginBottom: 'var(--space-lg)' }}>
          Returns & Replacement Policy
        </h1>

        <PolicySection label="Artisan guarantee">
          <strong>Artisan Guarantee:</strong> If a handmade item arrives broken, defective, or incorrect, please notify us within <strong>7 days</strong> of delivery with a photograph to receive an immediate free replacement or refund.
        </PolicySection>
        <PolicySection label="Personalized products">
          <strong>Personalized Products:</strong> Custom items with engraved names or made-to-order dimensions cannot be returned unless damaged during transit.
        </PolicySection>
        <PolicySection label="Cancellations">
          <strong>Cancellations:</strong> Orders can be cancelled from your Buyer Dashboard at any time before the artisan has marked the order as Shipped.
        </PolicySection>
      </div>
    </section>
  </div>
);

export const PrivacyPolicyPage = () => (
  <div>
    <section className="section-padding">
      <div className="container" style={{ maxWidth: '780px' }}>
        <SectionEyebrow>Legal</SectionEyebrow>
        <h1 className="t-display-lg" style={{ marginBottom: 'var(--space-lg)' }}>
          Privacy & Data Protection Policy
        </h1>

        <PolicySection label="Data independence">
          CraftNest respects your privacy. We strictly do not sell or rent personal information to third-party advertisers.
        </PolicySection>
        <PolicySection label="Contact details">
          Your address and telephone contact details are used solely for courier delivery fulfillment and order status notifications.
        </PolicySection>
        <PolicySection label="Security">
          All passwords are encrypted with industry-standard bcrypt hashing, and credit card or sensitive payment details are processed through secure sandbox gateways without storing card numbers directly.
        </PolicySection>
      </div>
    </section>
  </div>
);
