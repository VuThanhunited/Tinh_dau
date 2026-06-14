import React, { useState, useEffect, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../context/AuthContext';
import { getImageUrl } from '../utils/image';
import './ArticlespageView.css';

export const DEFAULT_ARTICLES_BANNER_CONFIG = {
  eyebrow: 'CHIA SẺ KINH NGHIỆM',
  title: 'Kiến Thức Tinh Dầu',
  desc: 'Khám phá các bí quyết sử dụng tinh dầu hiệu quả cho sức khỏe, làm đẹp và không gian sống xanh sạch tươi mát.',
  image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
};

const STORAGE_KEY = 'articlespage_settings';

function loadBannerConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_ARTICLES_BANNER_CONFIG));
    return { ...JSON.parse(JSON.stringify(DEFAULT_ARTICLES_BANNER_CONFIG)), ...JSON.parse(raw) };
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_ARTICLES_BANNER_CONFIG));
  }
}

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
            Tải ảnh lên
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        </div>
      </div>
    </div>
  );
};

const ArticlespageView = () => {
  const { API_URL, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('banner'); // 'banner', 'articles'
  
  // Banner config states
  const [bannerConfig, setBannerConfig] = useState(loadBannerConfig);
  const [bannerDirty, setBannerDirty] = useState(false);
  const [bannerSaved, setBannerSaved] = useState(false);
  
  // Articles CRUD states
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // CRUD Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit'
  const [currentArticleId, setCurrentArticleId] = useState(null);
  
  // CRUD Form fields
  const [formData, setFormData] = useState({
    title: '',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=500&q=80',
    date: '',
    description: '',
    content: '',
    badge: '100% NGUYÊN CHẤT',
    badgeIcon: '🌿'
  });

  const badgesList = [
    '100% NGUYÊN CHẤT',
    'NGUỒN GỐC RÕ RÀNG',
    'THÂN THIỆN MÔI TRƯỜNG',
    'HÀNG NGÀN KHÁCH TIN DÙNG'
  ];

  // Fetch Banner config and Articles list on mount
  useEffect(() => {
    const fetchBannerConfig = async () => {
      try {
        const res = await fetch(`${API_URL}/settings/articlespage_settings`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setBannerConfig({
              ...DEFAULT_ARTICLES_BANNER_CONFIG,
              ...data
            });
          }
        }
      } catch (err) {
        console.warn('Failed to load articles banner config:', err);
      }
    };

    fetchBannerConfig();
    fetchArticles();
  }, [API_URL]);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/articles`);
      if (!res.ok) throw new Error('Không thể tải danh sách bài viết từ server');
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerToast = (type, msg) => {
    if (type === 'success') {
      setSuccess(msg);
      setTimeout(() => setSuccess(null), 3500);
    } else {
      setError(msg);
      setTimeout(() => setError(null), 3500);
    }
  };

  // Update banner settings local state
  const updateBanner = (field, value) => {
    setBannerConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setBannerDirty(true);
    setBannerSaved(false);
  };

  // Save banner settings
  const handleSaveBanner = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/settings/articlespage_settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ value: bannerConfig })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Không thể lưu cài đặt banner');
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(bannerConfig));
      setBannerSaved(true);
      setBannerDirty(false);
      setTimeout(() => setBannerSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert(`Lưu cấu hình banner thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetBanner = async () => {
    if (!window.confirm('Đặt lại tất cả banner về mặc định?')) return;
    const def = JSON.parse(JSON.stringify(DEFAULT_ARTICLES_BANNER_CONFIG));
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/settings/articlespage_settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ value: def })
      });

      if (!response.ok) {
        throw new Error('Đặt lại thất bại');
      }

      setBannerConfig(def);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(def));
      setBannerSaved(false);
      setBannerDirty(false);
    } catch (err) {
      console.error(err);
      alert(`Đặt lại thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // CRUD handlers
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentArticleId(null);
    setFormData({
      title: '',
      image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=500&q=80',
      date: new Date().toLocaleDateString('vi-VN'),
      description: '',
      content: '',
      badge: '100% NGUYÊN CHẤT',
      badgeIcon: '🌿'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (article) => {
    setModalMode('edit');
    setCurrentArticleId(article._id);
    setFormData({
      title: article.title,
      image: article.image,
      date: article.date || '',
      description: article.description || '',
      content: article.content || '',
      badge: article.badge || '100% NGUYÊN CHẤT',
      badgeIcon: article.badgeIcon || '🌿'
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.image || !formData.description || !formData.content) {
      triggerToast('error', 'Vui lòng nhập đầy đủ các trường bắt buộc (*)');
      return;
    }

    setLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      };

      if (modalMode === 'create') {
        const response = await fetch(`${API_URL}/articles`, {
          method: 'POST',
          headers,
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Thêm bài viết thất bại');
        
        setArticles([data, ...articles]);
        triggerToast('success', `Đã thêm bài viết "${formData.title}" thành công!`);
      } else {
        const response = await fetch(`${API_URL}/articles/${currentArticleId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Cập nhật bài viết thất bại');
        
        setArticles(articles.map(a => a._id === currentArticleId ? data : a));
        triggerToast('success', `Đã cập nhật bài viết "${formData.title}" thành công!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      triggerToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (article) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${article.title}"?`)) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/articles/${article._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) throw new Error('Xóa bài viết thất bại');
      
      setArticles(articles.filter(a => a._id !== article._id));
      triggerToast('success', `Đã xóa bài viết thành công.`);
    } catch (err) {
      console.error(err);
      triggerToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hp-view animate-fade-in">
      {/* Toast Alerts */}
      {success && <div className="auth-alert success fixed-alert animate-fade-in">✅ {success}</div>}
      {error && <div className="auth-alert error fixed-alert animate-fade-in">⚠️ {error}</div>}

      <div className="admin-view-header">
        <div className="hp-header-left">
          <h2 className="admin-view-title">📚 QUẢN LÝ GIAO DIỆN KIẾN THỨC</h2>
          <p className="admin-view-subtitle">Chỉnh sửa thông tin banner trang và quản lý danh sách bài viết chuyên môn.</p>
        </div>
        
        <div className="hp-header-actions">
          <button 
            className={`btn ${activeTab === 'banner' ? 'btn-primary' : 'btn-secondary'} btn-sm`} 
            onClick={() => setActiveTab('banner')}
          >
            🖼️ Cấu hình Banner
          </button>
          <button 
            className={`btn ${activeTab === 'articles' ? 'btn-primary' : 'btn-secondary'} btn-sm`} 
            onClick={() => setActiveTab('articles')}
          >
            📝 Quản lý bài viết ({articles.length})
          </button>
        </div>
      </div>

      {activeTab === 'banner' && (
        <div className="hp-section-body animate-fade-in" style={{ marginTop: '1.5rem' }}>
          <div className="hp-slide-editor-wrap">
            <div className="hp-editor-form glass">
              <div className="form-group">
                <label className="form-label">Tiêu đề nhỏ (Eyebrow)</label>
                <input
                  type="text"
                  className="form-input"
                  value={bannerConfig.eyebrow}
                  onChange={e => updateBanner('eyebrow', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tiêu đề lớn</label>
                <input
                  type="text"
                  className="form-input"
                  value={bannerConfig.title}
                  onChange={e => updateBanner('title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả giới thiệu</label>
                <textarea
                  className="form-input form-textarea"
                  value={bannerConfig.desc}
                  onChange={e => updateBanner('desc', e.target.value)}
                  rows={3}
                />
              </div>

              <ImageInput
                label="Ảnh nền Banner"
                value={bannerConfig.image}
                onChange={v => updateBanner('image', v)}
              />

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={handleResetBanner}>Đặt lại mặc định</button>
                <button className="btn btn-primary btn-sm" onClick={handleSaveBanner} disabled={!bannerDirty}>Lưu cấu hình</button>
              </div>
            </div>

            <div className="hp-slide-preview">
              <div className="hp-preview-label">Live Preview – Banner Kiến thức</div>
              <div 
                style={{ 
                  backgroundImage: `linear-gradient(rgba(126, 87, 194, 0.75), rgba(94, 53, 177, 0.9)), url(${bannerConfig.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: '40px 20px',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontFamily: 'sans-serif'
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.9 }}>{bannerConfig.eyebrow}</span>
                <h1 style={{ fontSize: '22px', margin: '5px 0 10px 0', fontWeight: 'bold' }}>{bannerConfig.title}</h1>
                <p style={{ fontSize: '11px', margin: 0, opacity: 0.8, lineHeight: '1.5' }}>{bannerConfig.desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'articles' && (
        <div className="hp-section-body animate-fade-in" style={{ marginTop: '1.5rem' }}>
          <div className="admin-view-header-row" style={{ padding: '0 0 15px 0' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#2D3748', fontWeight: 'bold' }}>DANH SÁCH BÀI VIẾT</h3>
            <button className="btn btn-primary" onClick={handleOpenCreateModal}>
              ➕ Thêm bài viết mới
            </button>
          </div>

          <div className="admin-table-container glass">
            {loading ? (
              <div className="admin-view-loading" style={{ minHeight: '150px' }}>
                <div className="spinner"></div>
                <p>Đang tải danh sách bài viết...</p>
              </div>
            ) : articles.length === 0 ? (
              <p className="no-data-text">Chưa có bài viết nào được đăng tải.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tiêu đề bài viết</th>
                    <th>Ngày viết</th>
                    <th>Nhãn (Badge)</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(art => (
                    <tr key={art._id}>
                      <td>
                        <img src={getImageUrl(art.image)} alt={art.title} className="product-thumb-img" />
                      </td>
                      <td>
                        <div className="product-table-name-desc">
                          <strong className="product-table-name">{art.title}</strong>
                          <span className="product-table-desc">{art.description}</span>
                        </div>
                      </td>
                      <td>{art.date || '15/03/2026'}</td>
                      <td>
                        <span className="p-badge featured" style={{ backgroundColor: '#EDF2F7', color: '#4A5568', padding: '4px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span>{art.badgeIcon || '🌿'}</span>
                          <span>{art.badge || '100% NGUYÊN CHẤT'}</span>
                        </span>
                      </td>
                      <td>
                        <div className="product-table-actions">
                          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEditModal(art)}>✏️ Sửa</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteArticle(art)}>🗑️ Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen && createPortal(
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {modalMode === 'create' ? '➕ THÊM BÀI VIẾT MỚI' : '✏️ CẬP NHẬT BÀI VIẾT'}
              </h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="a-title">Tiêu đề bài viết *</label>
                  <input
                    type="text"
                    id="a-title"
                    name="title"
                    className="form-input"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="a-date">Ngày đăng bài</label>
                    <input
                      type="text"
                      id="a-date"
                      name="date"
                      className="form-input"
                      value={formData.date}
                      onChange={handleInputChange}
                      placeholder="VD: 15/03/2026"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="a-badge">Nhãn hiển thị</label>
                    <select
                      id="a-badge"
                      name="badge"
                      className="form-select"
                      value={formData.badge}
                      onChange={handleInputChange}
                    >
                      {badgesList.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="a-icon">Icon nhãn (Emoji)</label>
                    <input
                      type="text"
                      id="a-icon"
                      name="badgeIcon"
                      className="form-input"
                      value={formData.badgeIcon}
                      onChange={handleInputChange}
                      placeholder="VD: 🌿"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="a-img">Đường dẫn ảnh bài viết *</label>
                    <input
                      type="text"
                      id="a-img"
                      name="image"
                      className="form-input"
                      value={formData.image}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="a-desc">Mô tả ngắn (Summary) *</label>
                  <textarea
                    id="a-desc"
                    name="description"
                    className="form-textarea"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={2}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="a-content">Nội dung chi tiết *</label>
                  <textarea
                    id="a-content"
                    name="content"
                    className="form-textarea"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={6}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary">Lưu bài viết</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ArticlespageView;
