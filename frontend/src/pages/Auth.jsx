import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import './Auth.css';

const Auth = () => {
  const { user, login, register, error: authError, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Mode can be 'login' or 'register'
  const [mode, setMode] = useState('login');
  
  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        const adminUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:5174'
          : window.location.hostname.includes('vercel.app')
          ? 'https://tinh-dau-admin.vercel.app'
          : '/admin';
        window.location.href = adminUrl;
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  // Determine starting mode from state or URL
  useEffect(() => {
    if (location.pathname === '/register') {
      setMode('register');
    } else {
      setMode('login');
    }
    setLocalError('');
    setLocalSuccess('');
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLocalSuccess('');

    if (mode === 'login') {
      if (!email || !password) {
        setLocalError('Vui lòng điền đầy đủ các thông tin đăng nhập.');
        return;
      }

      try {
        await login(email, password);
        setLocalSuccess('Đăng nhập thành công! Đang chuyển hướng...');
      } catch (err) {
        // Error is set in AuthContext
      }
    } else {
      if (!username || !email || !password || !confirmPassword) {
        setLocalError('Vui lòng điền đầy đủ tất cả các trường.');
        return;
      }

      if (password !== confirmPassword) {
        setLocalError('Mật khẩu nhập lại không khớp.');
        return;
      }

      if (password.length < 6) {
        setLocalError('Mật khẩu phải chứa ít nhất 6 ký tự.');
        return;
      }

      try {
        await register(username, email, password);
        setLocalSuccess('Đăng ký tài khoản thành công! Đang đăng nhập...');
      } catch (err) {
        // Error is set in AuthContext
      }
    }
  };


  return (
    <div className="auth-page">
      <Header />
      
      <div className="auth-main-container bg-lavender-gradient section-padding">
        <div className="container auth-flex-wrapper">
          <div className="auth-form-card glass animate-fade-in">
            <div className="auth-card-header">
              <h2>{mode === 'login' ? 'Đăng Nhập' : 'Tạo Tài Khoản'}</h2>
              <p>{mode === 'login' ? 'Chào mừng trở lại với tinh dầu thiên nhiên cao cấp' : 'Bắt đầu hành trình chăm sóc sức khỏe của bạn'}</p>
            </div>

            {/* Error alerts */}
            {(localError || authError) && (
              <div className="auth-alert error animate-fade-in">
                ⚠️ {localError || authError}
              </div>
            )}

            {/* Success alerts */}
            {localSuccess && (
              <div className="auth-alert success animate-fade-in">
                ✅ {localSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {mode === 'register' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="username">Tên người dùng</label>
                  <input
                    type="text"
                    id="username"
                    className="form-input"
                    placeholder="Nhập tên tài khoản..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email hoặc Tên đăng nhập</label>
                <input
                  type="text"
                  id="email"
                  className="form-input"
                  placeholder="Nhập email hoặc tên đăng nhập..."
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

              {mode === 'register' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
                {loading ? (
                  <div className="spinner" style={{width: '20px', height: '20px', borderWidth: '2px'}}></div>
                ) : (
                  mode === 'login' ? 'Đăng nhập ngay' : 'Đăng ký ngay'
                )}
              </button>
            </form>

            <div className="auth-mode-switch">
              {mode === 'login' ? (
                <p>
                  Chưa có tài khoản?{' '}
                  <button onClick={() => { setMode('register'); navigate('/register'); }} className="switch-mode-link">
                    Đăng ký tại đây
                  </button>
                </p>
              ) : (
                <p>
                  Đã có tài khoản?{' '}
                  <button onClick={() => { setMode('login'); navigate('/login'); }} className="switch-mode-link">
                    Đăng nhập tại đây
                  </button>
                </p>
              )}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
