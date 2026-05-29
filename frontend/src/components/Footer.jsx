import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const DEFAULT_FOOTER_CONFIG = {
  companyDesc: 'Mypham13.maugiaodien.com chuyên cung cấp các loại tinh dầu thiên nhiên nguyên chất, an toàn cho sức khỏe và thân thiện với môi trường.',
  hotline: '0988.888.888',
  email: 'hello@maugiaodien.com',
  address: 'Số 123, Đường ABC, Quận 1, TP. Hồ Chí Minh',
  copyright: '© 2023 mypham13.maugiaodien.com. All rights reserved.',
};

const Footer = () => {
  const { API_URL } = useContext(AuthContext);
  const [footerConfig, setFooterConfig] = useState(DEFAULT_FOOTER_CONFIG);

  useEffect(() => {
    const fetchFooterConfig = async () => {
      try {
        const res = await fetch(`${API_URL}/settings/homepage_settings`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.footer) {
            setFooterConfig({ ...DEFAULT_FOOTER_CONFIG, ...data.footer });
          }
        } else {
          const local = localStorage.getItem('homepage_settings');
          if (local) {
            const data = JSON.parse(local);
            if (data && data.footer) {
              setFooterConfig({ ...DEFAULT_FOOTER_CONFIG, ...data.footer });
            }
          }
        }
      } catch (err) {
        console.warn('Failed to fetch footer config from DB, using localStorage:', err);
        try {
          const raw = localStorage.getItem('homepage_settings');
          if (raw) {
            const data = JSON.parse(raw);
            if (data && data.footer) {
              setFooterConfig({ ...DEFAULT_FOOTER_CONFIG, ...data.footer });
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchFooterConfig();
  }, [API_URL]);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* Col 1 */}
        <div className="footer-col">
          <h4 className="footer-col-title">VỀ CHÚNG TÔI</h4>
          <p className="footer-col-text">{footerConfig.companyDesc}</p>
          <div className="footer-socials">
            <a href="https://www.facebook.com/people/Tinh-D%E1%BA%A7u-Tr%C3%A0m-H%C6%B0%C6%A1ng-Giang/100067505340122/" target="_blank" rel="noopener noreferrer" className="social-icon facebook" title="Facebook">f</a>
            <a href="#" className="social-icon instagram" title="Instagram">in</a>
            <a href="#" className="social-icon youtube" title="Youtube">▶</a>
            <a href="#" className="social-icon tiktok" title="TikTok">tt</a>
          </div>
        </div>
        {/* Col 2 */}
        <div className="footer-col">
          <h4 className="footer-col-title">THÔNG TIN LIÊN HỆ</h4>
          <ul className="footer-contact-list">
            <li><span>📞</span> Hotline: {footerConfig.hotline}</li>
            <li><span>✉️</span> Email: {footerConfig.email}</li>
            <li><span>📍</span> {footerConfig.address}</li>
          </ul>
        </div>
        {/* Col 3 */}
        <div className="footer-col">
          <h4 className="footer-col-title">CHÍNH SÁCH</h4>
          <ul className="footer-links">
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Chính sách vận chuyển</a></li>
            <li><a href="#">Điều khoản sử dụng</a></li>
          </ul>
        </div>
        {/* Col 4 */}
        <div className="footer-col">
          <h4 className="footer-col-title">HƯỚNG DẪN</h4>
          <ul className="footer-links">
            <li><a href="#">Hướng dẫn mua hàng</a></li>
            <li><a href="#">Hướng dẫn thanh toán</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Câu hỏi thường gặp</a></li>
          </ul>
        </div>
        {/* Col 5 */}
        <div className="footer-col">
          <h4 className="footer-col-title">ĐĂNG KÝ NHẬN TIN</h4>
          <p className="footer-col-text">Nhận thông tin khuyến mãi mới nhất từ chúng tôi</p>
          <form className="footer-subscribe" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Nhập email của bạn..." className="footer-email-input" />
            <button type="submit" className="footer-subscribe-btn">→</button>
          </form>
          <div className="footer-payments">
            <span className="payment-icon visa">VISA</span>
            <span className="payment-icon mastercard">MC</span>
            <span className="payment-icon zalopay">ZaloPay</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{footerConfig.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
