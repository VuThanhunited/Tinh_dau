# HƯỚNG DẪN DEPLOY DỰ ÁN TINH DẦU WEB LÊN VPS UBUNTU

Tài liệu này hướng dẫn chi tiết từng bước để thiết lập VPS mới và deploy dự án **Tinh dầu Web** (Frontend, Admin, Backend) bằng thông tin VPS của bạn.

---

## 📌 THÔNG TIN VPS CỦA BẠN
*   **IP VPS:** `45.251.114.156`
*   **Port SSH:** `22`
*   **Username:** `root`
*   **Password:** `a1ab96bb85ef`
*   **Domain đã cấu hình:** `tinhdautramhuonggiang.com.vn` và `www.tinhdautramhuonggiang.com.vn`

---

## 🛠️ QUY TRÌNH DEPLOY CHI TIẾT (5 BƯỚC)

### BƯỚC 1: Kết nối SSH vào VPS
Sử dụng **Terminal** (macOS/Linux) hoặc **Command Prompt/PowerShell/PuTTY/MobaXterm** (Windows) và chạy lệnh sau:

```bash
ssh root@45.251.114.156 -p 22
```
*Hệ thống sẽ hỏi mật khẩu, hãy copy và dán vào:* `a1ab96bb85ef` *(khi nhập mật khẩu trên terminal sẽ không hiện ký tự, cứ dán rồi nhấn Enter).*

---

### BƯỚC 2: Cài đặt môi trường VPS (Chỉ cần làm 1 lần đầu)
Sau khi đã SSH thành công vào server, hãy chạy các lệnh sau để tải và chạy script tự động cài đặt các công cụ cần thiết (Node.js 20, Nginx, PM2, Git, Certbot):

1. Tải script cài đặt trực tiếp từ Github của bạn:
   ```bash
   curl -o setup-vps.sh https://raw.githubusercontent.com/VuThanhunited/Tinh_dau/main/deploy/setup-vps.sh
   ```

2. Chạy script cài đặt:
   ```bash
   bash setup-vps.sh
   ```
   *Script này sẽ tự động:*
   *   Cập nhật hệ thống Ubuntu.
   *   Cài đặt Node.js v20 LTS và npm.
   *   Cài đặt Nginx, PM2 (quản lý backend), Git, Certbot (cài SSL).
   *   Cấu hình Firewall (chỉ mở cổng SSH, HTTP 80, HTTPS 443).
   *   Tạo thư mục dự án `/var/www/tinh-dau-web` với quyền hạn phù hợp.

---

### BƯỚC 3: Clone Code về VPS và cấu hình Environment
1. Di chuyển vào thư mục `/var/www/` và clone dự án về:
   ```bash
   cd /var/www
   rm -rf tinh-dau-web # Xóa thư mục cũ nếu có trước đó
   git clone https://github.com/VuThanhunited/Tinh_dau.git tinh-dau-web
   cd tinh-dau-web
   ```

2. Tạo file môi trường `.env` cho Backend:
   ```bash
   nano backend/.env
   ```
   *Copy toàn bộ nội dung dưới đây và dán vào cửa sổ nano:*
   ```env
   PORT=5000
   MONGODB_URI=mongodb://vtu21102000:Vuthanh1810%40@ac-hjrte0y-shard-00-01.7t35nab.mongodb.net:27017/tinhdau_db?ssl=true&authSource=admin
   JWT_SECRET=essential_oil_jwt_secret_token_987654321
   NODE_ENV=production
   GEMINI_API_KEY=AIzaSyD-1JIPcsWsAyPpXQ4F5po3Ww6atcYPfdI
   ```
   *(Nhấn `Ctrl + O` -> `Enter` để lưu, nhấn `Ctrl + X` để thoát).*

---

### BƯỚC 4: Cấu hình Nginx Web Server
Nginx sẽ đóng vai trò chuyển tiếp yêu cầu (Reverse Proxy) và phân phối các file tĩnh của Frontend và Admin Panel.

1. Copy file cấu hình Nginx từ thư mục deploy vào thư mục cấu hình của Nginx:
   ```bash
   cp /var/www/tinh-dau-web/deploy/nginx-tinhdau.conf /etc/nginx/sites-available/tinhdau
   ```

2. Tạo liên kết (Symlink) để kích hoạt cấu hình này:
   ```bash
   ln -sf /etc/nginx/sites-available/tinhdau /etc/nginx/sites-enabled/
   ```

3. Xóa file cấu hình mặc định (default) của Nginx để tránh xung đột:
   ```bash
   rm -f /etc/nginx/sites-enabled/default
   ```

4. Kiểm tra cấu hình Nginx xem có lỗi gì không:
   ```bash
   nginx -t
   ```
   *(Nếu hiện `syntax is ok` và `test is successful` thì đã cấu hình đúng).*

5. Khởi động lại Nginx:
   ```bash
   systemctl reload nginx
   ```

---

### BƯỚC 5: Build và Start Dự Án
Chạy script deploy đã được chuẩn bị sẵn để tự động cài đặt thư viện cho Frontend, Admin, Backend, build code và chạy Backend thông qua PM2:

```bash
bash /var/www/tinh-dau-web/deploy/deploy.sh
```

Sau khi chạy xong, Backend sẽ chạy ngầm bằng PM2 và hiển thị bảng trạng thái. Bạn có thể kiểm tra danh sách dịch vụ đang chạy bằng lệnh:
```bash
pm2 status
```

---

## 🔒 BƯỚC BỔ SUNG: Cài đặt SSL miễn phí (HTTPS)
> **Lưu ý quan trọng:** Bạn phải trỏ DNS tên miền `tinhdautramhuonggiang.com.vn` và `www.tinhdautramhuonggiang.com.vn` về IP `45.251.114.156` trước khi thực hiện bước này.

Sau khi đã trỏ DNS thành công, chạy lệnh dưới đây để cài đặt chứng chỉ SSL tự động thông qua Let's Encrypt:
```bash
certbot --nginx -d tinhdautramhuonggiang.com.vn -d www.tinhdautramhuonggiang.com.vn
```
*Certbot sẽ hỏi bạn email (nhập email bất kỳ để nhận thông báo hết hạn) và hỏi bạn đồng ý điều khoản dịch vụ (chọn `Y`). Sau khi hoàn thành, website của bạn sẽ tự động chuyển hướng sang giao thức HTTPS an toàn.*

---

## 🚀 CÁCH CẬP NHẬT CODE SAU NÀY (UPDATE CODE)
Mỗi lần bạn code xong ở máy cá nhân và push lên GitHub, chỉ cần SSH vào VPS và chạy lệnh duy nhất sau để cập nhật code mới lên web:

```bash
cd /var/www/tinh-dau-web && bash deploy/deploy.sh
```
Script sẽ tự động lấy code mới từ Github về, cài đặt package mới nếu có, build lại frontend & admin và restart lại backend API.
