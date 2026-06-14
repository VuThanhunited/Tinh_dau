import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getImageUrl } from '../utils/image';
import './Home.css';

/* ─── Countdown Hook ─────────────────────────────────────────────── */
function useCountdown(targetDate) {
  const calc = () => {
    const diff = new Date(targetDate) - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ─── Default Homepage Config ────────────────────────────────────── */
const DEFAULT_HOMEPAGE_CONFIG = {
  header: {
    welcomeText: 'Chào mừng bạn đến với mypham13.maugiaodien.com',
    logoTitle: 'ESSENTIAL OIL',
    logoSubtitle: 'PURE & NATURAL',
    logoType: 'icon', // 'icon' or 'image'
    logoImg: '',
  },
  heroSlides: [
    {
      tag: 'TINH DẦU THIÊN NHIÊN',
      headline: '100% NGUYÊN CHẤT',
      sub: 'Thanh lọc tinh thần – Cân bằng cảm xúc – Nâng niu sức khỏe',
      btn: 'KHÁM PHÁ NGAY',
      sale: '30%',
      img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80',
    },
    {
      tag: 'CHẤT LƯỢNG CAO CẤP',
      headline: 'NHẬP KHẨU NGUYÊN GỐC',
      sub: 'Hương thơm tinh tế từ thiên nhiên – An toàn cho cả gia đình',
      btn: 'MUA NGAY',
      sale: '20%',
      img: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=900&q=80',
    },
    {
      tag: 'BỘ SƯU TẬP MỚI',
      headline: 'THƯ GIÃN & SỨC KHỎE',
      sub: 'Liệu pháp hương thơm giúp xua tan căng thẳng mệt mỏi',
      btn: 'XEM THÊM',
      sale: '25%',
      img: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=900&q=80',
    },
  ],
  features: [
    { icon: '🚚', title: 'Miễn phí vận chuyển', sub: 'Cho đơn hàng từ 500k' },
    { icon: '🛡️', title: 'Cam kết chất lượng', sub: '100% tinh dầu nguyên chất' },
    { icon: '🔄', title: 'Đổi trả hàng trong 7 ngày', sub: 'Không phát hiện hàng lỗi' },
    { icon: '📞', title: 'Tư vấn tận tâm', sub: 'Hotline: 0988.888.888' },
  ],
  saleBanner: {
    heading: 'THANH LỌC KHÔNG GIAN – AN YÊN TINH THẦN',
    percent: '30%',
    desc: 'Cho các sản phẩm tinh dầu & máy khuếch tán với mỗi trường',
  },
  footer: {
    companyDesc: 'Mypham13.maugiaodien.com chuyên cung cấp các loại tinh dầu thiên nhiên nguyên chất, an toàn cho sức khỏe và thân thiện với môi trường.',
    hotline: '0988.888.888',
    email: 'hello@maugiaodien.com',
    address: 'Số 123, Đường ABC, Quận 1, TP. Hồ Chí Minh',
    copyright: '© 2023 mypham13.maugiaodien.com. All rights reserved.',
  },
};

/* ─── Main Component ─────────────────────────────────────────────── */
const Home = () => {
  const { API_URL } = useContext(AuthContext);
  const { addToCart, toggleWishlist, wishlistItems, cartItems, removeFromCart, updateQuantity, getCartTotal, formatVND } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeProductTab, setActiveProductTab] = useState('featured');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [heroCurrent, setHeroCurrent] = useState(0);
  const heroTimer = useRef(null);

  const [homepageConfig, setHomepageConfig] = useState(() => {
    try {
      const raw = localStorage.getItem('homepage_settings');
      if (!raw) return DEFAULT_HOMEPAGE_CONFIG;
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_HOMEPAGE_CONFIG,
        ...parsed,
        header: { ...DEFAULT_HOMEPAGE_CONFIG.header, ...(parsed.header || {}) },
        footer: { ...DEFAULT_HOMEPAGE_CONFIG.footer, ...(parsed.footer || {}) },
        saleBanner: { ...DEFAULT_HOMEPAGE_CONFIG.saleBanner, ...(parsed.saleBanner || {}) }
      };
    } catch {
      return DEFAULT_HOMEPAGE_CONFIG;
    }
  });

  // Fetch settings from MongoDB API on mount
  useEffect(() => {
    const fetchHomepageConfig = async () => {
      try {
        const res = await fetch(`${API_URL}/settings/homepage_settings`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setHomepageConfig({
              ...DEFAULT_HOMEPAGE_CONFIG,
              ...data,
              header: { ...DEFAULT_HOMEPAGE_CONFIG.header, ...(data.header || {}) },
              footer: { ...DEFAULT_HOMEPAGE_CONFIG.footer, ...(data.footer || {}) },
              saleBanner: { ...DEFAULT_HOMEPAGE_CONFIG.saleBanner, ...(data.saleBanner || {}) }
            });
            localStorage.setItem('homepage_settings', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.warn('Failed to fetch homepage settings from database, using local fallback:', err);
      }
    };
    fetchHomepageConfig();
  }, [API_URL]);

  useEffect(() => {
    const handleStorage = () => {
      try {
        const raw = localStorage.getItem('homepage_settings');
        if (raw) {
          const parsed = JSON.parse(raw);
          setHomepageConfig({
            ...DEFAULT_HOMEPAGE_CONFIG,
            ...parsed,
            header: { ...DEFAULT_HOMEPAGE_CONFIG.header, ...(parsed.header || {}) },
            footer: { ...DEFAULT_HOMEPAGE_CONFIG.footer, ...(parsed.footer || {}) },
            saleBanner: { ...DEFAULT_HOMEPAGE_CONFIG.saleBanner, ...(parsed.saleBanner || {}) }
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setTimeout(() => {
        const storeEl = document.getElementById('store-section');
        if (storeEl) {
          storeEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [categoryParam]);

  // Countdown to 30 days from now
  const saleEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const countdown = useCountdown(saleEnd);

  /* ── Sidebar categories ──────────────────────────────── */
  const sidebarCategories = [
    { label: 'Tinh dầu đơn', icon: '🌿' },
    { label: 'Tinh dầu blend', icon: '💧' },
    { label: 'Tinh dầu cho sức khỏe', icon: '❤️' },
    { label: 'Tinh dầu cho làm đẹp', icon: '✨' },
    { label: 'Tinh dầu cho không gian', icon: '🏠' },
    { label: 'Phụ kiện khuếch tán', icon: '🔮' },
    { label: 'Bộ quà tặng', icon: '🎁' },
  ];

  /* ── Hero Slides ─────────────────────────────────────── */
  const heroSlides = homepageConfig.heroSlides || DEFAULT_HOMEPAGE_CONFIG.heroSlides;

  useEffect(() => {
    if (!heroSlides || heroSlides.length === 0) return;
    heroTimer.current = setInterval(() => setHeroCurrent(p => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(heroTimer.current);
  }, [heroSlides.length]);

  const goSlide = (dir) => {
    if (!heroSlides || heroSlides.length === 0) return;
    clearInterval(heroTimer.current);
    setHeroCurrent(p => (p + dir + heroSlides.length) % heroSlides.length);
    heroTimer.current = setInterval(() => setHeroCurrent(p => (p + 1) % heroSlides.length), 5000);
  };

  /* ── Demo Data ───────────────────────────────────────── */
  const demoProducts = [
    { _id: 'dp1', name: 'Tinh dầu Oải Hương (Lavender)', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80', category: 'Tinh dầu đơn', originalPrice: 275000, salePrice: 220000, stock: 45, description: 'Tinh dầu oải hương Lavender nguyên chất 100% nhập khẩu từ Pháp.', rating: 5, reviewsCount: 18, isNew: false, isBestSeller: true },
    { _id: 'dp2', name: 'Tinh dầu Tràm Trà (Tea Tree)', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80', category: 'Tinh dầu đơn', originalPrice: 225000, salePrice: 180000, stock: 35, description: 'Tinh dầu tràm trà nguyên chất kháng khuẩn cực mạnh.', rating: 4.8, reviewsCount: 12, isNew: true, isBestSeller: true },
    { _id: 'dp3', name: 'Tinh dầu Bạc Hà (Peppermint)', image: 'https://images.unsplash.com/photo-1595981267035-7b04ec82237e?auto=format&fit=crop&w=500&q=80', category: 'Tinh dầu đơn', originalPrice: 200000, salePrice: 160000, stock: 60, description: 'Tinh dầu bạc hà mang lại cảm giác mát lạnh sảng khoái.', rating: 5, reviewsCount: 22, isNew: false, isBestSeller: true },
    { _id: 'dp4', name: 'Tinh dầu Chanh (Lemon)', image: 'https://images.unsplash.com/photo-1536718497578-d01c07ae5f0d?auto=format&fit=crop&w=500&q=80', category: 'Tinh dầu đơn', originalPrice: 190000, salePrice: 150000, stock: 25, description: 'Tinh dầu vỏ chanh vàng nguyên chất, ép lạnh lưu giữ hương thơm.', rating: 4.7, reviewsCount: 9, isNew: true, isBestSeller: false },
    { _id: 'dp5', name: 'Tinh dầu Khuynh Diệp (Eucalyptus)', image: 'https://images.unsplash.com/photo-1608571424295-d14c274b126b?auto=format&fit=crop&w=500&q=80', category: 'Tinh dầu đơn', originalPrice: 200000, salePrice: 160000, stock: 50, description: 'Tinh dầu khuynh diệp bảo vệ sức khỏe gia đình.', rating: 4.9, reviewsCount: 15, isNew: false, isBestSeller: true },
    { _id: 'dp6', name: 'Tinh dầu Sả Chanh (Lemongrass)', image: 'https://images.unsplash.com/photo-1595981267035-7b04ec82237e?auto=format&fit=crop&w=500&q=80', category: 'Tinh dầu cho sức khỏe', originalPrice: 150000, salePrice: 120000, stock: 80, description: 'Tinh dầu sả chanh giúp giảm stress và khử mùi.', rating: 4.9, reviewsCount: 31, isNew: true, isBestSeller: true },
    { _id: 'dp7', name: 'Máy khuếch tán tinh dầu Premium', image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=500&q=80', category: 'Phụ kiện khuếch tán', originalPrice: 650000, salePrice: 450000, stock: 15, description: 'Máy phun sương khuếch tán tinh dầu cao cấp sóng siêu âm.', rating: 5, reviewsCount: 6, isNew: false, isBestSeller: false },
  ];

  const demoArticles = [
    { _id: 'da1', title: 'Tinh dầu oải hương có tác dụng gì? Lợi ích và cách sử dụng', image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=500&q=80', date: '15/03/2026', description: 'Tìm hiểu các tác dụng của tinh dầu oải hương đối với sức khỏe và giấc ngủ.', badge: '100% NGUYÊN CHẤT', badgeIcon: '🌿' },
    { _id: 'da2', title: 'Tinh dầu tràm trà – "Kháng sinh tự nhiên" cho sức khỏe và làn da', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=80', date: '10/06/2026', description: 'Tinh dầu tràm trà nổi tiếng với đặc tính kháng khuẩn và trị mụn.', badge: 'NGUỒN GỐC RÕ RÀNG', badgeIcon: '📦' },
    { _id: 'da3', title: '7 cách sử dụng tinh dầu giúp giảm căng thẳng, ngủ ngon hơn', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80', date: '05/08/2026', description: 'Hướng dẫn các phương pháp khuếch tán, massage tinh dầu xua tan mệt mỏi.', badge: 'THÂN THIỆN MÔI TRƯỜNG', badgeIcon: '🌎' },
    { _id: 'da4', title: 'Tinh dầu chanh – Bí quyết làm sạch và khử mùi tự nhiên', image: 'https://images.unsplash.com/photo-1536718497578-d01c07ae5f0d?auto=format&fit=crop&w=500&q=80', date: '20/09/2026', description: 'Tinh dầu chanh với mùi hương tươi mát giúp làm sạch và khử mùi hiệu quả.', badge: 'HÀNG NGÀN KHÁCH TIN DÙNG', badgeIcon: '⭐' },
  ];

  /* ── Fetch ───────────────────────────────────────────── */
  useEffect(() => {
    const load = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProducts(data);
        localStorage.setItem('essential_local_products', JSON.stringify(data));
      } catch {
        const local = localStorage.getItem('essential_local_products');
        setProducts(local ? JSON.parse(local) : demoProducts);
        if (!localStorage.getItem('essential_local_products')) localStorage.setItem('essential_local_products', JSON.stringify(demoProducts));
      } finally { setLoadingProducts(false); }
    };
    load();
  }, [API_URL]);

  useEffect(() => {
    const load = async () => {
      setLoadingArticles(true);
      try {
        const res = await fetch(`${API_URL}/articles`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setArticles(data);
        localStorage.setItem('essential_local_articles', JSON.stringify(data));
      } catch {
        const local = localStorage.getItem('essential_local_articles');
        setArticles(local ? JSON.parse(local) : demoArticles);
        if (!localStorage.getItem('essential_local_articles')) localStorage.setItem('essential_local_articles', JSON.stringify(demoArticles));
      } finally { setLoadingArticles(false); }
    };
    load();
  }, [API_URL]);

  /* ── Filtered Products ───────────────────────────────── */
  const getTabProducts = () => {
    let list = [...products];
    if (searchParamQuery) list = list.filter(p => p.name.toLowerCase().includes(searchParamQuery.toLowerCase()) || (p.description && p.description.toLowerCase().includes(searchParamQuery.toLowerCase())));
    if (selectedCategory) return list.filter(p => p.category === selectedCategory);
    if (activeProductTab === 'new') return list.filter(p => p.isNew).slice(0, 5);
    if (activeProductTab === 'bestseller') return list.filter(p => p.isBestSeller).slice(0, 5);
    return list.slice(0, 5); // featured = first 5
  };
  const tabProducts = getTabProducts();

  /* ── Helpers ─────────────────────────────────────────── */
  const discountOf = (p) => Math.round(((p.originalPrice - p.salePrice) / p.originalPrice) * 100);

  /* ─────────────────────────────────────────────────────── RENDER ── */
  return (
    <div className="home-page">
      <Header />

      {/* ── Hero Slider ──────────────────────── */}
      <section className="hero-slider">
        <div className="hero-slides-track" style={{ transform: `translateX(-${heroCurrent * 100}%)` }}>
          {heroSlides.map((s, i) => (
            <div className="hero-slide" key={i}>
              {/* Left purple gradient background */}
              <div className="hero-bg-left" />
              {/* Right side: product image + lavender bg */}
              <div className="hero-bg-right">
                <img src={getImageUrl(s.img)} alt="" className="hero-bg-right-img" />
                <div className="hero-bg-right-overlay" />
              </div>

              <div className="container hero-slide-content">
                <div className="hero-text-block animate-fade-in">
                  <p className="hero-eyebrow">{s.tag}</p>
                  <h1 className="hero-headline">{s.headline}</h1>
                  <p className="hero-sub">{s.sub}</p>
                  <a href="#store-section" className="btn btn-hero">{s.btn}</a>
                </div>
                <div className="hero-product-display">
                  <img src={getImageUrl(s.img)} alt="Product" className="hero-product-img" />
                </div>
                <div className="hero-sale-badge">
                  <span className="sale-badge-top">Sale Up To</span>
                  <strong className="sale-badge-pct">{s.sale}</strong>
                  <span className="sale-badge-off">OFF</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="hero-arrow hero-arrow-prev" onClick={() => goSlide(-1)}>&#10094;</button>
        <button className="hero-arrow hero-arrow-next" onClick={() => goSlide(1)}>&#10095;</button>
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <button key={i} className={`hero-dot ${heroCurrent === i ? 'active' : ''}`} onClick={() => { clearInterval(heroTimer.current); setHeroCurrent(i); }} />
          ))}
        </div>
      </section>

      {/* ── Features Bar ────────────────── */}
      <section className="features-bar">
        <div className="container features-bar-grid">
          {homepageConfig.features.map((feat, i) => (
            <div className="feature-item" key={i}>
              <div className="feature-svg-icon" style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {feat.icon}
              </div>
              <div>
                <p className="feature-title">{feat.title}</p>
                <p className="feature-sub">{feat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Products Section ─────────────────────────────── */}
      <section id="store-section" className="products-section">
        <div className="container products-layout">

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-header">DANH MỤC TINH DẦU</div>
            <ul className="sidebar-list">
              {sidebarCategories.map((c, i) => (
                <li 
                  key={i} 
                  className={`sidebar-item ${selectedCategory === c.label ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(c.label);
                    if (searchParamQuery) {
                      setSearchParams({});
                    }
                    setTimeout(() => {
                      const storeEl = document.getElementById('store-section');
                      if (storeEl) storeEl.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="sidebar-icon">{c.icon}</span>
                  <span>{c.label}</span>
                  <span className="sidebar-arrow">&#62;</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main products area */}
          <div className="products-main">
            {selectedCategory ? (
              <div className="product-category-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h2 className="category-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2D3748' }}>
                  Danh mục: <span className="purple-text" style={{ color: 'var(--primary-dark)' }}>{selectedCategory}</span>
                </h2>
                <button 
                  className="clear-category-filter-btn" 
                  onClick={() => setSelectedCategory('')}
                  style={{ background: 'rgba(49, 27, 146, 0.1)', color: 'var(--primary-dark)', border: 'none', padding: '0.5rem 1rem', borderRadius: '30px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Tất cả sản phẩm ✕
                </button>
              </div>
            ) : (
              <div className="products-tabs-header">
                <div className="product-tabs">
                  {[
                    { key: 'featured', label: 'SẢN PHẨM NỔI BẬT' },
                    { key: 'new', label: 'SẢN PHẨM MỚI' },
                    { key: 'bestseller', label: 'SẢN PHẨM BÁN CHẠY' },
                  ].map(t => (
                    <button key={t.key} className={`product-tab-btn ${activeProductTab === t.key ? 'active' : ''}`} onClick={() => setActiveProductTab(t.key)}>
                      {t.label}
                    </button>
                  ))}
                </div>
                <a href="#store-section" className="view-all-link">Xem tất cả &gt;</a>
              </div>
            )}

            {/* Search alert */}
            {searchParamQuery && (
              <div className="search-alert glass">
                <span>Kết quả tìm kiếm: <strong>"{searchParamQuery}"</strong></span>
                <Link to="/" className="clear-search-btn">Hủy ✕</Link>
              </div>
            )}

            {loadingProducts ? (
              <div className="loading-spinner-wrapper"><div className="spinner" /></div>
            ) : tabProducts.length === 0 ? (
              <div className="no-products-found glass">
                <span className="no-icon">🍃</span>
                <h3>Không tìm thấy sản phẩm!</h3>
              </div>
            ) : (
              <div className="products-grid-5">
                {tabProducts.map(product => {
                  const inWishlist = wishlistItems.some(w => w._id === product._id);
                  const disc = discountOf(product);
                  return (
                    <div className="product-card-v2" key={product._id}>
                      {disc > 0 && <span className="badge badge-sale">-{disc}%</span>}
                      <div className="product-img-box">
                        <Link to={`/product/${product._id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                          <img src={getImageUrl(product.image)} alt={product.name} />
                        </Link>
                        <div className="product-card-actions">
                          <button className={`action-btn wishlist-btn ${inWishlist ? 'active' : ''}`} onClick={() => toggleWishlist(product)} title="Yêu thích">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill={inWishlist ? '#E53E3E' : 'none'} stroke={inWishlist ? '#E53E3E' : 'currentColor'} strokeWidth="2.5">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          </button>
                          <button className="action-btn cart-btn" onClick={() => { addToCart(product); setShowCartDrawer(true); }} title="Thêm giỏ hàng">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="product-card-v2-info">
                        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <h3 className="product-v2-name">{product.name}</h3>
                        </Link>
                        <div className="product-v2-price">
                          <span className="sale-price">{formatVND(product.salePrice)}</span>
                          {product.originalPrice > product.salePrice && <span className="original-price">{formatVND(product.originalPrice)}</span>}
                        </div>
                        <div className="product-v2-footer">
                          <button className="btn-v2-cart" onClick={() => { addToCart(product); setShowCartDrawer(true); }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                          </button>
                          <button className={`btn-v2-wish ${inWishlist ? 'active' : ''}`} onClick={() => toggleWishlist(product)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={inWishlist ? '#E53E3E' : 'none'} stroke={inWishlist ? '#E53E3E' : 'currentColor'} strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Countdown Sale Banner ────────────────────────── */}
      <section className="sale-countdown-banner">
        <div className="container sale-countdown-inner">
          <div className="sale-countdown-text">
            <h2>{homepageConfig.saleBanner.heading}</h2>
            <p className="sale-coupon">ƯU ĐÃI LÊN ĐẾN <strong>{homepageConfig.saleBanner.percent}</strong></p>
            <p>{homepageConfig.saleBanner.desc}</p>
          </div>
          <div className="countdown-blocks">
            {[
              { val: countdown.days, label: 'Ngày' },
              { val: countdown.hours, label: 'Giờ' },
              { val: countdown.minutes, label: 'Phút' },
              { val: countdown.seconds, label: 'Giây' },
            ].map((b, i) => (
              <div className="countdown-block" key={i}>
                <span className="countdown-val">{String(b.val).padStart(2, '0')}</span>
                <span className="countdown-label">{b.label}</span>
              </div>
            ))}
          </div>
          <a href="#store-section" className="btn btn-countdown">MUA NGAY</a>
        </div>
      </section>

      {/* ── Articles Section ─────────────────────────────── */}
      <section id="articles-section" className="articles-section">
        <div className="container">
          <div className="section-title-row">
            <h2 className="section-title">Bài Viết Nổi Bật</h2>
            <a href="#articles-section" className="view-all-link">Xem tất cả &gt;</a>
          </div>

          {loadingArticles ? (
            <div className="loading-spinner-wrapper"><div className="spinner" /></div>
          ) : (
            <div className="articles-grid-4">
              {(articles.length > 0 ? articles : demoArticles).slice(0, 4).map(article => (
                <Link to={`/article/${article._id}`} className="article-card-v2-link" key={article._id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <article className="article-card-v2">
                    <div className="article-img-box">
                      <img src={getImageUrl(article.image)} alt={article.title} />
                      <span className="article-date-badge">{article.date || '15/03/2026'}</span>
                    </div>
                    <div className="article-card-v2-body">
                      <h3 className="article-v2-title">{article.title}</h3>
                      <div className="article-v2-badge">
                        <span className="article-badge-icon">{article.badgeIcon || '🌿'}</span>
                        <span>{article.badge || '100% NGUYÊN CHẤT'}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Cart Drawer ──────────────────────────────────── */}
      {showCartDrawer && (
        <div className="cart-drawer-overlay animate-fade-in">
          <div className="cart-drawer glass animate-fade-in">
            <div className="cart-drawer-header">
              <h3>Giỏ hàng ({cartItems.reduce((a, i) => a + i.quantity, 0)})</h3>
              <button className="close-drawer-btn" onClick={() => setShowCartDrawer(false)}>✕</button>
            </div>
            <div className="cart-drawer-body">
              {cartItems.length === 0 ? (
                <div className="empty-cart-message">
                  <span>🛒</span>
                  <p>Giỏ hàng trống!</p>
                  <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowCartDrawer(false)}>Tiếp tục mua</button>
                </div>
              ) : (
                <div className="cart-drawer-items">
                  {cartItems.map(item => (
                    <div className="cart-drawer-item glass" key={item._id}>
                      <img src={getImageUrl(item.image)} alt={item.name} />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <span className="item-price">{formatVND(item.salePrice)}</span>
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                        </div>
                      </div>
                      <button className="remove-item-btn" onClick={() => removeFromCart(item._id)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-summary">
                  <span>Tổng thanh toán:</span>
                  <span className="total-amount">{formatVND(getCartTotal())}</span>
                </div>
                <button className="btn btn-primary checkout-btn" onClick={() => alert('Cảm ơn bạn đã mua hàng!')}>
                  🚀 Đặt hàng ngay
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Footer ───────────────────────────────────────── */}
      <Footer />
    </div>
  );
};

export default Home;
