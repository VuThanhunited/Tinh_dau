import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ContactpageView.css';

export const DEFAULT_CONTACT_CONFIG = {
  banner: {
    title: 'LIÊN HỆ',
    desc: 'Chúng tôi rất mong nhận được phản hồi của tất cả khách hàng. Mọi thông tin, thắc mắc đều được Essential Oil giải đáp. Hãy để lại thông tin ngay nhé!',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
  },
  details: {
    address: 'No7, Liền Kề 20-21 Khu Đất Dịch Vụ Vạn Phúc, Phường Vạn Phúc, Quận Hà Đông, Tp Hà Nội',
    phone: '0833.356.xxx',
    email: 'cskh@webdemo.com',
    mediaEmail: 'cskh@webdemo.com',
    facebookName: 'Tinh Dầu Tràm Hương Giang',
    facebookLink: 'https://www.facebook.com/people/Tinh-D%E1%BA%A7u-Tr%C3%A0m-H%C6%B0%C6%A1ng-Giang/100067505340122/',
  }
};

const STORAGE_KEY = 'contactpage_settings';

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_CONTACT_CONFIG));
    return { ...JSON.parse(JSON.stringify(DEFAULT_CONTACT_CONFIG)), ...JSON.parse(raw) };
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_CONTACT_CONFIG));
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

