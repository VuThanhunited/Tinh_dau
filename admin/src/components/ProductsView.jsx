import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getImageUrl } from '../utils/image';
import './ProductsView.css';

const ProductsView = ({ API_URL, user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentProductId, setCurrentProductId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    image: 'http://localhost:5000/img/download.jpg',
    category: 'Tinh dầu đơn',
    originalPrice: '',
    salePrice: '',
    stock: 50,
    description: '',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
  });

  const categoriesList = [
    'Tinh dầu đơn',
    'Tinh dầu blend',
    'Tinh dầu cho sức khỏe',
    'Tinh dầu cho làm đẹp',
    'Tinh dầu cho không gian',
    'Phụ kiện khuếch tán',
    'Bộ quà tặng'
  ];

  const demoProducts = [
    { _id: 'dp1', name: 'Tinh dầu Oải Hương (Lavender)', image: 'http://localhost:5000/img/download (8).jpg', category: 'Tinh dầu đơn', originalPrice: 275000, salePrice: 220000, stock: 50, description: 'Tinh dầu oải hương Lavender nguyên chất nhập khẩu Pháp.' },
    { _id: 'dp2', name: 'Tinh dầu Tràm Trà (Tea Tree)', image: 'http://localhost:5000/img/download (9).jpg', category: 'Tinh dầu đơn', originalPrice: 225000, salePrice: 180000, stock: 45, description: 'Tinh dầu tràm trà Úc nguyên chất kháng khuẩn.' },
    { _id: 'dp3', name: 'Tinh dầu Bạc Hà (Peppermint)', image: 'http://localhost:5000/img/download (10).jpg', category: 'Tinh dầu đơn', originalPrice: 200000, salePrice: 160000, stock: 35, description: 'Tinh dầu bạc hà mang lại cảm giác mát lạnh.' },
    { _id: 'dp4', name: 'Combo dầu gội Naciva 1', image: 'http://localhost:5000/img/download.jpg', category: 'Bộ quà tặng', originalPrice: 395000, salePrice: 325000, stock: 45, description: 'Combo dầu gội thảo dược chuyên sâu Naciva 1.' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error('Không thể kết nối API');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.warn('API error, falling back to local storage or demo data:', err.message);
      const local = localStorage.getItem('essential_local_products');
      if (local) {
        setProducts(JSON.parse(local));
      } else {
        setProducts(demoProducts);
        localStorage.setItem('essential_local_products', JSON.stringify(demoProducts));
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerToast = (type, msg) => {
    if (type === 'success') {
      setSuccess(msg);
      setTimeout(() => setSuccess(null), 3500);
    } else {
      setError(msg);
      setTimeout(() => setError(null), 3500);
    }
  };

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentProductId(null);
    setFormData({
      name: '',
      image: 'http://localhost:5000/img/download.jpg',
      category: 'Tinh dầu đơn',
      originalPrice: '',
      salePrice: '',
      stock: 50,
      description: '',
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (product) => {
    setModalMode('edit');
    setCurrentProductId(product._id);
    setFormData({
      name: product.name,
      image: product.image,
      category: product.category,
      originalPrice: product.originalPrice,
      salePrice: product.salePrice,
      stock: product.stock,
      description: product.description || '',
      isFeatured: product.isFeatured || false,
      isNewArrival: product.isNewArrival || false,
      isBestSeller: product.isBestSeller || false,
    });
    setIsModalOpen(true);
  };

  // Submit Form Add/Edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Simple validation
    if (!formData.name || !formData.image || !formData.originalPrice || !formData.salePrice) {
      triggerToast('error', 'Vui lòng nhập đầy đủ các trường bắt buộc (*)');
      return;
    }

    const payload = {
      ...formData,
      originalPrice: Number(formData.originalPrice),
      salePrice: Number(formData.salePrice),
      stock: Number(formData.stock)
    };

    setLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      };

      if (modalMode === 'create') {
        // API Create Product
        const response = await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Thêm sản phẩm thất bại');
        
        setProducts([data, ...products]);
        triggerToast('success', `Đã thêm sản phẩm "${payload.name}" thành công!`);
      } else {
        // API Update Product
        const response = await fetch(`${API_URL}/products/${currentProductId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Cập nhật thất bại');
        
        setProducts(products.map(p => p._id === currentProductId ? data : p));
        triggerToast('success', `Đã cập nhật sản phẩm "${payload.name}" thành công!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Lỗi CRUD sản phẩm:", err.message);
      triggerToast('error', `Thao tác thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}" khỏi cơ sở dữ liệu?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products/${product._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) throw new Error('Xóa sản phẩm thất bại');
      
      setProducts(products.filter(p => p._id !== product._id));
      triggerToast('success', `Đã xóa sản phẩm "${product.name}" thành công.`);
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err.message);
      triggerToast('error', `Xóa sản phẩm thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Form Inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Filter products by search and category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'Tất cả' || p.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(num).replace('₫', 'đ');
  };

  return (
    <div className="admin-products-view animate-fade-in">
      
      {/* Toast Alert Banner */}
      {success && (
        <div className="auth-alert success fixed-alert animate-fade-in">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="auth-alert error fixed-alert animate-fade-in">
          ⚠️ {error}
        </div>
      )}

      {/* View Header */}
      <div className="admin-view-header-row">
        <div className="admin-view-header">
          <h2 className="admin-view-title">QUẢN LÝ SẢN PHẨM</h2>
          <p className="admin-view-subtitle">Thêm mới, sửa đổi thông tin hoặc xóa các sản phẩm tinh dầu, dầu gội.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          ➕ Thêm sản phẩm mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filters-bar glass">
        {/* Search */}
        <div className="filter-input-wrapper">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mô tả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
          />
        </div>

        {/* Category Select */}
        <div className="filter-select-wrapper">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
          >
            <option value="Tất cả">Tất cả danh mục</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table grid */}
      <div className="admin-table-container">
        {filteredProducts.length === 0 ? (
          <p className="no-data-text">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá khuyến mãi</th>
                <th>Giá gốc</th>
                <th>Kho hàng</th>
                <th>Nhãn hiển thị</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p._id}>
                  <td>
                    <img src={getImageUrl(p.image)} alt={p.name} className="product-thumb-img" />
                  </td>
                  <td>
                    <div className="product-table-name-desc">
                      <span className="product-table-name">{p.name}</span>
                      <span className="product-table-desc" title={p.description}>{p.description}</span>
                    </div>
                  </td>
                  <td>
                    <span className="product-table-category">{p.category}</span>
                  </td>
                  <td>
                    <strong className="product-table-price-sale">{formatVND(p.salePrice)}</strong>
                  </td>
                  <td>
                    <span className="product-table-price-orig">{formatVND(p.originalPrice)}</span>
                  </td>
                  <td>
                    <span className={`product-table-stock ${p.stock < 15 ? 'warning' : ''}`}>
                      {p.stock} sản phẩm
                    </span>
                  </td>
                  <td>
                    <div className="product-badges-row">
                      {p.isFeatured && <span className="p-badge featured">Featured</span>}
                      {p.isNewArrival && <span className="p-badge new">New</span>}
                      {p.isBestSeller && <span className="p-badge best">Bestseller</span>}
                    </div>
                  </td>
                  <td>
                    <div className="product-table-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEditModal(p)}>
                        ✏️ Sửa
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p)}>
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Dialog for Add / Edit */}
      {isModalOpen && createPortal(
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {modalMode === 'create' ? '➕ THÊM SẢN PHẨM MỚI' : '✏️ CẬP NHẬT SẢN PHẨM'}
              </h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {/* Product Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="m-name">Tên sản phẩm *</label>
                  <input
                    type="text"
                    id="m-name"
                    name="name"
                    className="form-input"
                    placeholder="Combo dầu gội thảo dược cao cấp..."
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Category & Image Row */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="m-cat">Danh mục *</label>
                    <select
                      id="m-cat"
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categoriesList.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="m-stock">Số lượng tồn kho *</label>
                    <input
                      type="number"
                      id="m-stock"
                      name="stock"
                      className="form-input"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Prices Row */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="m-orig">Giá gốc (VND) *</label>
                    <input
                      type="number"
                      id="m-orig"
                      name="originalPrice"
                      className="form-input"
                      placeholder="e.g. 290000"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="m-sale">Giá khuyến mãi (VND) *</label>
                    <input
                      type="number"
                      id="m-sale"
                      name="salePrice"
                      className="form-input"
                      placeholder="e.g. 230000"
                      value={formData.salePrice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Image Path */}
                <div className="form-group">
                  <label className="form-label" htmlFor="m-img">Đường dẫn ảnh sản phẩm *</label>
                  <input
                    type="text"
                    id="m-img"
                    name="image"
                    className="form-input"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label" htmlFor="m-desc">Mô tả sản phẩm</label>
                  <textarea
                    id="m-desc"
                    name="description"
                    className="form-textarea"
                    placeholder="Mô tả chi tiết về sản phẩm tinh dầu, hương thơm, công dụng..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Badges selection switches */}
                <div className="checkboxes-wrapper-row">
                  <label className="form-checkbox-row">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      className="form-checkbox"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                    />
                    <span>Sản phẩm Nổi bật (Featured)</span>
                  </label>

                  <label className="form-checkbox-row">
                    <input
                      type="checkbox"
                      name="isNewArrival"
                      className="form-checkbox"
                      checked={formData.isNewArrival}
                      onChange={handleInputChange}
                    />
                    <span>Sản phẩm Mới (New)</span>
                  </label>

                  <label className="form-checkbox-row">
                    <input
                      type="checkbox"
                      name="isBestSeller"
                      className="form-checkbox"
                      checked={formData.isBestSeller}
                      onChange={handleInputChange}
                    />
                    <span>Bán chạy (Best seller)</span>
                  </label>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'create' ? 'Lưu sản phẩm' : 'Cập nhật sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProductsView;
