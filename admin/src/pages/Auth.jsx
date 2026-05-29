import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Auth = () => {
  const { user, login, error: authError, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');

  // Auto redirect to dashboard if logged in as admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLocalSuccess('');

    if (!email || !password) {
      setLocalError('Vui lòng điền đầy đủ email/username và mật khẩu.');
      return;
    }

    try {
      await login(email, password);
      setLocalSuccess('Đăng nhập quản trị thành công! Đang truy cập...');
    } catch (err) {
      // Error is stored in AuthContext
    }
  };



  return (
    <div className="admin-auth-page bg-lavender-gradient">
      <div className="admin-auth-container container">
        <div className="admin-auth-card glass animate-fade-in">
          {/* Logo */}
          <div className="admin-auth-logo">
            <svg width="45" height="45" viewBox="0 0 100 100" fill="none">
              <path d="M50 15C50 15 35 35 35 55C35 63.28 41.72 70 50 70C58.28 70 65 63.28 65 55C65 35 50 15 50 15Z" fill="#7E57C2" opacity="0.8"/>
              <path d="M50 25C50 25 20 45 20 60C20 71.04 28.96 80 40 80C45 80 50 75 50 75C50 75 55 80 60 80C71.04 80 80 71.04 80 60C80 45 50 25 50 25Z" fill="#5E35B1" opacity="0.6"/>
              <path d="M50 40C50 40 40 55 40 68C40 73.52 44.48 78 50 78C55.52 78 60 73.52 60 68C60 55 50 40 50 40Z" fill="#E040FB" opacity="0.9"/>
            </svg>
            <h1 className="admin-auth-title">ESSENTIAL OIL</h1>
            <span className="admin-auth-subtitle">🛡️ PORTAL ĐĂNG NHẬP QUẢN TRỊ</span>
          </div>

          <p className="admin-auth-welcome">Vui lòng đăng nhập bằng tài khoản quản trị để truy cập trang quản lý sản phẩm, bài viết và khách hàng.</p>

          {/* Success/Error Alerts */}
          {(localError || authError) && (
            <div className="auth-alert error animate-fade-in">
              ⚠️ {localError || authError}
            </div>
          )}

          {localSuccess && (
            <div className="auth-alert success animate-fade-in">
              ✅ {localSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Quản trị viên</label>
              <input
                type="text"
                id="email"
                className="form-input"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? (
                <div className="spinner" style={{width: '20px', height: '20px', borderWidth: '2px'}}></div>
              ) : (
                'Đăng nhập Hệ thống'
              )}
            </button>
          </form>


          <div className="admin-auth-footer">
            <a 
              href={window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5173' : 'https://tinh-dau-five.vercel.app/'} 
              className="back-to-shop-link"
            >
              ➔ Quay lại Cửa hàng Khách hàng
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
