import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './AboutpageView.css';

export const DEFAULT_ABOUT_CONFIG = {
  brandStory: {
    title: 'Giới thiệu',
    heading: 'Câu chuyện thương hiệu Essential Oil',
    paragraph1: 'Những năm gần đây liệu pháp hương thơm (Aromatherapy) sử dụng tinh dầu thiên nhiên phát triển vô cùng mạnh mẽ trên thế giới. Tuy nhiên, tại thị trường Việt Nam, các loại tinh dầu trôi nổi, kém chất lượng và pha chế hóa chất nhân tạo vẫn tràn lan, gây ảnh hưởng trực tiếp đến sức khỏe của người tiêu dùng.',
    paragraph2: 'Do nằm trong vùng khí hậu nhiệt đới ẩm gió mùa nên Việt Nam được mẹ thiên nhiên ưu ái ban tặng nguồn tài nguyên cây tinh dầu vô cùng phong phú và có dược tính sinh học hàng đầu (như sả chanh, bạc hà, tràm gió, quế...). Tuy nhiên, nguồn nguyên liệu quý giá này trước đây chủ yếu được xuất thô với giá trị thấp, trong khi người nông dân Việt Nam luôn gặp khó khăn trong việc tìm đầu ra ổn định cho nông sản của mình.',
    paragraph3: 'Chính vì lý do đó, chúng tôi luôn đau đáu mong muốn tạo ra một thương hiệu tinh dầu nguyên chất sử dụng nguồn thảo mộc sạch tại Việt Nam kết hợp các loài hoa cỏ nhập ngoại danh tiếng. Essential Oil ra đời với sứ mệnh đảm bảo nguồn tinh dầu nguyên chất 100% tinh khiết đến tay người tiêu dùng, đồng thời hỗ trợ bao tiêu sản phẩm và nâng cao giá trị chuỗi nông sản cho người nông dân Việt Nam.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
  },
  quoteBanner: {
    text: 'VÀ TỪ ĐÓ ESSENTIAL OIL ĐƯỢC RA ĐỜI!',
  },
  coreValues: {
    title: 'Giá trị cốt lõi E.S.O',
    items: [
      { letter: 'E', title: 'Eco-friendly', desc: 'Thân thiện môi trường – Phát triển vùng nguyên liệu hữu cơ, quy trình chiết xuất sạch, phát triển bền vững cùng nông nghiệp bản địa.' },
      { letter: 'S', title: 'Safe & Pure', desc: 'An toàn & Nguyên chất – Cam kết cung cấp tinh dầu thiên nhiên 100% nguyên chất tinh khiết, tuyệt đối không pha trộn hương liệu nhân tạo hay hóa chất độc hại.' },
      { letter: 'O', title: 'Organic', desc: 'Hữu cơ tự nhiên – Lựa chọn khắt khe các nguồn dược liệu tự nhiên đạt chuẩn, được chăm bón hữu cơ và thu hoạch thủ công tinh tế.' }
    ]
  },
  visionMission: {
    title: 'Tầm nhìn & Sứ mệnh',
    desc: 'Essential Oil định hướng trở thành thương hiệu tinh dầu thiên nhiên cao cấp hàng đầu Việt Nam. Chúng tôi không ngừng nghiên cứu các liệu pháp hương thơm sáng tạo, mang lại không gian sống an yên, thư thái và nâng niu sức khỏe toàn diện cho mọi gia đình Việt.',
  }
};

const STORAGE_KEY = 'aboutpage_settings';

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_ABOUT_CONFIG));
    return { ...JSON.parse(JSON.stringify(DEFAULT_ABOUT_CONFIG)), ...JSON.parse(raw) };
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_ABOUT_CONFIG));
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Tải ảnh lên
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          <p className="hp-img-hint">Hỗ trợ URL hoặc tải lên từ máy tính.</p>
        </div>
      </div>
    </div>
  );
};