const ContactpageView = () => {
  const { API_URL, user } = useContext(AuthContext);
  const [config, setConfig] = useState(loadConfig);
  const [activeSection, setActiveSection] = useState('banner'); // 'banner', 'details'
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/settings/contactpage_settings`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setConfig({
              ...DEFAULT_CONTACT_CONFIG,
              ...data,
              banner: { ...DEFAULT_CONTACT_CONFIG.banner, ...(data.banner || {}) },
              details: { ...DEFAULT_CONTACT_CONFIG.details, ...(data.details || {}) }
            });
          }
        }
      } catch (err) {
        console.warn('Failed to load Contact settings from DB:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [API_URL]);

  const update = (path, value) => {
    setConfig(prev => {
      const next = JSON.parse(JSON.stringify(prev));
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
      const response = await fetch(`${API_URL}/settings/contactpage_settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ value: config })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Không thể lưu cài đặt liên hệ');
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert(`Lưu cấu hình liên hệ thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Đặt lại cài đặt liên hệ về mặc định?')) return;
    const def = JSON.parse(JSON.stringify(DEFAULT_CONTACT_CONFIG));

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/settings/contactpage_settings`, {
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

      setConfig(def);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(def));
      setSaved(false);
      setDirty(false);
      alert('Đã đặt lại cấu hình về mặc định thành công!');
    } catch (err) {
      console.error(err);
      alert(`Đặt lại cấu hình liên hệ thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const SECTIONS = [
    { key: 'banner', label: 'Cấu hình Banner', icon: '🖼️', desc: 'Ảnh nền & tiêu đề trang Liên hệ' },
    { key: 'details', label: 'Thông tin liên hệ', icon: '📞', desc: 'Địa chỉ, Hotline, Email, Fanpage' }
  ];

  return (
    <div className="hp-view animate-fade-in">
      <div className="admin-view-header">
        <div className="hp-header-left">
          <h2 className="admin-view-title">📞 QUẢN LÝ GIAO DIỆN LIÊN HỆ</h2>
          <p className="admin-view-subtitle">Thay đổi thông tin liên hệ và hình ảnh trang hỗ trợ khách hàng.</p>
        </div>
        <div className="hp-header-actions">
          {dirty && <span className="hp-unsaved-badge">⚠ Chưa lưu</span>}
          {saved && <span className="hp-saved-badge">✓ Đã lưu</span>}
          <button className="btn btn-secondary btn-sm" onClick={handleReset} disabled={loading}>
            Đặt lại mặc định
          </button>
          <button className={`btn btn-primary btn-sm ${dirty ? 'hp-save-pulse' : ''}`} onClick={handleSave} disabled={loading}>
            Lưu & Áp dụng
          </button>
        </div>
      </div>

      <div className="hp-section-nav">
        {SECTIONS.map(s => (
          <button
            key={s.key}
            className={`hp-section-tab ${activeSection === s.key ? 'active' : ''}`}
            onClick={() => setActiveSection(s.key)}
          >
            <span className="hp-tab-icon">{s.icon}</span>
            <div className="hp-tab-text">
              <span className="hp-tab-label">{s.label}</span>
              <span className="hp-tab-desc">{s.desc}</span>
            </div>
          </button>
        ))}
      </div>

      {activeSection === 'banner' && (
        <div className="hp-section-body animate-fade-in">
          <div className="hp-slide-editor-wrap">
            <div className="hp-editor-form glass">
              <div className="form-group">
                <label className="form-label">Tiêu đề Banner</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.banner.title}
                  onChange={e => update(['banner', 'title'], e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả Banner</label>
                <textarea
                  className="form-input form-textarea"
                  value={config.banner.desc}
                  onChange={e => update(['banner', 'desc'], e.target.value)}
                  rows={4}
                />
              </div>

              <ImageInput
                label="Hình ảnh minh họa"
                value={config.banner.image}
                onChange={v => update(['banner', 'image'], v)}
              />
            </div>

            <div className="hp-slide-preview">
              <div className="hp-preview-label">Live Preview – Banner Liên hệ</div>
              <div className="hp-preview-container glass" style={{ padding: '20px', backgroundColor: '#5E35B1', color: '#FFF', borderRadius: '8px', fontFamily: 'sans-serif' }}>
                <span style={{ fontSize: '10px', opacity: 0.8 }}>Trang chủ / Liên hệ</span>
                <h1 style={{ fontSize: '20px', margin: '5px 0 10px 0', fontWeight: 'bold' }}>{config.banner.title}</h1>
                <p style={{ fontSize: '11px', margin: 0, opacity: 0.9, lineHeight: '1.4' }}>{config.banner.desc}</p>
                {config.banner.image && (
                  <img src={config.banner.image} alt="preview" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginTop: '12px' }} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'details' && (
        <div className="hp-section-body animate-fade-in">
          <div className="hp-slide-editor-wrap">
            <div className="hp-editor-form glass">
              <div className="form-group">
                <label className="form-label">Địa chỉ văn phòng</label>
                <textarea
                  className="form-input form-textarea"
                  value={config.details.address}
                  onChange={e => update(['details', 'address'], e.target.value)}
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại liên hệ</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.details.phone}
                  onChange={e => update(['details', 'phone'], e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email hỗ trợ khách hàng</label>
                <input
                  type="email"
                  className="form-input"
                  value={config.details.email}
                  onChange={e => update(['details', 'email'], e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email truyền thông / Hợp tác</label>
                <input
                  type="email"
                  className="form-input"
                  value={config.details.mediaEmail}
                  onChange={e => update(['details', 'mediaEmail'], e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tên Fanpage Facebook</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.details.facebookName}
                  onChange={e => update(['details', 'facebookName'], e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Đường dẫn link Fanpage Facebook</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.details.facebookLink}
                  onChange={e => update(['details', 'facebookLink'], e.target.value)}
                />
              </div>
            </div>

            <div className="hp-slide-preview">
              <div className="hp-preview-label">Live Preview – Chi tiết liên hệ</div>
              <div className="hp-preview-container glass" style={{ padding: '15px', backgroundColor: '#FFF', borderRadius: '8px', fontSize: '11px', color: '#4A5568', fontFamily: 'sans-serif' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>📍 Địa chỉ:</strong>
                  <div style={{ paddingLeft: '14px', marginTop: '2px' }}>{config.details.address}</div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>📞 Hotline:</strong> {config.details.phone}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>✉️ Email CSKH:</strong> {config.details.email}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>✉️ Hợp tác truyền thông:</strong> {config.details.mediaEmail}
                </div>
                <div>
                  <strong>👥 Facebook:</strong> <a href={config.details.facebookLink} target="_blank" rel="noopener noreferrer" style={{ color: '#5E35B1', textDecoration: 'none', fontWeight: 'bold' }}>{config.details.facebookName}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`hp-bottom-save-bar ${dirty ? 'visible' : ''}`}>
        <span className="hp-bottom-save-msg">⚠ Bạn có thay đổi chưa được lưu</span>
        <div className="hp-bottom-save-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => { setConfig(loadConfig()); setDirty(false); }}>Hủy thay đổi</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>Lưu & Áp dụng</button>
        </div>
      </div>
    </div>
  );
};

export default ContactpageView;
