import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Auth from './pages/Auth';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ProductsView from './components/ProductsView';
import UsersView from './components/UsersView';
import HomepageView from './components/HomepageView';
import AboutpageView from './components/AboutpageView';
import ArticlespageView from './components/ArticlespageView';
import ContactpageView from './components/ContactpageView';
import './App.css';

// Admin Core Layout Component
const AdminLayout = () => {
  const { user, API_URL, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'products', 'users', 'homepage'

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-portal-layout animate-fade-in">
      {/* Dynamic Header */}
      <Header />

      {/* Main Split Section */}
      <div className="admin-main-section">
        
        {/* Left Sidebar */}
        <aside className="admin-sidebar glass">
          <ul className="sidebar-nav">
            <li>
              <button 
                className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <span className="sidebar-nav-item-icon">📊</span>
                <span>Bảng điều khiển</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <span className="sidebar-nav-item-icon">🍃</span>
                <span>Quản lý sản phẩm</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-nav-item ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <span className="sidebar-nav-item-icon">👥</span>
                <span>Quản lý người dùng</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-nav-item ${activeTab === 'homepage' ? 'active' : ''}`}
                onClick={() => setActiveTab('homepage')}
                id="sidebar-nav-homepage"
              >
                <span className="sidebar-nav-item-icon">🎨</span>
                <span>Giao diện trang chủ</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-nav-item ${activeTab === 'aboutpage' ? 'active' : ''}`}
                onClick={() => setActiveTab('aboutpage')}
                id="sidebar-nav-aboutpage"
              >
                <span className="sidebar-nav-item-icon">📖</span>
                <span>Giao diện giới thiệu</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-nav-item ${activeTab === 'articlespage' ? 'active' : ''}`}
                onClick={() => setActiveTab('articlespage')}
                id="sidebar-nav-articlespage"
              >
                <span className="sidebar-nav-item-icon">📚</span>
                <span>Giao diện kiến thức</span>
              </button>
            </li>
            <li>
              <button 
                className={`sidebar-nav-item ${activeTab === 'contactpage' ? 'active' : ''}`}
                onClick={() => setActiveTab('contactpage')}
                id="sidebar-nav-contactpage"
              >
                <span className="sidebar-nav-item-icon">📞</span>
                <span>Giao diện liên hệ</span>
              </button>
            </li>
          </ul>

          {/* Footer logout */}
          <div className="sidebar-footer">
            <button className="sidebar-btn-logout" onClick={logout}>
              <span>🔒</span>
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Right Active Viewport */}
        <main className="admin-viewport">
          
          {/* Conditional View Rendering */}
          {activeTab === 'dashboard' && (
            <DashboardView API_URL={API_URL} user={user} />
          )}
          {activeTab === 'products' && (
            <ProductsView API_URL={API_URL} user={user} />
          )}
          {activeTab === 'users' && (
            <UsersView API_URL={API_URL} user={user} />
          )}
          {activeTab === 'homepage' && (
            <HomepageView />
          )}
          {activeTab === 'aboutpage' && (
            <AboutpageView />
          )}
          {activeTab === 'articlespage' && (
            <ArticlespageView />
          )}
          {activeTab === 'contactpage' && (
            <ContactpageView />
          )}
        </main>
      </div>
    </div>
  );
};

// Core App Route Switch
const AppContent = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', backgroundColor: '#F7FAFC' }}>
        <div className="spinner"></div>
        <p style={{ color: '#718096', fontWeight: 600, fontFamily: 'sans-serif' }}>Đang khởi tạo cổng quản trị viên...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/admin" element={user && user.role === 'admin' ? <AdminLayout /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '');
  return (
    <AuthProvider>
      <Router basename={basename}>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
