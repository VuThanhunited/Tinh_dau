import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './HomepageView.css';

/* ─── Default Config (mirrors Home.jsx defaults) ─────────────────── */
export const DEFAULT_HOMEPAGE_CONFIG = {
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

const STORAGE_KEY = 'homepage_settings';

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_HOMEPAGE_CONFIG));
    return { ...JSON.parse(JSON.stringify(DEFAULT_HOMEPAGE_CONFIG)), ...JSON.parse(raw) };
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_HOMEPAGE_CONFIG));
  }
}

/* ─── Sub-component: Image Input with preview ─────────────────────── */
const ImageInput = ({ value, onChange, label, id }) => {
  const fileRef = useRef();
  const [imgError, setImgError] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { onChange(ev.target.result); setImgError(false); };
    reader.readAsDataURL(file);
  };

  return (
    <div className="hp-image-input-group">
      <label className="form-label">{label}</label>
      <div className="hp-image-row">
        <div className="hp-img-preview-box">
          {value && !imgError ? (
            <img src={value} alt="preview" onError={() => setImgError(true)} />
          ) : (
            <div className="hp-img-placeholder">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CBD5E0" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Chưa có ảnh</span>
            </div>
          )}
        </div>
        <div className="hp-img-controls">
          <input
            id={id}
            type="text"
            className="form-input"
            placeholder="Dán URL ảnh vào đây..."
            value={value}
            onChange={(e) => { onChange(e.target.value); setImgError(false); }}
          />
          <div className="hp-img-divider"><span>hoặc</span></div>
          <button type="button" className="btn btn-secondary btn-sm hp-upload-btn" onClick={() => fileRef.current?.click()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Tải ảnh lên
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          <p className="hp-img-hint">Hỗ trợ: JPG, PNG, WebP. URL hoặc upload từ máy.</p>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const HomepageView = () => {
  const { API_URL, user } = useContext(AuthContext);
  const [config, setConfig] = useState(loadConfig);
  const [activeSection, setActiveSection] = useState('header');
  const [activeSlide, setActiveSlide] = useState(0);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch config from MongoDB on mount
  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/settings/homepage_settings`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setConfig({
              ...DEFAULT_HOMEPAGE_CONFIG,
              ...data,
              header: { ...DEFAULT_HOMEPAGE_CONFIG.header, ...(data.header || {}) },
              footer: { ...DEFAULT_HOMEPAGE_CONFIG.footer, ...(data.footer || {}) },
              saleBanner: { ...DEFAULT_HOMEPAGE_CONFIG.saleBanner, ...(data.saleBanner || {}) }
            });
          }
        }
      } catch (err) {
        console.warn('Failed to load settings from DB, using localStorage:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [API_URL]);

  const update = (path, value) => {
    setConfig(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      // path is an array of keys
      let obj = next;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
    setDirty(true);
    setSaved(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/settings/homepage_settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ value: config })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Không thể lưu cài đặt vào cơ sở dữ liệu');
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Lỗi lưu cấu hình trang chủ:', err.message);
      alert(`Lưu cấu hình thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Đặt lại tất cả về giá trị mặc định? Hành động này không thể hoàn tác.')) return;
    const def = JSON.parse(JSON.stringify(DEFAULT_HOMEPAGE_CONFIG));

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/settings/homepage_settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ value: def })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Không thể đặt lại cài đặt');
      }

      setConfig(def);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(def));
      setSaved(false);
      setDirty(false);
      alert('Đã đặt lại cấu hình về mặc định thành công!');
    } catch (err) {
      console.error('Lỗi đặt lại cấu hình trang chủ:', err.message);
      alert(`Đặt lại cấu hình thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const SECTIONS = [
    { key: 'header', label: 'Header & Logo', icon: '📛', desc: 'Logo, Tên thương hiệu & Dòng chào mừng' },
    { key: 'hero', label: 'Hero Slider', icon: '🖼️', desc: 'Banner chính trang chủ (3 slide)' },
    { key: 'features', label: 'Chính sách', icon: '✨', desc: '4 ô đặc điểm nổi bật' },
    { key: 'saleBanner', label: 'Banner Sale', icon: '🏷️', desc: 'Banner đếm ngược khuyến mãi' },
    { key: 'footer', label: 'Footer', icon: '🦶', desc: 'Thông tin liên hệ & footer' },
  ];

  return (
    <div className="hp-view animate-fade-in">
      {/* ── Header ── */}
      <div className="admin-view-header">
        <div className="hp-header-left">
          <h2 className="admin-view-title">🎨 QUẢN LÝ GIAO DIỆN TRANG CHỦ</h2>
          <p className="admin-view-subtitle">Tuỳ chỉnh hình ảnh, nội dung các section trên trang chủ. Thay đổi có hiệu lực ngay lập tức trên frontend.</p>
        </div>
        <div className="hp-header-actions">
          {dirty && <span className="hp-unsaved-badge">⚠ Chưa lưu</span>}
          {saved && <span className="hp-saved-badge">✓ Đã lưu</span>}
          <button className="btn btn-secondary btn-sm" onClick={handleReset}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
            </svg>
            Đặt lại mặc định
          </button>
          <button className={`btn btn-primary btn-sm ${dirty ? 'hp-save-pulse' : ''}`} onClick={handleSave} id="hp-save-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
            </svg>
            Lưu & Áp dụng
          </button>
        </div>
      </div>

      {/* ── Section Nav Tabs ── */}
      <div className="hp-section-nav">
        {SECTIONS.map(s => (
          <button
            key={s.key}
            className={`hp-section-tab ${activeSection === s.key ? 'active' : ''}`}
            onClick={() => setActiveSection(s.key)}
            id={`hp-tab-${s.key}`}
          >
            <span className="hp-tab-icon">{s.icon}</span>
            <div className="hp-tab-text">
              <span className="hp-tab-label">{s.label}</span>
              <span className="hp-tab-desc">{s.desc}</span>
            </div>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════
          SECTION: HEADER & LOGO
      ══════════════════════════════════════ */}
      {activeSection === 'header' && (
        <div className="hp-section-body animate-fade-in">
          <div className="hp-section-intro">
            <h3 className="hp-section-title">Header & Logo – Cài đặt chung</h3>
            <p className="hp-section-hint">Tùy chỉnh biểu tượng logo, tên thương hiệu, khẩu hiệu, và dòng chào mừng ở top bar.</p>
          </div>

          <div className="hp-slide-editor-wrap">
            {/* Form */}
            <div className="hp-editor-form glass">
              <div className="form-group">
                <label className="form-label" htmlFor="header-welcome">Dòng chữ chào mừng (Top bar)</label>
                <input
                  id="header-welcome"
                  type="text"
                  className="form-input"
                  value={config.header?.welcomeText || ''}
                  onChange={e => update(['header', 'welcomeText'], e.target.value)}
                  placeholder="VD: Chào mừng bạn đến với mypham13.maugiaodien.com"
                />
              </div>

              <div className="hp-form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="header-title">Tên thương hiệu (Logo Title)</label>
                  <input
                    id="header-title"
                    type="text"
                    className="form-input"
                    value={config.header?.logoTitle || ''}
                    onChange={e => update(['header', 'logoTitle'], e.target.value)}
                    placeholder="VD: ESSENTIAL OIL"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="header-sub">Khẩu hiệu / Phụ đề (Logo Subtitle)</label>
                  <input
                    id="header-sub"
                    type="text"
                    className="form-input"
                    value={config.header?.logoSubtitle || ''}
                    onChange={e => update(['header', 'logoSubtitle'], e.target.value)}
                    placeholder="VD: PURE & NATURAL"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Kiểu logo hiển thị</label>
                <div className="hp-radio-group" style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                  <label className="hp-radio-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="logoType"
                      value="icon"
                      checked={config.header?.logoType === 'icon'}
                      onChange={() => update(['header', 'logoType'], 'icon')}
                    />
                    Icon hoa sen mặc định
                  </label>
                  <label className="hp-radio-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="logoType"
                      value="image"
                      checked={config.header?.logoType === 'image'}
                      onChange={() => update(['header', 'logoType'], 'image')}
                    />
                    Hình ảnh logo tùy chỉnh
                  </label>
                </div>
              </div>

              {config.header?.logoType === 'image' && (
                <ImageInput
                  label="Ảnh Logo"
                  id="header-logo-img"
                  value={config.header?.logoImg || ''}
                  onChange={v => update(['header', 'logoImg'], v)}
                />
              )}
            </div>

            {/* Preview */}
            <div className="hp-slide-preview">
              <div className="hp-preview-label">Live Preview – Header Bar</div>
              <div className="hp-header-preview-card glass" style={{ padding: '0', display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#FFF' }}>
                {/* Simulated Top Bar */}
                <div className="hp-prev-topbar" style={{ backgroundColor: '#5E35B1', color: '#FFFFFF', padding: '6px 12px', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{config.header?.welcomeText || 'Chào mừng bạn đến với cửa hàng'}</span>
                  <span>Hotline: {config.footer?.hotline || '0988.888.888'}</span>
                </div>
                {/* Simulated Main Header */}
                <div className="hp-prev-mainheader" style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #EDF2F7' }}>
                  <div className="hp-prev-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="hp-prev-logo-icon" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {config.header?.logoType === 'image' && config.header?.logoImg ? (
                        <img src={config.header.logoImg} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
                          <path d="M50 15C50 15 35 35 35 55C35 63.28 41.72 70 50 70C58.28 70 65 63.28 65 55C65 35 50 15 50 15Z" fill="#7E57C2" opacity="0.8"/>
                          <path d="M50 25C50 25 20 45 20 60C20 71.04 28.96 80 40 80C45 80 50 75 50 75C50 75 55 80 60 80C71.04 80 80 71.04 80 60C80 45 50 25 50 25Z" fill="#5E35B1" opacity="0.6"/>
                          <path d="M50 40C50 40 40 55 40 68C40 73.52 44.48 78 50 78C55.52 78 60 73.52 60 68C60 55 50 40 50 40Z" fill="#E040FB" opacity="0.9"/>
                        </svg>
                      )}
                    </div>
                    <div className="hp-prev-logo-text" style={{ display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#311B92', letterSpacing: '0.5px' }}>{config.header?.logoTitle || 'BRAND NAME'}</span>
                      <span style={{ fontSize: '9px', color: '#718096', fontWeight: '600' }}>{config.header?.logoSubtitle || 'SLOGAN'}</span>
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                    <div style={{ width: '60px', height: '15px', borderRadius: '4px', backgroundColor: '#E2E8F0' }}></div>
                    <div style={{ width: '40px', height: '15px', borderRadius: '4px', backgroundColor: '#E2E8F0' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          SECTION: HERO SLIDER
      ══════════════════════════════════════ */}
      {activeSection === 'hero' && (
        <div className="hp-section-body animate-fade-in">
          <div className="hp-section-intro">
            <h3 className="hp-section-title">Hero Slider – {config.heroSlides.length} Slides</h3>
            <p className="hp-section-hint">Mỗi slide gồm: ảnh nền, tiêu đề, tagline, nút bấm và badge sale.</p>
          </div>

          {/* Slide selector */}
          <div className="hp-slide-tabs">
            {config.heroSlides.map((_, i) => (
              <button
                key={i}
                className={`hp-slide-tab-btn ${activeSlide === i ? 'active' : ''}`}
                onClick={() => setActiveSlide(i)}
                id={`hp-slide-btn-${i}`}
              >
                Slide {i + 1}
              </button>
            ))}
          </div>

          {/* Slide editor + preview */}
          <div className="hp-slide-editor-wrap">
            {/* Form */}
            <div className="hp-editor-form glass">
              <div className="hp-form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor={`slide-tag-${activeSlide}`}>Tag nhỏ (eyebrow)</label>
                  <input
                    id={`slide-tag-${activeSlide}`}
                    type="text"
                    className="form-input"
                    value={config.heroSlides[activeSlide].tag}
                    onChange={e => update(['heroSlides', activeSlide, 'tag'], e.target.value)}
                    placeholder="VD: TINH DẦU THIÊN NHIÊN"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor={`slide-sale-${activeSlide}`}>Badge Sale (%)</label>
                  <input
                    id={`slide-sale-${activeSlide}`}
                    type="text"
                    className="form-input"
                    value={config.heroSlides[activeSlide].sale}
                    onChange={e => update(['heroSlides', activeSlide, 'sale'], e.target.value)}
                    placeholder="VD: 30%"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor={`slide-headline-${activeSlide}`}>Tiêu đề lớn (headline)</label>
                <input
                  id={`slide-headline-${activeSlide}`}
                  type="text"
                  className="form-input"
                  value={config.heroSlides[activeSlide].headline}
                  onChange={e => update(['heroSlides', activeSlide, 'headline'], e.target.value)}
                  placeholder="VD: 100% NGUYÊN CHẤT"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor={`slide-sub-${activeSlide}`}>Mô tả phụ</label>
                <textarea
                  id={`slide-sub-${activeSlide}`}
                  className="form-input form-textarea"
                  value={config.heroSlides[activeSlide].sub}
                  onChange={e => update(['heroSlides', activeSlide, 'sub'], e.target.value)}
                  placeholder="Mô tả ngắn xuất hiện dưới tiêu đề..."
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor={`slide-btn-${activeSlide}`}>Text nút bấm</label>
                <input
                  id={`slide-btn-${activeSlide}`}
                  type="text"
                  className="form-input"
                  value={config.heroSlides[activeSlide].btn}
                  onChange={e => update(['heroSlides', activeSlide, 'btn'], e.target.value)}
                  placeholder="VD: KHÁM PHÁ NGAY"
                />
              </div>

              <ImageInput
                label="Ảnh banner slide"
                id={`slide-img-${activeSlide}`}
                value={config.heroSlides[activeSlide].img}
                onChange={v => update(['heroSlides', activeSlide, 'img'], v)}
              />
            </div>

            {/* Preview */}
            <div className="hp-slide-preview">
              <div className="hp-preview-label">Preview – Slide {activeSlide + 1}</div>
              <div className="hp-hero-preview-card">
                <div
                  className="hp-hero-preview-bg"
                  style={{
                    backgroundImage: config.heroSlides[activeSlide].img
                      ? `url(${config.heroSlides[activeSlide].img})`
                      : 'none'
                  }}
                >
                  <div className="hp-hero-preview-overlay" />
                  <div className="hp-hero-preview-content">
                    <span className="hp-prev-eyebrow">{config.heroSlides[activeSlide].tag || 'Tag'}</span>
                    <h4 className="hp-prev-headline">{config.heroSlides[activeSlide].headline || 'Tiêu đề'}</h4>
                    <p className="hp-prev-sub">{config.heroSlides[activeSlide].sub || 'Mô tả phụ'}</p>
                    <span className="hp-prev-btn">{config.heroSlides[activeSlide].btn || 'Nút bấm'}</span>
                  </div>
                  <div className="hp-prev-sale-badge">
                    <span>Sale Up To</span>
                    <strong>{config.heroSlides[activeSlide].sale || '0%'}</strong>
                    <span>OFF</span>
                  </div>
                </div>
                <div className="hp-prev-dots">
                  {config.heroSlides.map((_, i) => (
                    <span key={i} className={`hp-prev-dot ${i === activeSlide ? 'active' : ''}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          SECTION: FEATURES BAR
      ══════════════════════════════════════ */}
      {activeSection === 'features' && (
        <div className="hp-section-body animate-fade-in">
          <div className="hp-section-intro">
            <h3 className="hp-section-title">Chính sách nổi bật – 4 ô</h3>
            <p className="hp-section-hint">Hiển thị ngay dưới Hero Slider. Mỗi ô gồm icon emoji, tiêu đề và mô tả ngắn.</p>
          </div>

          <div className="hp-features-grid">
            {config.features.map((feat, i) => (
              <div key={i} className="hp-feature-card glass">
                <div className="hp-feature-card-header">
                  <div className="hp-feature-icon-preview">{feat.icon}</div>
                  <span className="hp-feature-num">Ô #{i + 1}</span>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor={`feat-icon-${i}`}>Icon (emoji)</label>
                  <input
                    id={`feat-icon-${i}`}
                    type="text"
                    className="form-input hp-emoji-input"
                    value={feat.icon}
                    onChange={e => update(['features', i, 'icon'], e.target.value)}
                    placeholder="🚚"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor={`feat-title-${i}`}>Tiêu đề</label>
                  <input
                    id={`feat-title-${i}`}
                    type="text"
                    className="form-input"
                    value={feat.title}
                    onChange={e => update(['features', i, 'title'], e.target.value)}
                    placeholder="Tiêu đề chính sách..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor={`feat-sub-${i}`}>Mô tả phụ</label>
                  <input
                    id={`feat-sub-${i}`}
                    type="text"
                    className="form-input"
                    value={feat.sub}
                    onChange={e => update(['features', i, 'sub'], e.target.value)}
                    placeholder="Mô tả ngắn..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Features preview */}
          <div className="hp-features-preview-bar glass">
            <div className="hp-preview-label">Preview – Features Bar</div>
            <div className="hp-features-prev-grid">
              {config.features.map((f, i) => (
                <div key={i} className="hp-features-prev-item">
                  <span className="hp-feat-prev-icon">{f.icon}</span>
                  <div>
                    <p className="hp-feat-prev-title">{f.title || 'Tiêu đề'}</p>
                    <p className="hp-feat-prev-sub">{f.sub || 'Mô tả'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          SECTION: SALE BANNER
      ══════════════════════════════════════ */}
      {activeSection === 'saleBanner' && (
        <div className="hp-section-body animate-fade-in">
          <div className="hp-section-intro">
            <h3 className="hp-section-title">Banner Sale & Đếm Ngược</h3>
            <p className="hp-section-hint">Banner nằm giữa trang hiển thị ưu đãi và đồng hồ đếm ngược.</p>
          </div>

          <div className="hp-sale-editor-wrap">
            <div className="hp-editor-form glass">
              <div className="form-group">
                <label className="form-label" htmlFor="sale-heading">Tiêu đề chính</label>
                <input
                  id="sale-heading"
                  type="text"
                  className="form-input"
                  value={config.saleBanner.heading}
                  onChange={e => update(['saleBanner', 'heading'], e.target.value)}
                  placeholder="VD: THANH LỌC KHÔNG GIAN..."
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="sale-percent">Phần trăm ưu đãi</label>
                <input
                  id="sale-percent"
                  type="text"
                  className="form-input"
                  value={config.saleBanner.percent}
                  onChange={e => update(['saleBanner', 'percent'], e.target.value)}
                  placeholder="VD: 30%"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="sale-desc">Mô tả phụ</label>
                <textarea
                  id="sale-desc"
                  className="form-input form-textarea"
                  value={config.saleBanner.desc}
                  onChange={e => update(['saleBanner', 'desc'], e.target.value)}
                  rows={2}
                  placeholder="Mô tả thêm về chương trình khuyến mãi..."
                />
              </div>
            </div>

            {/* Sale banner preview */}
            <div className="hp-sale-preview">
              <div className="hp-preview-label">Preview – Sale Banner</div>
              <div className="hp-sale-prev-card">
                <div className="hp-sale-prev-text">
                  <h4>{config.saleBanner.heading || 'Tiêu đề banner'}</h4>
                  <p className="hp-sale-prev-pct">ƯU ĐÃI LÊN ĐẾN <strong>{config.saleBanner.percent || '0%'}</strong></p>
                  <p className="hp-sale-prev-desc">{config.saleBanner.desc || 'Mô tả...'}</p>
                </div>
                <div className="hp-sale-prev-countdown">
                  {['30', '12', '45', '00'].map((v, i) => (
                    <div key={i} className="hp-cd-block">
                      <span className="hp-cd-val">{v}</span>
                      <span className="hp-cd-label">{['Ngày', 'Giờ', 'Phút', 'Giây'][i]}</span>
                    </div>
                  ))}
                </div>
                <span className="hp-sale-prev-btn">MUA NGAY</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          SECTION: FOOTER
      ══════════════════════════════════════ */}
      {activeSection === 'footer' && (
        <div className="hp-section-body animate-fade-in">
          <div className="hp-section-intro">
            <h3 className="hp-section-title">Thông Tin Footer</h3>
            <p className="hp-section-hint">Thông tin liên hệ, mô tả công ty và copyright hiển thị ở cuối mọi trang.</p>
          </div>

          <div className="hp-footer-editor-wrap">
            <div className="hp-editor-form glass">
              <div className="hp-form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="footer-hotline">Hotline</label>
                  <input
                    id="footer-hotline"
                    type="text"
                    className="form-input"
                    value={config.footer.hotline}
                    onChange={e => update(['footer', 'hotline'], e.target.value)}
                    placeholder="0988.888.888"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="footer-email">Email</label>
                  <input
                    id="footer-email"
                    type="email"
                    className="form-input"
                    value={config.footer.email}
                    onChange={e => update(['footer', 'email'], e.target.value)}
                    placeholder="hello@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="footer-address">Địa chỉ</label>
                <input
                  id="footer-address"
                  type="text"
                  className="form-input"
                  value={config.footer.address}
                  onChange={e => update(['footer', 'address'], e.target.value)}
                  placeholder="Số 123, Đường ABC, Quận 1, TP. HCM"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="footer-desc">Mô tả công ty</label>
                <textarea
                  id="footer-desc"
                  className="form-input form-textarea"
                  value={config.footer.companyDesc}
                  onChange={e => update(['footer', 'companyDesc'], e.target.value)}
                  rows={3}
                  placeholder="Mô tả ngắn về cửa hàng..."
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="footer-copyright">Copyright</label>
                <input
                  id="footer-copyright"
                  type="text"
                  className="form-input"
                  value={config.footer.copyright}
                  onChange={e => update(['footer', 'copyright'], e.target.value)}
                  placeholder="© 2024 Tên cửa hàng. All rights reserved."
                />
              </div>
            </div>

            {/* Footer preview */}
            <div className="hp-footer-preview">
              <div className="hp-preview-label">Preview – Footer Info</div>
              <div className="hp-footer-prev-card glass">
                <h4 className="hp-footer-prev-title">VỀ CHÚNG TÔI</h4>
                <p className="hp-footer-prev-desc">{config.footer.companyDesc}</p>
                <div className="hp-footer-prev-contacts">
                  <div className="hp-footer-prev-row">
                    <span>📞</span>
                    <span>Hotline: {config.footer.hotline}</span>
                  </div>
                  <div className="hp-footer-prev-row">
                    <span>✉️</span>
                    <span>Email: {config.footer.email}</span>
                  </div>
                  <div className="hp-footer-prev-row">
                    <span>📍</span>
                    <span>{config.footer.address}</span>
                  </div>
                </div>
                <div className="hp-footer-prev-copyright">{config.footer.copyright}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Save Bar ── */}
      <div className={`hp-bottom-save-bar ${dirty ? 'visible' : ''}`}>
        <span className="hp-bottom-save-msg">⚠ Bạn có thay đổi chưa được lưu</span>
        <div className="hp-bottom-save-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => { setConfig(loadConfig()); setDirty(false); }}>Hủy thay đổi</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
            </svg>
            Lưu & Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomepageView;
