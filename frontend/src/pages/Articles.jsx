import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getImageUrl } from '../utils/image';
import './Articles.css';

const Articles = () => {
  const navigate = useNavigate();
  const { API_URL } = useContext(AuthContext);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('Tất cả');

  const [bannerConfig, setBannerConfig] = useState(() => {
    try {
      const raw = localStorage.getItem('articlespage_settings');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return {
      eyebrow: 'CHIA SẺ KINH NGHIỆM',
      title: 'Kiến Thức Tinh Dầu',
      desc: 'Khám phá các bí quyết sử dụng tinh dầu hiệu quả cho sức khỏe, làm đẹp và không gian sống xanh sạch tươi mát.',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    };
  });

  const demoArticles = [
    { _id: 'da1', title: 'Tinh dầu oải hương có tác dụng gì? Lợi ích và cách sử dụng', image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=500&q=80', date: '15/03/2026', description: 'Tìm hiểu các tác dụng của tinh dầu oải hương đối với sức khỏe và giấc ngủ ngon sâu giấc.', badge: '100% NGUYÊN CHẤT', badgeIcon: '🌿' },
    { _id: 'da2', title: 'Tinh dầu tràm trà – "Kháng sinh tự nhiên" cho làn da', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=80', date: '10/06/2026', description: 'Tinh dầu tràm trà nổi tiếng với đặc tính kháng khuẩn vượt trội hỗ trợ trị mụn hiệu quả.', badge: 'NGUỒN GỐC RÕ RÀNG', badgeIcon: '📦' },
    { _id: 'da3', title: '7 cách sử dụng tinh dầu giúp giảm căng thẳng, ngủ ngon hơn', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80', date: '05/08/2026', description: 'Hướng dẫn các phương pháp khuếch tán, massage tinh dầu xua tan mọi mệt mỏi mệt nhọc.', badge: 'THÂN THIỆN MÔI TRƯỜNG', badgeIcon: '🌎' },
    { _id: 'da4', title: 'Tinh dầu chanh – Bí quyết làm sạch và khử mùi tự nhiên cho ngôi nhà', image: 'https://images.unsplash.com/photo-1536718497578-d01c07ae5f0d?auto=format&fit=crop&w=500&q=80', date: '20/09/2026', description: 'Tinh dầu vỏ chanh vàng tươi mát giúp thanh lọc không khí và dọn dẹp nhà cửa tối ưu.', badge: 'HÀNG NGÀN KHÁCH TIN DÙNG', badgeIcon: '⭐' }
  ];

  const badgesList = ['Tất cả', '100% NGUYÊN CHẤT', 'NGUỒN GỐC RÕ RÀNG', 'THÂN THIỆN MÔI TRƯỜNG', 'HÀNG NGÀN KHÁCH TIN DÙNG'];

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await fetch(`${API_URL}/articles`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setArticles(data);
      } catch {
        const local = localStorage.getItem('essential_local_articles');
        setArticles(local ? JSON.parse(local) : demoArticles);
      } finally {
        setLoading(false);
      }
    };

    const fetchBannerConfig = async () => {
      try {
        const res = await fetch(`${API_URL}/settings/articlespage_settings`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setBannerConfig(prev => ({
              ...prev,
              ...data
            }));
            localStorage.setItem('articlespage_settings', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.warn('Failed to fetch articles banner config:', err);
      }
    };

    loadArticles();
    fetchBannerConfig();
  }, [API_URL]);

  const getFilteredArticles = () => {
    let list = [...articles];

    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => a.title.toLowerCase().includes(q) || (a.description && a.description.toLowerCase().includes(q)));
    }

    // 2. Category Badge Filter
    if (selectedBadge !== 'Tất cả') {
      list = list.filter(a => a.badge === selectedBadge);
    }

    return list;
  };

  const filteredArticles = getFilteredArticles();

  return (
    <div className="articles-archive-page">
      <Header />

      {/* Breadcrumbs */}
      <div className="breadcrumb-section">
        <div className="container breadcrumbs">
          <Link to="/">Trang chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Kiến thức</span>
        </div>
      </div>

      {/* Title Banner */}
      <section className="articles-hero-banner" style={{ backgroundImage: `linear-gradient(rgba(126, 87, 194, 0.75), rgba(94, 53, 177, 0.9)), url("${getImageUrl(bannerConfig.image)}")` }}>
        <div className="container hero-banner-content">
          <span className="hero-eyebrow">{bannerConfig.eyebrow}</span>
          <h1 className="hero-title">{bannerConfig.title}</h1>
          <p className="hero-desc">{bannerConfig.desc}</p>
        </div>
      </section>

      {/* Filters Bar & Search */}

      {/* Articles Grid Display */}
      <section className="articles-grid-section container">
        {loading ? (
          <div className="articles-loading-container">
            <div className="spinner"></div>
            <p>Đang tải danh sách bài viết bổ ích...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="no-articles-found glass animate-fade-in">
            <span className="no-icon">📖</span>
            <h3>Không tìm thấy bài viết nào phù hợp!</h3>
            <p>Thử nhập từ khóa khác hoặc xóa bộ lọc để tìm lại nhé.</p>
            <button className="btn btn-primary" onClick={() => { setSearchQuery(''); setSelectedBadge('Tất cả'); }}>Xóa bộ lọc</button>
          </div>
        ) : (
          <div className="articles-grid-3 animate-fade-in">
            {filteredArticles.map(article => (
              <div
                className="article-card-v3 glass"
                key={article._id}
                onClick={() => navigate(`/article/${article._id}`)}
              >
                <div className="article-img-box">
                  <img src={getImageUrl(article.image)} alt={article.title} />
                  <span className="article-date-badge">{article.date || '15/03/2026'}</span>
                </div>
                <div className="article-card-body">
                  <span className="article-badge-tag">
                    <span className="icon">{article.badgeIcon || '🌿'}</span>
                    <span>{article.badge || '100% NGUYÊN CHẤT'}</span>
                  </span>
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-desc">{article.description}</p>
                  <span className="read-more-btn">Đọc tiếp →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Articles;
