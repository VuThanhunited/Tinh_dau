#!/bin/bash
# ============================================
# Script Deploy/Update Tinh Dầu Web
# Chạy mỗi khi cần update code
# Usage: bash deploy.sh
# ============================================

set -e

PROJECT_DIR="/var/www/tinh-dau-web"

echo "============================================"
echo "🚀 DEPLOY TINH DẦU WEB"
echo "   $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

cd "$PROJECT_DIR"

# --- 1. Pull code mới ---
echo ""
echo "📥 [1/4] Pulling latest code..."
git pull origin main
echo "   ✅ Code đã cập nhật"

# --- 2. Build Frontend ---
echo ""
echo "📦 [2/4] Building Frontend..."
cd "$PROJECT_DIR/frontend"
npm install --production=false
npm run build
echo "   ✅ Frontend build thành công → dist/"

# --- 3. Build Admin ---
echo ""
echo "📦 [3/4] Building Admin..."
cd "$PROJECT_DIR/admin"
npm install --production=false
npm run build
echo "   ✅ Admin build thành công → dist/"

# --- 4. Restart Backend ---
echo ""
echo "🔄 [4/4] Restarting Backend..."
cd "$PROJECT_DIR/backend"
npm install --production

# Kiểm tra PM2 process đã tồn tại chưa
if pm2 describe tinhdau-api > /dev/null 2>&1; then
    pm2 restart tinhdau-api
    echo "   ✅ Backend đã restart"
else
    pm2 start server.js --name "tinhdau-api"
    pm2 save
    echo "   ✅ Backend đã khởi động lần đầu"
fi

# --- Kết quả ---
echo ""
echo "============================================"
echo "✅ DEPLOY HOÀN TẤT!"
echo "============================================"
echo ""
pm2 status
echo ""
echo "🌐 Frontend: https://tinhdautramhuonggiang.com.vn"
echo "🔧 Admin:    https://tinhdautramhuonggiang.com.vn/admin"
echo "📡 API:      https://tinhdautramhuonggiang.com.vn/api"
echo ""
