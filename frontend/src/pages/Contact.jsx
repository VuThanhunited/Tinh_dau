import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      triggerToast('Vui lòng nhập đầy đủ Họ tên và Số điện thoại nhé!');
      return;
    }
    
    // Simulate API request
    triggerToast('✨ Gửi thông tin tư vấn thành công! Chúng tôi sẽ liên hệ lại với bạn sớm nhất.');
    setFormData({
      name: '',
      phone: '',
      email: '',
      message: ''
    });
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="contact-page">
      <Header />

      {/* Toast Notification */}
      {showToast && (
        <div className="contact-toast glass animate-fade-in">
          <span className="toast-icon">🍃</span>
          <span className="toast-text">{toastMessage}</span>
          <button className="toast-close" onClick={() => setShowToast(false)}>✕</button>
        </div>
      )}

      {/* 1. Green Fresh Nature Banner */}
      <section className="contact-editorial-banner">
        <div className="container contact-banner-grid">
          <div className="contact-banner-text animate-fade-in">
            <span className="banner-breadcrumb">Trang chủ / Liên hệ</span>
            <h1 className="banner-title">LIÊN HỆ</h1>
            <p className="banner-desc">
              Chúng tôi rất mong nhận được phản hồi của tất cả khách hàng.<br />
              Mọi thông tin, thắc mắc đều được Essential Oil giải đáp. Hãy để lại thông tin ngay nhé!
            </p>
          </div>
          {/* Banner Right Image Display representing Natural Herbs */}
          <div className="contact-banner-visual">
            <div className="herb-visual-wrapper">
              <img src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80" alt="Natural Herbs & Oils" className="herb-img" />
              <div className="visual-circle circle-1">🌱</div>
              <div className="visual-circle circle-2">💧</div>
              <div className="visual-circle circle-3">🌿</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main content area: 2 columns */}
      <section className="contact-main-section container">
        <div className="contact-layout-grid">
          
          {/* Left Column: Contact details */}
          <div className="contact-details-box animate-fade-in">
            <h3 className="section-subtitle">Mọi thông tin vui lòng liên hệ với chúng tôi qua:</h3>
            
            <div className="contact-items-list">
              {/* Address */}
              <div className="contact-detail-item">
                <div className="contact-icon-wrapper green-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="contact-svg-icon">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div className="item-text-box">
                  <p className="item-value font-semibold">
                    No7, Liền Kề 20-21 Khu Đất Dịch Vụ Vạn Phúc, Phường Vạn Phúc, Quận Hà Đông, Tp Hà Nội
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="contact-detail-item">
                <div className="contact-icon-wrapper green-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="contact-svg-icon">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.32-1.32a2 2 0 0 1 2.11-.45c.91.33 1.85.56 2.81.69A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="item-text-box">
                  <p className="item-value font-semibold">0833.356.xxx</p>
                </div>
              </div>

              {/* Email */}
              <div className="contact-detail-item">
                <div className="contact-icon-wrapper green-bg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="contact-svg-icon">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="item-text-box">
                  <p className="item-value font-semibold">cskh@webdemo.com</p>
                </div>
              </div>
            </div>

            <h3 className="section-subtitle" style={{ marginTop: '2.5rem' }}>Hợp tác truyền thông:</h3>
            <div className="contact-detail-item">
              <div className="contact-icon-wrapper green-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="contact-svg-icon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="item-text-box">
                <p className="item-value font-semibold">cskh@webdemo.com</p>
              </div>
            </div>

            <h3 className="section-subtitle" style={{ marginTop: '2.5rem' }}>Fanpage Facebook</h3>
            <div className="contact-detail-item">
              <div className="contact-icon-wrapper green-bg">
                <span className="facebook-icon-text">f</span>
              </div>
              <div className="item-text-box">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="fanpage-link font-semibold">
                  Essential Oil - Tinh Dầu Thiên Nhiên
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Form Đăng ký tư vấn */}
          <div className="contact-form-box animate-fade-in glass">
            <h2 className="form-title">ĐĂNG KÝ TƯ VẤN</h2>
            
            <form onSubmit={handleSubmit} className="actual-contact-form">
              <div className="form-group">
                <label className="form-label">Họ tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ email"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gửi thông tin cho chúng tôi</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nhập nội dung tin nhắn hoặc câu hỏi của bạn..."
                  className="form-textarea"
                  rows="4"
                ></textarea>
              </div>

              <button type="submit" className="btn-submit-contact">
                GỬI THÔNG TIN
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
