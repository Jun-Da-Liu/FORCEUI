# FORCEUI

FORCEUI là giao diện quản trị nội bộ được xây dựng bằng Vue 3, Vite, JavaScript và Element Plus. Dự án được tùy biến từ nền tảng admin template để phục vụ hệ thống backend thực tế của FORCE, tập trung trước mắt vào đăng nhập, xác thực người dùng và menu động theo dữ liệu trả về từ API.

Repository GitHub:

```txt
https://github.com/Jun-Da-Liu/FORCEUI.git
```

## Mục tiêu dự án

Dự án này dùng làm frontend cho hệ thống quản trị, trong đó quyền truy cập và menu không còn lấy từ mock data mà lấy trực tiếp từ backend.

Các phần đã được tùy biến chính:

- Đăng nhập bằng API thật.
- Lấy thông tin người dùng hiện tại từ backend.
- Sinh menu động từ API `/api/v1/menus/my`.
- Bỏ mock API cũ của template.
- Tạm tắt captcha vì backend/chức năng captcha chưa phát triển.
- Tạm tắt các module backend chưa có API như SSE, notice, analytics và chỉnh sửa profile nâng cao.
- Hỗ trợ đa ngôn ngữ: English, 简体中文, Tiếng Việt.
- Thêm tự động đăng xuất sau 30 phút không hoạt động.
- Chuẩn hóa icon cho menu động.
- Node `Login Out` trong menu động được xử lý như chức năng đăng xuất.

## Công nghệ sử dụng

| Thành phần | Công nghệ |
| --- | --- |
| Framework | Vue 3 |
| Build tool | Vite |
| Ngôn ngữ | JavaScript |
| UI framework | Element Plus |
| State management | Pinia |
| Router | Vue Router |
| HTTP client | Axios |
| Đa ngôn ngữ | Vue I18n |
| Style | SCSS |
| Package manager | pnpm |

## Yêu cầu môi trường

Dự án yêu cầu Node.js theo cấu hình trong `package.json`:

```txt
Node.js ^20.19.0 hoặc >=22.12.0
```

Khuyến nghị:

- Node.js 20 LTS hoặc mới hơn.
- pnpm.
- Backend chạy ở port `5251` khi phát triển local.

## Cài đặt

Clone source:

```bash
git clone https://github.com/Jun-Da-Liu/FORCEUI.git
cd FORCEUI
```

Cài dependencies:

```bash
pnpm install
```

Chạy môi trường development:

```bash
pnpm run dev
```

Mặc định frontend chạy tại:

```txt
http://localhost:3000
```

## Cấu hình môi trường

File development chính:

```txt
.env.development
```

Cấu hình hiện tại:

```env
VITE_APP_PORT=3000
VITE_APP_TITLE=Luu-Tuan-Dat
VITE_APP_BASE_API=/dev-api
VITE_APP_API_URL=http://127.0.0.1:5251
VITE_APP_TENANT_ENABLED=false
VITE_APP_SSE_ENABLED=false
VITE_APP_NOTICE_ENABLED=false
VITE_APP_ANALYTICS_ENABLED=false
VITE_APP_IDLE_TIMEOUT_MINUTES=30
VITE_APP_PROFILE_EDIT_ENABLED=false
```

Ý nghĩa các biến quan trọng:

| Biến | Ý nghĩa |
| --- | --- |
| `VITE_APP_PORT` | Port chạy frontend local |
| `VITE_APP_TITLE` | Tên hiển thị của hệ thống |
| `VITE_APP_BASE_API` | Prefix API phía frontend khi chạy qua Vite proxy |
| `VITE_APP_API_URL` | Địa chỉ backend thật |
| `VITE_APP_SSE_ENABLED` | Bật/tắt kết nối SSE |
| `VITE_APP_NOTICE_ENABLED` | Bật/tắt gọi API thông báo |
| `VITE_APP_ANALYTICS_ENABLED` | Bật/tắt gọi API thống kê dashboard |
| `VITE_APP_IDLE_TIMEOUT_MINUTES` | Số phút không hoạt động trước khi tự đăng xuất |
| `VITE_APP_PROFILE_EDIT_ENABLED` | Bật/tắt các chức năng chỉnh sửa profile cần API bổ sung |

## API backend đang sử dụng

Backend local hiện được cấu hình tại:

```txt
http://127.0.0.1:5251
```

Frontend gọi API qua Vite proxy:

```txt
http://localhost:3000/dev-api
```

### Đăng nhập

Endpoint:

```txt
POST /api/v1/auth/login
```

Response mong đợi:

```json
{
  "code": "00000",
  "data": {
    "accessToken": "accessToken123",
    "refreshToken": "refreshToken123",
    "tokenType": "Bearer",
    "expiresIn": 7200
  },
  "msg": "Login successful"
}
```

Sau khi đăng nhập thành công, frontend lưu access token, lấy thông tin người dùng và sinh menu động.

### Thông tin người dùng hiện tại

Endpoint:

```txt
GET /api/v1/auth/me
```

Response mong đợi:

```json
{
  "code": "00000",
  "data": {
    "userId": "5",
    "username": "test123",
    "nickname": "test123",
    "avatar": "",
    "roles": ["ADMIN"],
    "perms": ["*:*:*"]
  },
  "msg": "Success"
}
```

