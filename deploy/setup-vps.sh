#!/bin/bash
# ============================================
# Script cài đặt VPS cho Tinh Dầu Web
# Chạy lần đầu sau khi SSH vào VPS (Ubuntu)
# Usage: bash setup-vps.sh
# ============================================

set -e

echo "============================================"
echo "🚀 THIẾT LẬP VPS CHO TINH DẦU WEB"
echo "============================================"

# --- 1. Cập nhật hệ thống ---
echo ""
echo "📦 [1/7] Cập nhật hệ thống..."
sudo apt update && sudo apt upgrade -y

# --- 2. Cài đặt Node.js 20 ---
echo ""
echo "📦 [2/7] Cài đặt Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
echo "   ✅ Node.js $(node -v) | npm $(npm -v)"

# --- 3. Cài đặt công cụ ---
echo ""
echo "📦 [3/7] Cài đặt Nginx, PM2, Git, Certbot..."
sudo apt install -y nginx git certbot python3-certbot-nginx unzip
sudo npm install -g pm2
echo "   ✅ Nginx, PM2, Git, Certbot đã cài"

# --- 4. Cấu hình Firewall ---
echo ""
echo "🔒 [4/7] Cấu hình Firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
echo "y" | sudo ufw enable
echo "   ✅ Firewall đã bật (SSH + Nginx)"

# --- 5. Tạo thư mục dự án ---
echo ""
echo "📂 [5/7] Tạo thư mục dự án..."
sudo mkdir -p /var/www/tinh-dau-web
sudo chown -R $USER:$USER /var/www/tinh-dau-web
echo "   ✅ /var/www/tinh-dau-web đã tạo"

# --- 6. Hướng dẫn tiếp theo ---
echo ""
echo "============================================"
echo "✅ THIẾT LẬP CƠ BẢN HOÀN TẤT!"
echo "============================================"
echo ""
echo "📋 CÁC BƯỚC TIẾP THEO:"
echo ""
echo "  1. Upload code lên VPS:"
echo "     cd /var/www/tinh-dau-web"
echo "     git clone <YOUR_REPO_URL> ."
echo ""
echo "  2. Cài dependencies & build:"
echo "     bash /var/www/tinh-dau-web/deploy/deploy.sh"
echo ""
echo "  3. Copy Nginx config:"
echo "     sudo cp /var/www/tinh-dau-web/deploy/nginx-tinhdau.conf /etc/nginx/sites-available/tinhdau"
echo "     sudo ln -s /etc/nginx/sites-available/tinhdau /etc/nginx/sites-enabled/"
echo "     sudo rm -f /etc/nginx/sites-enabled/default"
echo "     sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "  4. Trỏ DNS A Record về IP VPS này"
echo ""
echo "  5. Cài SSL (sau khi DNS đã trỏ):"
echo "     sudo certbot --nginx -d tinhdautramhuonggiang.com.vn -d www.tinhdautramhuonggiang.com.vn"
echo ""
echo "============================================"
