# Smart Restaurant Admin - Frontend

Giao diện quản trị cho hệ thống nhà hàng thông minh, xây dựng với React và Vite.

## 🚀 Công nghệ sử dụng

-  **React 19.2.0** - UI Library
-  **Vite 7.2.4** - Build tool
-  **TypeScript** - Type safety
-  **Tailwind CSS 4.1.18** - Styling
-  **React Router 7.11.0** - Routing
-  **Axios** - HTTP client
-  **React Query (TanStack Query)** - Data fetching
-  **React Hook Form** - Form handling
-  **Zod** - Validation
-  **Lucide React** - Icons
-  **React QR Code** - QR display

## 📋 Yêu cầu cài đặt

-  Node.js >= 18.x
-  npm hoặc yarn
-  Backend đã chạy tại `http://localhost:3000`

## ⚙️ Cài đặt

### 1. Vào thư mục frontend:

```bash
cd web-smart-restaurant-admin-fe
```

### 2. Cài đặt dependencies:

```bash
npm install
```

### 3. Cấu hình API URL (optional):

Mặc định frontend gọi API tại `http://localhost:3000/api/admin`

Nếu muốn đổi, sửa file `src/api/axios.ts`:

```typescript
const api = axios.create({
   baseURL: "http://localhost:3000/api/admin", // Đổi URL tại đây
   withCredentials: true,
});
```

## 🏃 Chạy ứng dụng

### Development mode:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### Build production:

```bash
npm run build
```

### Preview production build:

```bash
npm run preview
```

## 🔑 Đăng nhập

Sau khi đăng ký admin ở backend, đăng nhập với:

-  **URL**: `http://localhost:5173/login`
-  **Username**: `admin` (hoặc username bạn đã tạo)
-  **Password**: `admin123` (hoặc password bạn đã đặt)

## 📱 Chức năng chính

### 1. Quản lý bàn

-  ➕ Tạo bàn mới (table number, capacity, location)
-  📋 Xem danh sách bàn dạng lưới
-  ✏️ Chỉnh sửa thông tin bàn
-  🔄 Đổi trạng thái Active/Inactive
-  🗑️ Vô hiệu hóa bàn (soft delete)

### 2. Quản lý QR Code

-  🎯 Tạo QR code cho từng bàn
-  👁️ Xem preview QR code
-  📥 Tải QR code dạng PNG hoặc PDF
-  📦 Tải tất cả QR code (ZIP file)
-  🔄 Regenerate QR code (từng bàn hoặc tất cả)

### 3. Các tính năng khác

-  🔐 Đăng nhập/Đăng xuất
-  🔄 Auto refresh token khi hết hạn
-  📊 Thống kê tổng quan (Total tables, Active tables)
-  🔍 Filter và search bàn

## 🗂️ Cấu trúc thư mục

```
src/
├── api/              # API calls
│   ├── axios.ts      # Axios config với interceptors
│   ├── auth.ts       # Auth API
│   └── tables.ts     # Tables API
├── components/       # UI Components
│   ├── Sidebar.tsx
│   ├── TopRightDrawer.tsx
│   └── tables/
│       ├── QRCodeModal.tsx
│       ├── StatsCard.tsx
│       ├── TableForm.tsx
│       ├── TablesGrid.tsx
│       └── TableTile.tsx
├── layouts/          # Layout components
│   └── AdminLayout.tsx
├── pages/            # Page components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   └── Table.tsx
├── routes/           # Routing
│   ├── AppRoutes.tsx
│   └── ProtectedRoute.tsx
├── types/            # TypeScript types
│   ├── qrcode.ts
│   └── tables.ts
├── App.tsx           # Root component
└── main.tsx          # Entry point
```

## 🎨 Giao diện

### Login Page

-  Form đăng nhập với validation
-  Lưu token vào localStorage
-  Auto redirect sau khi login thành công

### Dashboard/Tables Page

-  Grid layout hiển thị các bàn
-  Stats cards (tổng số bàn, bàn active)
-  Button actions: Add Table, Download All QR, Regenerate All QR
-  Mỗi bàn có actions: Edit, Generate QR, Download QR, Delete

### QR Code Modal

-  Preview QR code
-  Hiển thị thông tin bàn
-  Options download PNG/PDF
-  Copy token

## 🔐 Authentication Flow

1. User đăng nhập → Nhận access token + refresh token (httpOnly cookie)
2. Access token lưu trong localStorage
3. Mọi request đều gửi kèm Bearer token
4. Khi access token hết hạn (401) → Tự động gọi refresh endpoint
5. Nhận access token mới → Retry request failed
6. Nếu refresh fail → Redirect về login

## 📝 Ghi chú

-  **Auto-refresh**: Token tự động refresh khi hết hạn
-  **Protected Routes**: Các route yêu cầu đăng nhập được bảo vệ
-  **Responsive**: Giao diện responsive cho mobile/tablet
-  **TypeScript**: Full type safety với TypeScript

## 🐛 Troubleshooting

### Backend không kết nối được:

```
Network Error / CORS Error
```

**Giải pháp**:

-  Kiểm tra backend đã chạy chưa (port 3000)
-  Kiểm tra CORS đã bật trong backend
-  Kiểm tra `baseURL` trong `src/api/axios.ts`

### Lỗi 401 Unauthorized:

**Giải pháp**:

-  Clear localStorage: `localStorage.clear()`
-  Đăng nhập lại
-  Kiểm tra token expiration trong backend

### Không tải được dependencies:

```
npm install error
```

**Giải pháp**:

```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 đã được sử dụng:

**Giải pháp**: Vite tự động chọn port khác (5174, 5175...) hoặc đổi trong `vite.config.ts`

## 🚀 Deploy (Optional)

### Deploy lên Vercel:

```bash
npm run build
# Upload dist folder lên Vercel
```

Nhớ cập nhật `baseURL` trong `axios.ts` thành URL backend production.