Nếu avatar rỗng, giao diện sẽ dùng icon mặc định.

### Menu động của user

Endpoint:

```txt
GET /api/v1/menus/my
```

Response là danh sách menu dạng cây. Frontend sẽ chuyển dữ liệu này thành route động.

Ví dụ node:

```json
{
  "menuId": 3,
  "nodeId": 1003,
  "nodeName": "GroupID Price",
  "nodeUrl": "GroupID/GroupID_Price",
  "nodeParent": 1001,
  "nodeExpend": true,
  "nodeCheck": true,
  "nodeSort": 21,
  "children": []
}
```

Quy tắc xử lý:

- Node cha dùng icon riêng theo nhóm.
- Node con dùng icon chung để giao diện đồng bộ.
- Node không có view thật sẽ mở bằng trang dynamic placeholder.
- Node `Login Out` có chức năng đăng xuất.
- Menu được sort theo `nodeSort`.

## Captcha

Captcha hiện đã được tạm bỏ/comment vì backend chưa phát triển chức năng này.

Khi backend có API captcha, có thể bật lại phần captcha ở màn hình login và API auth tương ứng.

## Các module đang tạm tắt

Một số chức năng từ template gốc cần API riêng, hiện chưa có backend nên đã được tắt bằng biến môi trường để tránh lỗi `404`:

| Module | Biến môi trường | Trạng thái |
| --- | --- | --- |
| SSE / online count | `VITE_APP_SSE_ENABLED=false` | Tắt |
| Notice | `VITE_APP_NOTICE_ENABLED=false` | Tắt |
| Analytics dashboard | `VITE_APP_ANALYTICS_ENABLED=false` | Tắt |
| Profile edit nâng cao | `VITE_APP_PROFILE_EDIT_ENABLED=false` | Tắt |

Khi backend phát triển xong API tương ứng, chỉ cần bật lại biến môi trường và kiểm tra mapping API.

## Đa ngôn ngữ

Dự án hiện hỗ trợ:

- English
- 简体中文
- Tiếng Việt

File ngôn ngữ nằm tại:

```txt
src/lang/package/
```

Các file chính:

```txt
src/lang/package/en.json
src/lang/package/zh-cn.json
src/lang/package/vi.json
```

## Tự động đăng xuất

Dự án đã thêm cơ chế tự động đăng xuất sau thời gian không hoạt động.

Cấu hình:

```env
VITE_APP_IDLE_TIMEOUT_MINUTES=30
```

Nếu người dùng không thao tác chuột, bàn phím, scroll hoặc touch trong 30 phút, hệ thống sẽ tự logout và quay về trang đăng nhập.

## Build production

Build source:

```bash
pnpm run build
```

Sau khi build thành công, thư mục output là:

```txt
dist/
```

Preview bản build:

```bash
pnpm run preview
```

## Deploy

Có thể deploy thư mục `dist/` lên Nginx hoặc static hosting.

Ví dụ cấu hình Nginx cơ bản:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5251/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Tùy môi trường production, cần chỉnh lại `VITE_APP_BASE_API` và proxy backend cho phù hợp.

## Lệnh thường dùng

| Lệnh | Mục đích |
| --- | --- |
| `pnpm run dev` | Chạy frontend local |
| `pnpm run build` | Build production |
| `pnpm run preview` | Preview bản build |
| `pnpm run lint` | Chạy eslint, prettier và stylelint |
| `pnpm run lint:eslint` | Fix lỗi ESLint |
| `pnpm run lint:prettier` | Format code |
| `pnpm run lint:stylelint` | Fix style |

## Cấu trúc thư mục quan trọng

```txt
src/
├─ api/                 # Khai báo API request
├─ assets/              # Hình ảnh, logo, static assets
├─ components/          # Component dùng chung
├─ composables/         # Logic tái sử dụng
├─ constants/           # Hằng số hệ thống
├─ enums/               # Enum cấu hình
├─ lang/                # Đa ngôn ngữ
├─ layouts/             # Layout chính, sidebar, toolbar
├─ router/              # Router
├─ stores/              # Pinia stores
├─ styles/              # SCSS global
├─ utils/               # Request, auth, storage, session timeout
└─ views/               # Các trang giao diện
```

## Ghi chú phát triển

- Không dùng mock API cũ.
- Backend cần chạy trước khi test login.
- Nếu đổi dữ liệu menu backend, hãy logout/login lại để frontend sinh lại route động.
- Nếu thêm node menu mới nhưng chưa có page thật, frontend vẫn có thể hiển thị bằng dynamic placeholder.
- Nếu node menu cần mở trang thật, cần thêm view tương ứng trong `src/views`.
- Nếu push GitHub gặp lỗi quyền, kiểm tra tài khoản GitHub đang đăng nhập hoặc SSH key.

## Trạng thái hiện tại

Phạm vi hiện tại của dự án tập trung vào:

- Login.
- Token.
- User info.
- Dynamic menu.
- Logout.
- UI layout cơ bản.
- Ngôn ngữ.
- Session timeout.

Các module nghiệp vụ chi tiết sẽ được phát triển tiếp khi backend có API đầy đủ.
