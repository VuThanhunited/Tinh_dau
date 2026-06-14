import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './UsersView.css';

const UsersView = ({ API_URL, user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentUserId, setCurrentUserId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client',
  });

  const demoUsers = [
    { _id: 'du1', username: 'admin_demo', email: 'admin@gmail.com', role: 'admin', createdAt: '2026-05-01T08:00:00.000Z' },
    { _id: 'du2', username: 'vuthanhcong', email: 'congvu@gmail.com', role: 'client', createdAt: '2026-05-15T12:30:00.000Z' },
    { _id: 'du3', username: 'nguyenlan', email: 'lanny@gmail.com', role: 'client', createdAt: '2026-05-18T15:45:00.000Z' },
    { _id: 'du4', username: 'tiendung', email: 'dungpham@gmail.com', role: 'client', createdAt: '2026-05-20T09:15:00.000Z' },
    { _id: 'du5', username: 'thanhhang', email: 'hangt@gmail.com', role: 'client', createdAt: '2026-05-22T14:20:00.000Z' }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!res.ok) throw new Error('Không thể kết nối API');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.warn('API error fetching users, falling back to localStorage/demo data:', err.message);
      const local = localStorage.getItem('essential_local_users');
      if (local) {
        setUsers(JSON.parse(local));
      } else {
        setUsers(demoUsers);
        localStorage.setItem('essential_local_users', JSON.stringify(demoUsers));
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

  // Open modal for Create User
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentUserId(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'client',
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit User
  const handleOpenEditModal = (targetUser) => {
    setModalMode('edit');
    setCurrentUserId(targetUser._id);
    setFormData({
      username: targetUser.username,
      email: targetUser.email,
      password: '', // blank password for editing
      role: targetUser.role,
    });
    setIsModalOpen(true);
  };

  // Submit Form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Simple validation
    if (!formData.username || !formData.email || (modalMode === 'create' && !formData.password)) {
      triggerToast('error', 'Vui lòng điền đầy đủ thông tin bắt buộc (*).');
      return;
    }

    setLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      };

      if (modalMode === 'create') {
        // API Create User
        const response = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers,
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Thêm người dùng thất bại');

        setUsers([data, ...users]);
        triggerToast('success', `Đã tạo tài khoản "${formData.username}" thành công!`);
      } else {
        // API Update User (Role only or other modified fields)
        const payload = {
          username: formData.username,
          email: formData.email,
          role: formData.role
        };
        // only send password if provided
        if (formData.password) {
          payload.password = formData.password;
        }

        const response = await fetch(`${API_URL}/users/${currentUserId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Cập nhật tài khoản thất bại');

        setUsers(users.map(u => u._id === currentUserId ? data : u));
        triggerToast('success', `Đã cập nhật thông tin tài khoản "${formData.username}" thành công!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Lỗi CRUD người dùng:", err.message);
      triggerToast('error', `Thao tác thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (targetUser) => {
    // Avoid self-deletion!
    if (targetUser._id === user._id) {
      triggerToast('error', 'Bạn không thể tự xóa tài khoản quản trị của chính mình!');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản "${targetUser.username}" khỏi hệ thống?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/${targetUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) throw new Error('Xóa tài khoản thất bại');

      setUsers(users.filter(u => u._id !== targetUser._id));
      triggerToast('success', `Đã xóa tài khoản "${targetUser.username}" thành công.`);
    } catch (err) {
      console.error("Lỗi xóa người dùng:", err.message);
      triggerToast('error', `Xóa tài khoản thất bại: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Filter users by search query
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (isoString) => {
    if (!isoString) return 'Chưa rõ';
    return new Date(isoString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-users-view animate-fade-in">

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

      {/* Header Row */}
      <div className="admin-view-header-row">
        <div className="admin-view-header">
          <h2 className="admin-view-title">QUẢN LÝ NGƯỜI DÙNG</h2>
          <p className="admin-view-subtitle">Kiểm soát danh sách tài khoản khách hàng, cộng tác viên và nhân sự quản trị hệ thống.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          ➕ Tạo tài khoản nhân sự
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filters-bar glass">
        <div className="filter-input-wrapper">
          <input
            type="text"
            placeholder="Tìm kiếm tài khoản theo username hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {/* Users table */}
      <div className="admin-table-container">
        {filteredUsers.length === 0 ? (
          <p className="no-data-text">Không tìm thấy tài khoản người dùng nào.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh Đại Diện</th>
                <th>Username</th>
                <th>Địa chỉ Email</th>
                <th>Phân Quyền (Role)</th>
                <th>Ngày Tạo Tài Khoản</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="user-table-avatar">👤</div>
                  </td>
                  <td>
                    <strong className="user-table-username">{u.username}</strong>
                  </td>
                  <td>
                    <span className="user-table-email">{u.email}</span>
                  </td>
                  <td>
                    <span className={`user-table-role-badge ${u.role}`}>
                      {u.role === 'admin' ? '🛡️ Administrator' : '👥 Client'}
                    </span>
                  </td>
                  <td>
                    <span className="user-table-date">{formatDate(u.createdAt)}</span>
                  </td>
                  <td>
                    <div className="product-table-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEditModal(u)}>
                        ✏️ Sửa
                      </button>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleDeleteUser(u)}
                        disabled={u._id === user._id}
                        title={u._id === user._id ? "Bạn không thể tự xóa tài khoản của mình" : ""}
                      >
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
                {modalMode === 'create' ? '➕ TẠO TÀI KHOẢN MỚI' : '✏️ CẬP NHẬT TÀI KHOẢN'}
              </h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {/* Username */}
                <div className="form-group">
                  <label className="form-label" htmlFor="u-username">Tên tài khoản (Username) *</label>
                  <input
                    type="text"
                    id="u-username"
                    name="username"
                    className="form-input"
                    placeholder="e.g. nguyenvanb"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="form-group">
                  <label className="form-label" htmlFor="u-email">Địa chỉ Email *</label>
                  <input
                    type="email"
                    id="u-email"
                    name="email"
                    className="form-input"
                    placeholder="e.g. nguyenvanb@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="form-group">
                  <label className="form-label" htmlFor="u-password">
                    Mật khẩu {modalMode === 'edit' ? '(Để trống nếu không muốn đổi)' : '*'}
                  </label>
                  <input
                    type="password"
                    id="u-password"
                    name="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={modalMode === 'create'}
                  />
                </div>

                {/* Phân quyền */}
                <div className="form-group">
                  <label className="form-label" htmlFor="u-role">Vai trò quyền hạn *</label>
                  <select
                    id="u-role"
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="client">Client (Khách hàng thông thường)</option>
                    <option value="admin">Admin (Quản trị viên toàn quyền)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'create' ? 'Lưu tài khoản' : 'Cập nhật tài khoản'}
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

export default UsersView;
