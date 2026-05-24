import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Header from '../components/Header';
import { getImageUrl } from '../utils/image';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { API_URL } = useContext(AuthContext);
  const { addToCart, toggleWishlist, wishlistItems, formatVND } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const demoProducts = [
    { _id: 'dp1', name: 'Tinh dầu Oải Hương (Lavender)', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80', category: 'Tinh dầu đơn', originalPrice: 275000, salePrice: 220000, stock: 45, description: 'Tinh dầu oải hương Lavender nguyên chất 100% nhập khẩu từ Pháp. Mang lại hương thơm dịu nhẹ, giúp thư giãn tinh thần, dễ đi sâu vào giấc ngủ và làm đẹp da hiệu quả.', rating: 5, reviewsCount: 18, isNew: false, isBestSeller: true, details: 'Tinh dầu Oải Hương (Lavender Essential Oil) được chiết xuất từ hoa oải hương tươi bằng phương pháp chưng cất hơi nước. Đây là một trong những loại tinh dầu phổ biến và đa năng nhất trên thế giới. Sản phẩm có mùi hương thảo mộc ngọt ngào, tinh tế giúp giải tỏa căng thẳng thần kinh sau một ngày làm việc mệt mỏi.', usage: 'Khuếch tán: Nhỏ 3-5 giọt vào máy khuếch tán phun sương để xông phòng.\nTắm bồn: Nhỏ 5-10 giọt vào bồn tắm ấm xoa dịu cơ thể.\nMassage: Pha loãng với dầu nền (dầu dừa, dầu ô liu) theo tỷ lệ 1-2% trước khi mát-xa da.' },
    { _id: 'dp2', name: 'Tinh dầu Tràm Trà (Tea Tree)', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80', category: 'Tinh dầu đơn', originalPrice: 225000, salePrice: 180000, stock: 35, description: 'Tinh dầu tràm trà nguyên chất kháng khuẩn cực mạnh. Giúp hỗ trợ trị mụn hiệu quả, làm dịu da nhạy cảm và bảo vệ sức khỏe hệ hô hấp.', rating: 4.8, reviewsCount: 12, isNew: true, isBestSeller: true, details: 'Tinh dầu Tràm Trà (Tea Tree Essential Oil) được chiết xuất từ lá cây tràm trà Úc. Nổi tiếng với khả năng kháng khuẩn, kháng viêm cực tốt, giúp ngăn ngừa và điều trị mụn trứng cá, mụn viêm. Ngoài ra còn hỗ trợ làm sạch gàu và bảo vệ móng khỏe mạnh.', usage: 'Trị mụn: Dùng tăm bông chấm trực tiếp 1 giọt tinh dầu tràm trà lên nốt mụn viêm.\nXông mặt: Nhỏ 2 giọt vào chậu nước nóng, xông mặt trong 5-10 phút để thải độc da.\nGội đầu: Nhỏ 1-2 giọt vào dầu gội thông thường giúp nuôi dưỡng da đầu.' },
    { _id: 'dp3', name: 'Tinh dầu Bạc Hà (Peppermint)', image: 'https://images.unsplash.com/photo-1595981267035-7b04ec82237e?auto=format&fit=crop&w=500&q=80', category: 'Tinh dầu đơn', originalPrice: 200000, salePrice: 160000, stock: 60, description: 'Tinh dầu bạc hà mang lại cảm giác mát lạnh sảng khoái, kích thích tinh thần tập trung cao độ và giảm đau đầu, mệt mỏi tức thì.', rating: 5, reviewsCount: 22, isNew: false, isBestSeller: true, details: 'Tinh dầu Bạc Hà (Peppermint Essential Oil) chứa hàm lượng menthol cực cao, đem lại mùi hương tươi mát, sảng khoái đánh thức mọi giác quan. Phù hợp xông trong không gian làm việc hoặc xe hơi nhằm khử mùi, tăng cường sự tỉnh táo.', usage: 'Khử mùi: Sử dụng máy xông tinh dầu xông phòng khách hoặc phòng làm việc.\nMassage giảm đau: Pha loãng với dầu nền để xoa bóp thái dương giúp giảm đau đầu nhẹ.\nĐuổi côn trùng: Nhỏ vài giọt lên bông gòn đặt ở các góc tủ để đuổi chuột và côn trùng.' },
    { _id: 'dp4', name: 'Tinh dầu Chanh (Lemon)', image: 'https://images.unsplash.com/photo-1536718497578-d01c07ae5f0d?auto=format&fit=crop&w=500&q=80', category: 'Tinh dầu đơn', originalPrice: 190000, salePrice: 150000, stock: 25, description: 'Tinh dầu vỏ chanh vàng nguyên chất, ép lạnh lưu giữ hương thơm ngọt mát, giúp thanh lọc không khí, tăng cường đề kháng và làm sáng da.', rating: 4.7, reviewsCount: 9, isNew: true, isBestSeller: false, details: 'Tinh dầu Chanh (Lemon Essential Oil) được ép lạnh từ vỏ chanh tươi, giữ nguyên hương vị thanh khiết nhất. Hương thơm họ cam chanh đem đến sự vui vẻ, lạc quan, kích thích tuần hoàn máu và hỗ trợ thanh lọc cơ thể tối đa.', usage: 'Xông phòng: Nhỏ 4-6 giọt vào máy khuếch tán để tạo bầu không khí tươi mát, sạch sẽ.\nLau dọn: Pha 10 giọt tinh dầu với nước ấm và giấm trắng để lau chùi bề mặt nhà bếp nhằm sát khuẩn.\nLưu ý: Không tiếp xúc trực tiếp với ánh nắng mặt trời trong vòng 12h sau khi thoa tinh dầu chanh lên da.' },
    { _id: 'dp5', name: 'Tinh dầu Khuynh Diệp (Eucalyptus)', image: 'https://images.unsplash.com/photo-1608571424295-d14c274b126b?auto=format&fit=crop&w=500&q=80', category: 'Tinh dầu đơn', originalPrice: 200000, salePrice: 160000, stock: 50, description: 'Tinh dầu khuynh diệp bảo vệ sức khỏe gia đình, đặc biệt tốt cho trẻ em và người già trong việc giữ ấm và ngăn ngừa cảm cúm.', rating: 4.9, reviewsCount: 15, isNew: false, isBestSeller: true, details: 'Tinh dầu Khuynh Diệp (Eucalyptus Essential Oil) được biết đến rộng rãi với tác dụng hỗ trợ hô hấp, giảm ho, nghẹt mũi và giữ ấm cơ thể. Sản phẩm cực kỳ an toàn, nhẹ dịu và thân thiện với làn da trẻ nhỏ khi được sử dụng đúng cách.', usage: 'Giữ ấm cho bé: Thoa một lượng nhỏ tinh dầu khuynh diệp đã pha loãng vào lòng bàn chân, ngực của trẻ sau khi tắm.\nTắm xông: Nhỏ 3 giọt tinh dầu vào bồn nước ấm tắm cho bé để ngăn cảm lạnh.' },
    { _id: 'dp6', name: 'Tinh dầu Sả Chanh (Lemongrass)', image: 'https://images.unsplash.com/photo-1595981267035-7b04ec82237e?auto=format&fit=crop&w=500&q=80', category: 'Tinh dầu cho sức khỏe', originalPrice: 150000, salePrice: 120000, stock: 80, description: 'Tinh dầu sả chanh giúp giảm stress, khử mùi ẩm mốc cực kỳ hiệu quả và xua đuổi muỗi, côn trùng an toàn cho cả nhà.', rating: 4.9, reviewsCount: 31, isNew: true, isBestSeller: true, details: 'Tinh dầu Sả Chanh mang hương thơm nồng ấm đặc trưng, chứa citral giúp sát khuẩn mạnh mẽ và xua muỗi tối đa. Đây là lựa chọn hoàn hảo hàng đầu cho các hộ gia đình Việt Nam vào mùa mưa nồm.', usage: 'Đuổi muỗi: Xông phòng hàng ngày bằng máy khuếch tán tinh dầu hoặc pha loãng xịt lên rèm cửa, góc tối.\nNgâm chân: Nhỏ 3 giọt tinh dầu vào nước ấm ngâm chân trước khi ngủ giúp lưu thông khí huyết.' },
    { _id: 'dp7', name: 'Máy khuếch tán tinh dầu Premium', image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=500&q=80', category: 'Phụ kiện khuếch tán', originalPrice: 650000, salePrice: 450000, stock: 15, description: 'Máy phun sương khuếch tán tinh dầu cao cấp sử dụng công nghệ sóng siêu âm, giúp giữ nguyên hoạt chất của tinh dầu và bổ sung độ ẩm cho da.', rating: 5, reviewsCount: 6, isNew: false, isBestSeller: false, details: 'Máy khuếch tán tinh dầu Premium được thiết kế với chất liệu nhựa cao cấp vân gỗ sang trọng hoặc gốm tinh xảo, tích hợp đèn LED 7 màu điều khiển thông minh. Máy hoạt động cực kỳ êm ái, thích hợp cho phòng ngủ, phòng khách hoặc spa sang trọng.', usage: 'Đổ nước lọc ấm vào khay chứa của máy đến vạch tối đa (Max).\nNhỏ từ 5-8 giọt tinh dầu thiên nhiên tùy sở thích hương thơm đậm/nhạt.\nĐậy nắp máy chặt, cắm điện và bật nút khởi động phun sương/bật đèn ngủ LED tùy thích.' },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProduct(data);
        fetchRelated(data.category, data._id);
      } catch {
        // Fallback to local storage or demo data
        const local = localStorage.getItem('essential_local_products');
        const list = local ? JSON.parse(local) : demoProducts;
        // Check if there are full details in demo data matching ID or find anyway
        const found = list.find(p => p._id === id) || demoProducts.find(p => p._id === id) || demoProducts[0];
        // Merge detail/usage keys from demo if not present
        const demoDetail = demoProducts.find(dp => dp.name === found.name) || {};
        const enriched = {
          ...found,
          details: found.details || demoDetail.details || 'Thông tin chi tiết đang được cập nhật. Tinh dầu thiên nhiên nguyên chất, an toàn cho sức khỏe và đem lại mùi hương dịu mát cho không gian sống của bạn.',
          usage: found.usage || demoDetail.usage || 'Nhỏ 3-5 giọt vào máy khuếch tán hoặc đèn xông tinh dầu. Thích hợp xông phòng ngủ, phòng khách hoặc văn phòng làm việc.'
        };
        setProduct(enriched);
        fetchRelated(enriched.category, enriched._id, list);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = (category, currentId, customList = null) => {
      let list = [];
      if (customList) {
        list = customList;
      } else {
        const local = localStorage.getItem('essential_local_products');
        list = local ? JSON.parse(local) : demoProducts;
      }
      const related = list.filter(p => p.category === category && p._id !== currentId).slice(0, 4);
      setRelatedProducts(related.length > 0 ? related : list.filter(p => p._id !== currentId).slice(0, 4));
    };

    fetchProduct();
  }, [id, API_URL]);

  if (loading) {
    return (
      <div className="product-detail-loading-page">
        <Header />
        <div className="detail-loading-spinner-container">
          <div className="spinner"></div>
          <p>Đang tải thông tin sản phẩm tinh tế...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error-page">
        <Header />
        <div className="container error-container glass">
          <h2>Oops! Không tìm thấy sản phẩm</h2>
          <p>Sản phẩm bạn đang tìm kiếm có thể đã bị gỡ bỏ hoặc không khả dụng.</p>
          <Link to="/" className="btn btn-primary">Quay về trang chủ</Link>
        </div>
      </div>
    );
  }

  const inWishlist = wishlistItems.some(w => w._id === product._id);
  const discount = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    // Add multiple quantities
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    triggerToast(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng thành công!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/');
    // Trigger drawer on Home
    setTimeout(() => {
      const cartBtn = document.querySelector('.widget-item:nth-child(2)');
      if (cartBtn) cartBtn.click();
    }, 100);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="product-detail-page">
      <Header />

      {/* Toast Notification */}
      {showToast && (
        <div className="custom-toast glass animate-fade-in">
          <span className="toast-icon">✨</span>
          <span className="toast-text">{toastMessage}</span>
          <button className="toast-close" onClick={() => setShowToast(false)}>✕</button>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="breadcrumb-section">
        <div className="container breadcrumbs">
          <Link to="/">Trang chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.category || 'Sản phẩm'}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current-name">{product.name}</span>
        </div>
      </div>

      {/* Main product display */}
      <section className="product-detail-essential container">
        <div className="product-detail-grid">
          
          {/* Left Side: Images */}
          <div className="product-detail-media">
            <div className="main-image-wrapper glass">
              <img src={getImageUrl(product.image)} alt={product.name} className="main-image" />
              {discount > 0 && <span className="detail-sale-badge">Sale -{discount}%</span>}
            </div>
            <div className="thumbnail-gallery">
              <div className="thumbnail-item active glass">
                <img src={getImageUrl(product.image)} alt="" />
              </div>
              {/* Optional dummy thumbnails for high fidelity feel */}
              <div className="thumbnail-item glass">
                <img src="https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=150&q=80" alt="" />
              </div>
              <div className="thumbnail-item glass">
                <img src="https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=150&q=80" alt="" />
              </div>
            </div>
          </div>

          {/* Right Side: Details & Actions */}
          <div className="product-detail-info">
            <span className="info-category-tag">{product.category}</span>
            <h1 className="info-title">{product.name}</h1>
            
            {/* Rating */}
            <div className="info-rating-row">
              <div className="stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`star ${i < Math.floor(product.rating || 5) ? 'filled' : ''}`}>★</span>
                ))}
              </div>
              <span className="rating-text">{(product.rating || 5).toFixed(1)} / 5</span>
              <span className="review-divider">|</span>
              <span className="reviews-count">{product.reviewsCount || 10} đánh giá đã xác thực</span>
            </div>

            {/* Price */}
            <div className="info-price-card glass">
              <div className="prices">
                <span className="detail-sale-price">{formatVND(product.salePrice)}</span>
                {product.originalPrice > product.salePrice && (
                  <span className="detail-original-price">{formatVND(product.originalPrice)}</span>
                )}
              </div>
              {product.originalPrice > product.salePrice && (
                <div className="price-savings">
                  Tiết kiệm: <strong>{formatVND(product.originalPrice - product.salePrice)}</strong> ({discount}%)
                </div>
              )}
            </div>

            {/* Description brief */}
            <p className="info-brief">{product.description}</p>

            {/* Specs / Stock */}
            <div className="info-specs-list">
              <div className="spec-item">
                <span className="spec-label">Tình trạng:</span>
                <span className={`spec-value ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? `Còn hàng (${product.stock} sản phẩm)` : 'Tạm hết hàng'}
                </span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Dung tích:</span>
                <span className="spec-value">10ml / 30ml / 50ml</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Xuất xứ:</span>
                <span className="spec-value">Nhập khẩu chính ngạch 100% thiên nhiên</span>
              </div>
            </div>

            {/* Quantity Selector & Add Actions */}
            {product.stock > 0 ? (
              <div className="info-actions-section">
                <div className="quantity-selection-wrapper">
                  <span className="label">Số lượng:</span>
                  <div className="quantity-control-pill">
                    <button className="q-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                    <span className="q-val">{quantity}</span>
                    <button className="q-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                  </div>
                </div>

                <div className="actions-buttons-row">
                  <button className="btn btn-add-cart" onClick={handleAddToCart}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginRight: '8px'}}>
                      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    THÊM VÀO GIỎ HÀNG
                  </button>
                  <button className="btn btn-buy-now-gradient" onClick={handleBuyNow}>
                    🚀 MUA NGAY
                  </button>
                  <button className={`btn-wishlist-toggle ${inWishlist ? 'active' : ''}`} onClick={() => { toggleWishlist(product); triggerToast(inWishlist ? 'Đã xóa sản phẩm khỏi danh sách yêu thích!' : 'Đã thêm sản phẩm vào danh sách yêu thích!'); }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? '#E53E3E' : 'none'} stroke={inWishlist ? '#E53E3E' : 'currentColor'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="out-of-stock-alert glass">
                <span>🍃 Hàng đang trên đường về! Nhấn "Liên hệ" để đặt trước.</span>
                <Link to="/" className="btn btn-secondary" style={{marginTop: '10px', display: 'inline-block'}}>Liên hệ tư vấn</Link>
              </div>
            )}

            {/* Extra trust badges */}
            <div className="trust-badges-grid glass">
              <div className="badge-item">
                <span className="badge-icon">🛡️</span>
                <span className="badge-text">Cam kết 100% nguyên chất</span>
              </div>
              <div className="badge-item">
                <span className="badge-icon">🚚</span>
                <span className="badge-text">Giao nhanh toàn quốc</span>
              </div>
              <div className="badge-item">
                <span className="badge-icon">🔄</span>
                <span className="badge-text">Đổi trả 7 ngày dễ dàng</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tabs description / Usage / Reviews */}
      <section className="product-extra-tabs container">
        <div className="tabs-header-bar glass">
          {[
            { id: 'description', label: 'CHI TIẾT SẢN PHẨM' },
            { id: 'usage', label: 'HƯỚNG DẪN SỬ DỤNG' },
            { id: 'reviews', label: `ĐÁNH GIÁ (${product.reviewsCount || 10})` }
          ].map(tab => (
            <button key={tab.id} className={`tab-header-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tabs-content-box glass">
          {activeTab === 'description' && (
            <div className="tab-pane animate-fade-in">
              <h3>Về sản phẩm {product.name}</h3>
              <p style={{lineHeight: '1.8', whiteSpace: 'pre-line'}}>{product.details}</p>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="tab-pane animate-fade-in">
              <h3>Các phương pháp sử dụng tối ưu</h3>
              <p style={{lineHeight: '1.8', whiteSpace: 'pre-line'}}>{product.usage}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="tab-pane animate-fade-in reviews-pane">
              <h3>Phản hồi từ khách hàng</h3>
              <div className="reviews-summary-box">
                <div className="summary-left">
                  <h2>{(product.rating || 5).toFixed(1)}</h2>
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`star ${i < Math.floor(product.rating || 5) ? 'filled' : ''}`}>★</span>
                    ))}
                  </div>
                  <span>Trung bình {product.reviewsCount || 10} đánh giá</span>
                </div>
                <div className="summary-right">
                  {/* Visual 5-star bars */}
                  {[
                    { stars: 5, pct: '85%' },
                    { stars: 4, pct: '10%' },
                    { stars: 3, pct: '5%' },
                    { stars: 2, pct: '0%' },
                    { stars: 1, pct: '0%' },
                  ].map((bar, i) => (
                    <div className="rating-bar-row" key={i}>
                      <span className="num">{bar.stars} ★</span>
                      <div className="bar-bg"><div className="bar-fill" style={{width: bar.pct}}></div></div>
                      <span className="pct">{bar.pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample reviews */}
              <div className="reviews-list">
                <div className="review-item glass">
                  <div className="review-meta">
                    <span className="author">Thành Vũ</span>
                    <span className="stars">★★★★★</span>
                    <span className="date">22/05/2026</span>
                  </div>
                  <p className="comment">Mùi thơm dịu nhẹ, xông phòng ngủ cực kỳ thư giãn luôn. Đóng gói rất chắc chắn, giao hàng siêu nhanh. Sẽ ủng hộ shop tiếp tục!</p>
                </div>
                <div className="review-item glass">
                  <div className="review-meta">
                    <span className="author">Khánh Vy</span>
                    <span className="stars">★★★★★</span>
                    <span className="date">15/05/2026</span>
                  </div>
                  <p className="comment">Tinh dầu đúng là 100% tự nhiên nguyên chất, ngửi là biết ngay không có hương liệu nhân tạo hóa học. Rất ưng ý!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      <section className="related-products-section container">
        <div className="section-title-row">
          <h2 className="section-title">Sản Phẩm Cùng Loại</h2>
        </div>
        <div className="products-grid-5">
          {relatedProducts.map(p => {
            const inW = wishlistItems.some(w => w._id === p._id);
            const disc = Math.round(((p.originalPrice - p.salePrice) / p.originalPrice) * 100);
            return (
              <div className="product-card-v2" key={p._id} onClick={() => navigate(`/product/${p._id}`)} style={{cursor: 'pointer'}}>
                {disc > 0 && <span className="badge badge-sale">-{disc}%</span>}
                <div className="product-img-box">
                  <img src={getImageUrl(p.image)} alt={p.name} />
                </div>
                <div className="product-card-v2-info">
                  <h3 className="product-v2-name">{p.name}</h3>
                  <div className="product-v2-price">
                    <span className="sale-price">{formatVND(p.salePrice)}</span>
                    {p.originalPrice > p.salePrice && <span className="original-price">{formatVND(p.originalPrice)}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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

export default ProductDetail;
