# FORCEUI

FORCEUI is an internal admin frontend built with Vue 3, Vite, JavaScript, and Element Plus. The project is customized from an admin template and adapted to work with the real FORCE backend API.

GitHub repository:

```txt
https://github.com/Jun-Da-Liu/FORCEUI.git
```

## Overview

The current focus of this project is authentication and dynamic menu rendering from backend data.

Main customizations:

- Real login API integration.
- Current user profile loading from backend.
- Dynamic menu generation from `/api/v1/menus/my`.
- Removed old mock API dependency.
- Captcha is temporarily disabled because the feature is not ready on the backend.
- Optional modules such as SSE, notice, analytics, and advanced profile editing are disabled until their APIs are available.
- Internationalization support: English, Simplified Chinese, and Vietnamese.
- Automatic logout after 30 minutes of inactivity.
- Normalized dynamic menu icons.
- The `Login Out` menu node is handled as a logout action.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Vue 3 |
| Build tool | Vite |
| Language | JavaScript |
| UI framework | Element Plus |
| State management | Pinia |
| Router | Vue Router |
| HTTP client | Axios |
| I18n | Vue I18n |
| Style | SCSS |
| Package manager | pnpm |

## Requirements

The required Node.js version is defined in `package.json`:

```txt
Node.js ^20.19.0 or >=22.12.0
```

Recommended environment:

- Node.js 20 LTS or newer.
- pnpm.
- Backend running locally on port `5251`.

## Installation

```bash
git clone https://github.com/Jun-Da-Liu/FORCEUI.git
cd FORCEUI
pnpm install
```

Start development server:

```bash
pnpm run dev
```

Default frontend URL:

```txt
http://localhost:3000
```

## Environment configuration

Development environment file:

```txt
.env.development
```

Current important values:

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

## Backend APIs

Local backend:

```txt
http://127.0.0.1:5251
```

Frontend proxy prefix:

```txt
http://localhost:3000/dev-api
```

### Login

```txt
POST /api/v1/auth/login
```

Expected response:

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

### Current user

```txt
GET /api/v1/auth/me
```

Expected response:

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

### Dynamic menu

```txt
GET /api/v1/menus/my
```

The response is a tree structure. The frontend converts it into dynamic routes.

Menu handling rules:

- Parent nodes use dedicated icons.
- Child nodes use a shared icon.
- Nodes without real view files use a dynamic placeholder page.
- `Login Out` works as logout.
- Menu order follows `nodeSort`.

## Disabled modules

These modules are disabled until backend APIs are ready:

| Module | Environment variable |
| --- | --- |
| SSE / online count | `VITE_APP_SSE_ENABLED=false` |
| Notice | `VITE_APP_NOTICE_ENABLED=false` |
| Analytics dashboard | `VITE_APP_ANALYTICS_ENABLED=false` |
| Advanced profile editing | `VITE_APP_PROFILE_EDIT_ENABLED=false` |

## Internationalization

Language files:

```txt
src/lang/package/en.json
src/lang/package/zh-cn.json
src/lang/package/vi.json
```

Supported languages:

- English
- Simplified Chinese
- Vietnamese

## Build

```bash
pnpm run build
```

Output directory:

```txt
dist/
```

Preview production build:

```bash
pnpm run preview
```

## Useful commands

| Command | Purpose |
| --- | --- |
| `pnpm run dev` | Start local development |
| `pnpm run build` | Build for production |
| `pnpm run preview` | Preview production build |
| `pnpm run lint` | Run lint and formatting |
| `pnpm run lint:eslint` | Fix ESLint issues |
| `pnpm run lint:prettier` | Format files |
| `pnpm run lint:stylelint` | Fix style issues |

## Current scope

The project currently covers:

- Login.
- Token handling.
- Current user info.
- Dynamic menu.
- Logout.
- Base layout.
- Language switching.
- Session timeout.

Business modules will be expanded as backend APIs become available.
