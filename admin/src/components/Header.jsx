import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="admin-header-container glass">
      <div className="admin-header-content container">
        {/* Logo */}
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
              <path d="M50 15C50 15 35 35 35 55C35 63.28 41.72 70 50 70C58.28 70 65 63.28 65 55C65 35 50 15 50 15Z" fill="#7E57C2" opacity="0.8"/>
              <path d="M50 25C50 25 20 45 20 60C20 71.04 28.96 80 40 80C45 80 50 75 50 75C50 75 55 80 60 80C71.04 80 80 71.04 80 60C80 45 50 25 50 25Z" fill="#5E35B1" opacity="0.6"/>
              <path d="M50 40C50 40 40 55 40 68C40 73.52 44.48 78 50 78C55.52 78 60 73.52 60 68C60 55 50 40 50 40Z" fill="#E040FB" opacity="0.9"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-title">ESSENTIAL OIL</span>
            <span className="logo-subtitle">PORTAL QUẢN TRỊ</span>
          </div>
        </div>

        {/* Right side navigation & Profile dropdown */}
        <div className="header-right-side">
          <a href="http://localhost:5173" className="btn-store-link" title="Quay lại cửa hàng khách hàng">
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
                <button className="dropdown-item logout" onClick={() => { logout(); navigate('/'); }}>
                  🔒 Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
