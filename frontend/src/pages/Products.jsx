import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Header from '../components/Header';
import './Products.css';

const Products = () => {
  const navigate = useNavigate();
  const { API_URL } = useContext(AuthContext);
  const { addToCart, toggleWishlist, wishlistItems, formatVND } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParamQuery = searchParams.get('search') || '';
  const typeParam = searchParams.get('type') || '';

  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const itemsPerPage = 8;

  const demoProducts = [
    { _id: 'dp1', name: 'Tinh dầu Oải Hương (Lavender)', image: 'http://localhost:5000/img/download (8).jpg', category: 'Tinh dầu đơn', originalPrice: 275000, salePrice: 220000 },
    { _id: 'dp2', name: 'Tinh dầu Tràm Trà (Tea Tree)', image: 'http://localhost:5000/img/download (9).jpg', category: 'Tinh dầu đơn', originalPrice: 225000, salePrice: 180000 },
    { _id: 'dp3', name: 'Tinh dầu Bạc Hà (Peppermint)', image: 'http://localhost:5000/img/download (10).jpg', category: 'Tinh dầu đơn', originalPrice: 200000, salePrice: 160000 },
    { _id: 'dp4', name: 'Tinh dầu Chanh (Lemon)', image: 'http://localhost:5000/img/download (1).jpg', category: 'Tinh dầu đơn', originalPrice: 190000, salePrice: 150000 },
    { _id: 'dp5', name: 'Tinh dầu Khuynh Diệp (Eucalyptus)', image: 'http://localhost:5000/img/download (7).jpg', category: 'Tinh dầu đơn', originalPrice: 200000, salePrice: 160000 },
    { _id: 'dp6', name: 'Tinh dầu Sả Chanh (Lemongrass)', image: 'http://localhost:5000/img/download (6).jpg', category: 'Tinh dầu cho sức khỏe', originalPrice: 150000, salePrice: 120000 },
    { _id: 'dp7', name: 'Máy khuếch tán tinh dầu Premium', image: 'http://localhost:5000/img/download (11).jpg', category: 'Phụ kiện khuếch tán', originalPrice: 650000, salePrice: 450000 },
    { _id: 'dp8', name: 'Combo dầu gội thảo dược', image: 'http://localhost:5000/img/download (4).jpg', category: 'Bộ quà tặng', originalPrice: 380000, salePrice: 320000 },

    // Naciva & Essential Oil shampoo combos to perfectly match user image
    { _id: 'dp9', name: 'Combo dầu gội Naciva 1', image: 'http://localhost:5000/img/download.jpg', category: 'Bộ quà tặng', originalPrice: 395000, salePrice: 325000 },
    { _id: 'dp10', name: 'Combo dầu gội Naciva 2', image: 'http://localhost:5000/img/download (1).jpg', category: 'Bộ quà tặng', originalPrice: 310000, salePrice: 256000 },
    { _id: 'dp11', name: 'Combo dầu gội phủ bạc thảo mộc', image: 'http://localhost:5000/img/download (2).jpg', category: 'Bộ quà tặng', originalPrice: 180000, salePrice: 145000 },
    { _id: 'dp12', name: 'Dầu gội phủ bạc gừng tươi', image: 'http://localhost:5000/img/download (5).jpg', category: 'Phụ kiện khuếch tán', originalPrice: 420000, salePrice: 360000 },
    { _id: 'dp13', name: 'Dầu gội phủ bạc Naciva', image: 'http://localhost:5000/img/download (6).jpg', category: 'Phụ kiện khuếch tán', originalPrice: 210000, salePrice: 169000 },
    { _id: 'dp14', name: 'Dầu gội phủ bạc thiên nhiên', image: 'http://localhost:5000/img/download (7).jpg', category: 'Tinh dầu cho sức khỏe', originalPrice: 200000, salePrice: 165000 }
  ];

  const categoriesList = [
    'Tất cả',
    'Tinh dầu đơn',
    'Tinh dầu blend',
    'Tinh dầu cho sức khỏe',
    'Tinh dầu cho làm đẹp',
    'Tinh dầu cho không gian',
    'Phụ kiện khuếch tán',
    'Bộ quà tặng'
  ];

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProducts(data);
      } catch {
        const local = localStorage.getItem('essential_local_products');
        setProducts(local ? JSON.parse(local) : demoProducts);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [API_URL]);

  // Sync category param from Header/Home redirects
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setCurrentPage(1);
    } else {
      setSelectedCategory('Tất cả');
    }
  }, [categoryParam]);

  // Sync search param from Header
  useEffect(() => {
    if (searchParamQuery) {
      setSearchQuery(searchParamQuery);
      setCurrentPage(1);
    }
  }, [searchParamQuery]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    // update URL param
    if (category === 'Tất cả') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const getFilteredProducts = () => {
    let list = [...products];

    // 1. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
    }

    // 2. Filter by Category Select
    if (selectedCategory !== 'Tất cả') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // 3. Filter by Type Param (Essential Oils)
    if (typeParam === 'essential-oils') {
      list = list.filter(p => p.category && p.category.toLowerCase().includes('tinh dầu'));
    }

    return list;
  };

  const getFilteredAndSortedProducts = () => {
    let list = getFilteredProducts();

    // Sort logic
    if (sortBy === 'price-low') {
      list = list.sort((a, b) => a.salePrice - b.salePrice);
    } else if (sortBy === 'price-high') {
      list = list.sort((a, b) => b.salePrice - a.salePrice);
    } else if (sortBy === 'latest') {
      list = list.reverse();
    }

    return list;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    triggerToast(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const discountOf = (p) => Math.round(((p.originalPrice - p.salePrice) / p.originalPrice) * 100);

  return (
    <div className="products-archive-page">
      <Header />

      {/* Toast Notification */}
      {showToast && (
        <div className="products-toast glass animate-fade-in">
          <span className="toast-icon">✨</span>
          <span className="toast-text">{toastMessage}</span>
          <button className="toast-close" onClick={() => setShowToast(false)}>✕</button>
        </div>
      )}

      {/* Breadcrumbs and Stats / Sort Row */}
      <div className="shop-breadcrumbs-and-sort-bar">
        <div className="container bc-sort-flex-row">
          <div className="breadcrumbs">
            <Link to="/">Trang chủ</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">
              {typeParam === 'essential-oils' ? 'Tinh dầu' : 'Sản phẩm'}
            </span>
          </div>

          <div className="stats-and-sort-box">
            <span className="stats-text">
              Hiển thị {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredProducts.length)} của {filteredProducts.length} kết quả
            </span>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="sort-select-dropdown"
            >
              <option value="default">Thứ tự mặc định</option>
              <option value="latest">Mới nhất</option>
              <option value="price-low">Thứ tự theo giá: thấp đến cao</option>
              <option value="price-high">Thứ tự theo giá: cao đến thấp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main shop container */}
      <section className="products-shop-section container">

        {/* Products Grid */}
        {loading ? (
          <div className="shop-loading-spinner-container">
            <div className="spinner"></div>
            <p>Đang trưng bày các sản phẩm tinh tế...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="shop-no-products glass animate-fade-in">
            <span className="no-icon">🍃</span>
            <h3>Không tìm thấy sản phẩm phù hợp!</h3>
            <p>Hãy thử tìm kiếm với từ khóa khác hoặc chuyển danh mục xem nhé.</p>
            <button className="btn btn-primary" onClick={() => { setSelectedCategory('Tất cả'); setSearchQuery(''); setSearchParams({}); }}>Quay lại tất cả</button>
          </div>
        ) : (
          <div>
            {/* Lưới 4 cột chuẩn theo ảnh mẫu */}
            <div className="products-grid-4 animate-fade-in">
              {currentItems.map(product => {
                const inWishlist = wishlistItems.some(w => w._id === product._id);
                const discount = discountOf(product);

                return (
                  <div
                    className="product-card-v4"
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {discount > 0 && <span className="card-sale-badge">-{discount}%</span>}

                    <div className="product-image-container">
                      <img src={product.image} alt={product.name} />
                      <div className="card-hover-actions">
                        <button
                          className={`action-btn-pill wishlist ${inWishlist ? 'active' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); triggerToast(inWishlist ? 'Đã xóa khỏi danh sách yêu thích!' : 'Đã thêm vào danh sách yêu thích!'); }}
                          title="Yêu thích"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill={inWishlist ? '#E53E3E' : 'none'} stroke={inWishlist ? '#E53E3E' : 'currentColor'} strokeWidth="2.5">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>
                        <button
                          className="action-btn-pill cart"
                          onClick={(e) => handleAddToCart(e, product)}
                          title="Mua hàng"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="product-info-container">
                      <h3 className="product-title">{product.name}</h3>
                      <div className="product-price-row">
                        <span className="price-sale">{formatVND(product.salePrice)}</span>
                        {product.originalPrice > product.salePrice && (
                          <span className="price-original">{formatVND(product.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls - Round Buttons y hệt hình chụp mẫu */}
            {totalPages > 1 && (
              <div className="pagination-wrapper animate-fade-in">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {currentPage < totalPages && (
                  <button className="page-btn next" onClick={() => handlePageChange(currentPage + 1)}>
                    &gt;
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-col">
            <h4 className="footer-col-title">VỀ CHÚNG TÔI</h4>
            <p className="footer-col-text">Mypham13.maugiaodien.com chuyên cung cấp các loại tinh dầu thiên nhiên nguyên chất, an toàn cho sức khỏe và thân thiện với môi trường.</p>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">THÔNG TIN LIÊN HỆ</h4>
            <ul className="footer-contact-list">
              <li><span>📞</span> Hotline: 0988.888.888</li>
              <li><span>✉️</span> Email: hello@maugiaodien.com</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">CHÍNH SÁCH</h4>
            <ul className="footer-links">
              <li><Link to="/">Chính sách bảo mật</Link></li>
              <li><Link to="/">Chính sách đổi trả</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">ĐĂNG KÝ NHẬN TIN</h4>
            <p className="footer-col-text">Nhận thông tin khuyến mãi mới nhất từ chúng tôi</p>
            <form className="footer-subscribe" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Nhập email..." className="footer-email-input" />
              <button type="submit" className="footer-subscribe-btn">→</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2023 mypham13.maugiaodien.com. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Products;
