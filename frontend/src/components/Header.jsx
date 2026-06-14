import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { getImageUrl } from '../utils/image';
import './Header.css';

const Header = () => {
  const { user, logout, API_URL } = useContext(AuthContext);
  const { cartItems, wishlistItems, getCartTotal, formatVND } = useContext(CartContext);
  const [headerConfig, setHeaderConfig] = useState({
    welcomeText: 'Chào mừng bạn đến với mypham13.maugiaodien.com',
    logoTitle: 'ESSENTIAL OIL',
    logoSubtitle: 'PURE & NATURAL',
    logoType: 'icon', // 'icon' or 'image'
    logoImg: '',
  });
  const [hotline, setHotline] = useState('0988.888.888');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${API_URL}/settings/homepage_settings`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            if (data.header) {
              setHeaderConfig(prev => ({ ...prev, ...data.header }));
            }
            if (data.footer && data.footer.hotline) {
              setHotline(data.footer.hotline);
            }
          }
        } else {
          const local = localStorage.getItem('homepage_settings');
          if (local) {
            const data = JSON.parse(local);
            if (data) {
              if (data.header) {
                setHeaderConfig(prev => ({ ...prev, ...data.header }));
              }
              if (data.footer && data.footer.hotline) {
                setHotline(data.footer.hotline);
              }
            }
          }
        }
      } catch (err) {
        console.warn('Failed to fetch config in Header:', err);
        try {
          const local = localStorage.getItem('homepage_settings');
          if (local) {
            const data = JSON.parse(local);
            if (data) {
              if (data.header) {
                setHeaderConfig(prev => ({ ...prev, ...data.header }));
              }
              if (data.footer && data.footer.hotline) {
                setHotline(data.footer.hotline);
              }
            }
          }
        } catch (e) {
          console.error('Error parsing localStorage in Header catch:', e);
        }
      }
    };
    fetchConfig();
  }, [API_URL]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };
  
  const currentPath = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const typeParam = searchParams.get('type') || '';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="header-container">
      {/* 1. Purple Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <span className="welcome-text">{headerConfig.welcomeText}</span>
          <div className="top-bar-links">
            <div className="account-dropdown-container">
              <button className="top-bar-btn" onClick={() => setShowDropdown(!showDropdown)}>
                {/* User Icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>{user ? `Xin chào, ${user.username}` : 'Tài khoản'}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              
              {showDropdown && (
                <div className="account-dropdown glass">
                  {user ? (
                    <>
                      {user.role === 'admin' && (
                        <a
                          href={
                            window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                              ? 'http://localhost:5174'
                              : window.location.hostname.includes('vercel.app')
                              ? 'https://tinh-dau-admin.vercel.app'
                              : '/admin'
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dropdown-item admin-link"
                          onClick={() => setShowDropdown(false)}
                        >
                          🛡️ Trang Quản Trị (Admin)
                        </a>
                      )}
                      <button className="dropdown-item" onClick={() => { logout(); setShowDropdown(false); navigate('/'); }}>
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="dropdown-item" onClick={() => setShowDropdown(false)}>Đăng nhập</Link>
                      <Link to="/register" className="dropdown-item" onClick={() => setShowDropdown(false)}>Đăng ký</Link>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <span className="divider">|</span>
            <a href="#orders" className="top-bar-link">Kiểm tra đơn hàng</a>
            <a href={`tel:${hotline.replace(/\./g, '')}`} className="top-bar-hotline-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79a15.15 15.15 0 0 0 6.57 6.57l2.2-2.2a1 1 0 0 1 .9-.27 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.27.9l-2.18 2.2z" />
              </svg>
              Hotline: {hotline}
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Logo & Search & Widget Bar */}
      <div className="main-header">
        <div className="container main-header-content">
          {/* Logo */}
          <Link to="/" className="logo-container">
            <div className="logo-icon">
              {headerConfig.logoType === 'image' && headerConfig.logoImg ? (
                <img src={getImageUrl(headerConfig.logoImg)} alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              ) : (
                /* Lotus SVG */
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
                  <path d="M50 15C50 15 35 35 35 55C35 63.28 41.72 70 50 70C58.28 70 65 63.28 65 55C65 35 50 15 50 15Z" fill="#7E57C2" opacity="0.8"/>
                  <path d="M50 25C50 25 20 45 20 60C20 71.04 28.96 80 40 80C45 80 50 75 50 75C50 75 55 80 60 80C71.04 80 80 71.04 80 60C80 45 50 25 50 25Z" fill="#5E35B1" opacity="0.6"/>
                  <path d="M50 40C50 40 40 55 40 68C40 73.52 44.48 78 50 78C55.52 78 60 73.52 60 68C60 55 50 40 50 40Z" fill="#E040FB" opacity="0.9"/>
                </svg>
              )}
            </div>
            <div className="logo-text">
              <span className="logo-title">{headerConfig.logoTitle}</span>
              <span className="logo-subtitle">{headerConfig.logoSubtitle}</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Tìm kiếm tinh dầu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          {/* Widgets (Wishlist & Cart) */}
          <div className="header-widgets">
            <Link to="/" className="widget-item">
              <div className="widget-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill={wishlistItems.length > 0 ? '#E53E3E' : 'none'} stroke={wishlistItems.length > 0 ? '#E53E3E' : 'currentColor'} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlistItems.length > 0 && <span className="widget-badge">{wishlistItems.length}</span>}
              </div>
              <div className="widget-text">
                <span className="widget-label">Yêu thích</span>
                <span className="widget-value">{wishlistItems.length}</span>
              </div>
            </Link>

            <Link to="/" className="widget-item">
              <div className="widget-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cartItems.length > 0 && <span className="widget-badge purple">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>}
              </div>
              <div className="widget-text">
                <span className="widget-label">Giá hàng</span>
                <span className="widget-value">{formatVND(getCartTotal())}</span>
              </div>
            </Link>

            {/* Hamburger Button for Mobile */}
            <button className="hamburger-menu-btn" onClick={() => setIsMobileMenuOpen(true)} aria-label="Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 2b. Mobile Search Bar Row */}
      <div className="mobile-search-row">
        <div className="container">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Tìm kiếm tinh dầu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* 3. Navigation Bar */}
      <nav className="nav-bar bg-purple-gradient">
        <div className="container nav-content">
          <ul className="nav-list">
            <li><Link to="/" className={`nav-link ${currentPath === '/' ? 'active' : ''}`}>TRANG CHỦ</Link></li>
            <li><Link to="/about" className={`nav-link ${currentPath === '/about' ? 'active' : ''}`}>GIỚI THIỆU</Link></li>
            <li className="dropdown-nav">
              <Link to="/products?type=essential-oils" className={`nav-link ${currentPath === '/products' && typeParam === 'essential-oils' ? 'active' : ''}`}>
                TINH DẦU 
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{marginLeft: '4px'}}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </Link>
              <ul className="nav-dropdown-menu">
                <li><Link to="/products?type=essential-oils&category=Tinh dầu đơn">Tinh dầu đơn</Link></li>
                <li><Link to="/products?type=essential-oils&category=Tinh dầu blend">Tinh dầu blend</Link></li>
                <li><Link to="/products?type=essential-oils&category=Tinh dầu cho sức khỏe">Tinh dầu cho sức khỏe</Link></li>
                <li><Link to="/products?type=essential-oils&category=Tinh dầu cho làm đẹp">Tinh dầu cho làm đẹp</Link></li>
              </ul>
            </li>
            <li className="dropdown-nav">
              <Link to="/products" className={`nav-link ${currentPath === '/products' && typeParam !== 'essential-oils' ? 'active' : ''}`}>
                SẢN PHẨM
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{marginLeft: '4px'}}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </Link>
              <ul className="nav-dropdown-menu">
                <li><Link to="/products?category=Tinh dầu cho không gian">Tinh dầu xông phòng</Link></li>
                <li><Link to="/products?category=Phụ kiện khuếch tán">Máy khuếch tán</Link></li>
                <li><Link to="/products?category=Bộ quà tặng">Hộp quà tặng</Link></li>
              </ul>
            </li>
            <li><Link to="/articles" className={`nav-link ${currentPath === '/articles' ? 'active' : ''}`}>KIẾN THỨC</Link></li>
            <li><Link to="/contact" className={`nav-link ${currentPath === '/contact' ? 'active' : ''}`}>LIÊN HỆ</Link></li>
          </ul>
        </div>
      </nav>

      {/* 4. Mobile Navigation Drawer */}
      <div className={`mobile-nav-drawer-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <div className="drawer-logo">
              <span className="drawer-logo-title">{headerConfig.logoTitle}</span>
              <span className="drawer-logo-subtitle">{headerConfig.logoSubtitle}</span>
            </div>
            <button className="close-drawer-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label="Đóng menu">✕</button>
          </div>
          
          <div className="drawer-body">
            <ul className="drawer-nav-list">
              <li>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={currentPath === '/' ? 'active' : ''}>TRANG CHỦ</Link>
              </li>
              <li>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={currentPath === '/about' ? 'active' : ''}>GIỚI THIỆU</Link>
              </li>
              <li className="drawer-dropdown-item">
                <div className="drawer-dropdown-header" onClick={() => toggleSubmenu('essential-oils')}>
                  <span className={currentPath === '/products' && typeParam === 'essential-oils' ? 'active' : ''}>TINH DẦU</span>
                  <span className={`arrow ${activeSubmenu === 'essential-oils' ? 'open' : ''}`}>▼</span>
                </div>
                <ul className={`drawer-submenu ${activeSubmenu === 'essential-oils' ? 'open' : ''}`}>
                  <li><Link to="/products?type=essential-oils&category=Tinh dầu đơn" onClick={() => setIsMobileMenuOpen(false)}>Tinh dầu đơn</Link></li>
                  <li><Link to="/products?type=essential-oils&category=Tinh dầu blend" onClick={() => setIsMobileMenuOpen(false)}>Tinh dầu blend</Link></li>
                  <li><Link to="/products?type=essential-oils&category=Tinh dầu cho sức khỏe" onClick={() => setIsMobileMenuOpen(false)}>Tinh dầu cho sức khỏe</Link></li>
                  <li><Link to="/products?type=essential-oils&category=Tinh dầu cho làm đẹp" onClick={() => setIsMobileMenuOpen(false)}>Tinh dầu cho làm đẹp</Link></li>
                </ul>
              </li>
              <li className="drawer-dropdown-item">
                <div className="drawer-dropdown-header" onClick={() => toggleSubmenu('products')}>
                  <span className={currentPath === '/products' && typeParam !== 'essential-oils' ? 'active' : ''}>SẢN PHẨM</span>
                  <span className={`arrow ${activeSubmenu === 'products' ? 'open' : ''}`}>▼</span>
                </div>
                <ul className={`drawer-submenu ${activeSubmenu === 'products' ? 'open' : ''}`}>
                  <li><Link to="/products?category=Tinh dầu cho không gian" onClick={() => setIsMobileMenuOpen(false)}>Tinh dầu xông phòng</Link></li>
                  <li><Link to="/products?category=Phụ kiện khuếch tán" onClick={() => setIsMobileMenuOpen(false)}>Máy khuếch tán</Link></li>
                  <li><Link to="/products?category=Bộ quà tặng" onClick={() => setIsMobileMenuOpen(false)}>Hộp quà tặng</Link></li>
                </ul>
              </li>
              <li>
                <Link to="/articles" onClick={() => setIsMobileMenuOpen(false)} className={currentPath === '/articles' ? 'active' : ''}>KIẾN THỨC</Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={currentPath === '/contact' ? 'active' : ''}>LIÊN HỆ</Link>
              </li>
            </ul>
            
            <div className="drawer-footer">
              <a href={`tel:${hotline.replace(/\./g, '')}`} className="drawer-hotline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px'}}>
                  <path d="M6.62 10.79a15.15 15.15 0 0 0 6.57 6.57l2.2-2.2a1 1 0 0 1 .9-.27 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.27.9l-2.18 2.2z" />
                </svg>
                Hotline: {hotline}
              </a>
              <div className="drawer-auth-links">
                {user ? (
                  <>
                    <span className="drawer-welcome">Xin chào, <strong>{user.username}</strong></span>
                    {user.role === 'admin' && (
                      <a
                        href={
                          window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                            ? 'http://localhost:5174'
                            : window.location.hostname.includes('vercel.app')
                            ? 'https://tinh-dau-admin.vercel.app'
                            : '/admin'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="drawer-auth-btn admin-btn"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        🛡️ Trang Quản Trị
                      </a>
                    )}
                    <button className="drawer-auth-btn logout-btn" onClick={() => { logout(); setIsMobileMenuOpen(false); navigate('/'); }}>
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="drawer-auth-btn" onClick={() => setIsMobileMenuOpen(false)}>Đăng nhập</Link>
                    <Link to="/register" className="drawer-auth-btn" onClick={() => setIsMobileMenuOpen(false)}>Đăng ký</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