const AboutpageView = () => {
  const { API_URL, user } = useContext(AuthContext);
  const [config, setConfig] = useState(loadConfig);
  const [activeSection, setActiveSection] = useState('story'); // 'story', 'core', 'vision'
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/settings/aboutpage_settings`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setConfig({
              ...DEFAULT_ABOUT_CONFIG,
              ...data,
              brandStory: { ...DEFAULT_ABOUT_CONFIG.brandStory, ...(data.brandStory || {}) },
              quoteBanner: { ...DEFAULT_ABOUT_CONFIG.quoteBanner, ...(data.quoteBanner || {}) },
              coreValues: {
                ...DEFAULT_ABOUT_CONFIG.coreValues,
                ...(data.coreValues || {}),
                items: (data.coreValues?.items || []).map((item, idx) => ({
                  ...DEFAULT_ABOUT_CONFIG.coreValues.items[idx],
                  ...item
                }))
              },
              visionMission: { ...DEFAULT_ABOUT_CONFIG.visionMission, ...(data.visionMission || {}) }
            });
          }
        }
      } catch (err) {
        console.warn('Failed to load About settings from DB:', err);
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
      const response = await fetch(`${API_URL}/settings/aboutpage_settings`, {
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
      console.error('Lỗi lưu cấu hình giới thiệu:', err.message);
      alert(`Lưu cấu hình thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Đặt lại tất cả về giá trị mặc định? Hành động này không thể hoàn tác.')) return;
    const def = JSON.parse(JSON.stringify(DEFAULT_ABOUT_CONFIG));

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/settings/aboutpage_settings`, {
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
      console.error('Lỗi đặt lại cấu hình giới thiệu:', err.message);
      alert(`Đặt lại cấu hình thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const SECTIONS = [
    { key: 'story', label: 'Câu chuyện thương hiệu', icon: '📖', desc: 'Tiêu đề, nội dung và hình ảnh banner' },
    { key: 'core', label: 'Giá trị cốt lõi', icon: '✨', desc: 'Hệ giá trị E.S.O' },
    { key: 'vision', label: 'Tầm nhìn & Sứ mệnh', icon: '🎯', desc: 'Định hướng phát triển thương hiệu' }
  ];

  return (
    <div className="hp-view animate-fade-in">
      <div className="admin-view-header">
        <div className="hp-header-left">
          <h2 className="admin-view-title">📖 QUẢN LÝ GIAO DIỆN GIỚI THIỆU</h2>
          <p className="admin-view-subtitle">Thay đổi văn bản giới thiệu, tầm nhìn sứ mệnh, và hình ảnh thương hiệu.</p>
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

      {activeSection === 'story' && (
        <div className="hp-section-body animate-fade-in">
          <div className="hp-slide-editor-wrap">
            <div className="hp-editor-form glass">
              <div className="form-group">
                <label className="form-label">Tiêu đề trang (Breadcrumbs)</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.brandStory.title}
                  onChange={e => update(['brandStory', 'title'], e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tiêu đề chính câu chuyện</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.brandStory.heading}
                  onChange={e => update(['brandStory', 'heading'], e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Đoạn văn 1</label>
                <textarea
                  className="form-input form-textarea"
                  value={config.brandStory.paragraph1}
                  onChange={e => update(['brandStory', 'paragraph1'], e.target.value)}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Đoạn văn 2</label>
                <textarea
                  className="form-input form-textarea"
                  value={config.brandStory.paragraph2}
                  onChange={e => update(['brandStory', 'paragraph2'], e.target.value)}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Đoạn văn 3</label>
                <textarea
                  className="form-input form-textarea"
                  value={config.brandStory.paragraph3}
                  onChange={e => update(['brandStory', 'paragraph3'], e.target.value)}
                  rows={4}
                />
              </div>

              <ImageInput
                label="Hình ảnh banner câu chuyện"
                value={config.brandStory.image}
                onChange={v => update(['brandStory', 'image'], v)}
              />

              <div className="form-group">
                <label className="form-label">Dòng chữ Quote nổi bật</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.quoteBanner.text}
                  onChange={e => update(['quoteBanner', 'text'], e.target.value)}
                />
              </div>
            </div>

            <div className="hp-slide-preview">
              <div className="hp-preview-label">Live Preview – Câu chuyện & Quote</div>
              <div className="hp-preview-container glass" style={{ padding: '15px', backgroundColor: '#FFF', borderRadius: '8px', fontSize: '13px', color: '#4A5568', lineHeight: '1.6' }}>
                <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2D3748', margin: '0 0 10px 0' }}>{config.brandStory.title}</h1>
                <h2 style={{ fontSize: '14px', fontWeight: 'semibold', color: '#4A5568', margin: '0 0 10px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '5px' }}>{config.brandStory.heading}</h2>
                <p style={{ marginBottom: '8px' }}>{config.brandStory.paragraph1.substring(0, 150)}...</p>
                {config.brandStory.image && (
                  <img src={config.brandStory.image} alt="preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', margin: '8px 0' }} />
                )}
                <div style={{ padding: '10px', backgroundColor: 'rgba(94, 53, 177, 0.1)', color: '#5E35B1', borderLeft: '3px solid #5E35B1', fontWeight: 'bold', textAlign: 'center', margin: '10px 0', borderRadius: '4px' }}>
                  “ {config.quoteBanner.text}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'core' && (
        <div className="hp-section-body animate-fade-in">
          <div className="hp-slide-editor-wrap">
            <div className="hp-editor-form glass">
              <div className="form-group">
                <label className="form-label">Tiêu đề phần giá trị cốt lõi</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.coreValues.title}
                  onChange={e => update(['coreValues', 'title'], e.target.value)}
                />
              </div>

              {config.coreValues.items.map((item, idx) => (
                <div key={idx} className="core-value-editor-card" style={{ border: '1px solid #E2E8F0', padding: '12px', borderRadius: '6px', marginBottom: '12px', backgroundColor: 'rgba(255,255,255,0.4)' }}>
                  <div style={{ fontWeight: 'bold', color: '#5E35B1', marginBottom: '8px' }}>Chữ cái đại diện: {item.letter}</div>
                  <div className="form-group">
                    <label className="form-label">Tiêu đề chính</label>
                    <input
                      type="text"
                      className="form-input"
                      value={item.title}
                      onChange={e => update(['coreValues', 'items', idx, 'title'], e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mô tả chi tiết</label>
                    <textarea
                      className="form-input form-textarea"
                      value={item.desc}
                      onChange={e => update(['coreValues', 'items', idx, 'desc'], e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="hp-slide-preview">
              <div className="hp-preview-label">Live Preview – Giá trị cốt lõi</div>
              <div className="hp-preview-container glass" style={{ padding: '15px', backgroundColor: '#FFF', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#311B92', margin: '0 0 12px 0' }}>{config.coreValues.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {config.coreValues.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '12px' }}>
                      <span style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#5E35B1', color: '#FFF', borderRadius: '50%', fontWeight: 'bold', fontSize: '11px', flexShrink: '0' }}>{item.letter}</span>
                      <div>
                        <strong style={{ color: '#2D3748' }}>{item.title}</strong>
                        <p style={{ color: '#718096', margin: '2px 0 0 0', lineHeight: '1.4' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'vision' && (
        <div className="hp-section-body animate-fade-in">
          <div className="hp-slide-editor-wrap">
            <div className="hp-editor-form glass">
              <div className="form-group">
                <label className="form-label">Tiêu đề phần tầm nhìn sứ mệnh</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.visionMission.title}
                  onChange={e => update(['visionMission', 'title'], e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nội dung chi tiết</label>
                <textarea
                  className="form-input form-textarea"
                  value={config.visionMission.desc}
                  onChange={e => update(['visionMission', 'desc'], e.target.value)}
                  rows={6}
                />
              </div>
            </div>

            <div className="hp-slide-preview">
              <div className="hp-preview-label">Live Preview – Tầm nhìn & Sứ mệnh</div>
              <div className="hp-preview-container glass" style={{ padding: '15px', backgroundColor: '#FFF', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#311B92', margin: '0 0 10px 0' }}>{config.visionMission.title}</h3>
                <p style={{ fontSize: '12px', color: '#4A5568', lineHeight: '1.6', margin: '0' }}>{config.visionMission.desc}</p>
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

export default AboutpageView;
