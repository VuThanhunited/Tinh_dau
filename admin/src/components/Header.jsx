import React, { useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getImageUrl } from '../utils/image';
import './Header.css';

const Header = () => {
  const { user, logout, API_URL, updateCurrentUserDetails } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const [headerConfig, setHeaderConfig] = useState({
    logoTitle: 'ESSENTIAL OIL',
    logoType: 'icon',
    logoImg: ''
  });

  useEffect(() => {
    const fetchHeaderConfig = async () => {
      try {
        const res = await fetch(`${API_URL}/settings/homepage_settings`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.header) {
            setHeaderConfig({
              logoTitle: data.header.logoTitle || 'ESSENTIAL OIL',
              logoType: data.header.logoType || 'icon',
              logoImg: data.header.logoImg || ''
            });
          }
        }
      } catch (err) {
        console.warn('Failed to fetch header config in admin Header:', err);
        try {
          const local = localStorage.getItem('homepage_settings');
          if (local) {
            const data = JSON.parse(local);
            if (data && data.header) {
              setHeaderConfig({
                logoTitle: data.header.logoTitle || 'ESSENTIAL OIL',
                logoType: data.header.logoType || 'icon',
                logoImg: data.header.logoImg || ''
              });
            }
          }
        } catch (e) {
          console.error('Error parsing localStorage in admin Header catch:', e);
        }
      }
    };
    fetchHeaderConfig();
  }, [API_URL]);

  const [settingsFormData, setSettingsFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  const handleOpenSettings = () => {
    if (user) {
      setSettingsFormData({
        username: user.username,
        email: user.email,
        password: '',
        confirmPassword: ''
      });
    }
    setSettingsError('');
    setSettingsSuccess('');
    setIsSettingsOpen(true);
    setShowDropdown(false);
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    if (!settingsFormData.username || !settingsFormData.email) {
      setSettingsError('Vui lòng điền đầy đủ tên đăng nhập và email.');
      return;
    }

    if (settingsFormData.password && settingsFormData.password !== settingsFormData.confirmPassword) {
      setSettingsError('Mật khẩu nhập lại không trùng khớp.');
      return;
    }

    setSettingsLoading(true);
    try {
      if (user.isDemo) {
        // Demo Mode Fallback
        const updatedInfo = {
          username: settingsFormData.username,
          email: settingsFormData.email
        };
        updateCurrentUserDetails(updatedInfo);

        // Update list of users in demo LocalStorage
        const localUsers = localStorage.getItem('essential_local_users');
        if (localUsers) {
          const parsed = JSON.parse(localUsers);
          const updatedList = parsed.map(u => u._id === user._id ? { ...u, username: settingsFormData.username, email: settingsFormData.email } : u);
          localStorage.setItem('essential_local_users', JSON.stringify(updatedList));
        }

        setSettingsSuccess('Cập nhật tài khoản Admin Demo thành công!');
        setTimeout(() => setIsSettingsOpen(false), 2000);
      } else {
        // Real API call
        const payload = {
          username: settingsFormData.username,
          email: settingsFormData.email,
          role: user.role
        };
        if (settingsFormData.password) {
          payload.password = settingsFormData.password;
        }

        const response = await fetch(`${API_URL}/users/${user._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Cập nhật thông tin tài khoản thất bại.');
        }

        // Sync local context state
        updateCurrentUserDetails({
          username: data.username,
          email: data.email
        });

        setSettingsSuccess('Đã cập nhật thông tin tài khoản quản trị thành công!');
        setSettingsFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        setTimeout(() => setIsSettingsOpen(false), 2000);
      }
    } catch (err) {
      setSettingsError(err.message);
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <header className="admin-header-container glass">
      <div className="admin-header-content container">
        {/* Logo */}
        <div className="logo-container">
          <div className="logo-icon">
            {headerConfig.logoType === 'image' && headerConfig.logoImg ? (
              <img src={getImageUrl(headerConfig.logoImg)} alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            ) : (
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
                <path d="M50 15C50 15 35 35 35 55C35 63.28 41.72 70 50 70C58.28 70 65 63.28 65 55C65 35 50 15 50 15Z" fill="#7E57C2" opacity="0.8" />
                <path d="M50 25C50 25 20 45 20 60C20 71.04 28.96 80 40 80C45 80 50 75 50 75C50 75 55 80 60 80C71.04 80 80 71.04 80 60C80 45 50 25 50 25Z" fill="#5E35B1" opacity="0.6" />
                <path d="M50 40C50 40 40 55 40 68C40 73.52 44.48 78 50 78C55.52 78 60 73.52 60 68C60 55 50 40 50 40Z" fill="#E040FB" opacity="0.9" />
              </svg>
            )}
          </div>
          <div className="logo-text">
            <span className="logo-title">{headerConfig.logoTitle}</span>
            <span className="logo-subtitle">PORTAL QUẢN TRỊ</span>
          </div>
        </div>

        {/* Right side navigation & Profile dropdown */}
        <div className="header-right-side">
          <a
            href={
              window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5173'
                : window.location.hostname.includes('vercel.app')
                ? 'https://tinh-dau-five.vercel.app/'
                : '/'
            }
            className="btn-store-link"
            title="Quay lại cửa hàng khách hàng"
            target="_blank"
            rel="noopener noreferrer"
          >
            🛒 Xem cửa hàng
          </a>

          <div className="admin-profile-dropdown-container">
            <button className="profile-btn glass" onClick={() => setShowDropdown(!showDropdown)}>
              <span className="user-avatar">🛡️</span>
              <span>Xin chào, <strong>{user ? user.username : 'Admin'}</strong></span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {showDropdown && (
              <div className="profile-dropdown glass">
                <button className="dropdown-item" onClick={handleOpenSettings} style={{ display: 'block', width: '100%', border: 'none', background: 'none' }}>
                  ⚙️ Cài đặt tài khoản
                </button>
                <button className="dropdown-item logout" onClick={() => { logout(); navigate('/'); }} style={{ display: 'block', width: '100%', border: 'none', background: 'none' }}>
                  🔒 Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Settings Modal */}
      {isSettingsOpen && createPortal(
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">⚙️ THÀNH VIÊN QUẢN TRỊ</h3>
              <button className="modal-close-btn" onClick={() => setIsSettingsOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSettingsSubmit}>
              <div className="modal-body">
                {settingsSuccess && (
                  <div className="auth-alert success animate-fade-in">
                    ✅ {settingsSuccess}
                  </div>
                )}
                {settingsError && (
                  <div className="auth-alert error animate-fade-in">
                    ⚠️ {settingsError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="s-username">Tên tài khoản (Username) *</label>
                  <input
                    type="text"
                    id="s-username"
                    className="form-input"
                    value={settingsFormData.username}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, username: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="s-email">Địa chỉ Email *</label>
                  <input
                    type="email"
                    id="s-email"
                    className="form-input"
                    value={settingsFormData.email}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="s-password">Mật khẩu mới (Để trống nếu không đổi)</label>
                  <input
                    type="password"
                    id="s-password"
                    className="form-input"
                    placeholder="••••••••"
                    value={settingsFormData.password}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, password: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="s-confirm">Nhập lại mật khẩu mới</label>
                  <input
                    type="password"
                    id="s-confirm"
                    className="form-input"
                    placeholder="••••••••"
                    value={settingsFormData.confirmPassword}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsSettingsOpen(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary" disabled={settingsLoading}>
                  {settingsLoading ? 'Đang cập nhật...' : 'Cập nhật tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

export default Header;
