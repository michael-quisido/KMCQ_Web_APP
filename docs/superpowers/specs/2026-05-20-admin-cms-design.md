# CMS Admin Panel Design

## Overview
Full CMS backend for the KMCQ GmbH Next.js app with authentication, rich text editing, media management, and dynamic frontend content.

## Architecture
- **Framework:** Next.js 16 with App Router
- **Database:** MariaDB (MySQL) via `mysql2` connection pool
- **API:** Next.js API routes under `app/api/`
- **Auth:** Email code verification + username/password, JWT in httpOnly cookie
- **Rich Text:** TipTap editor with image insertion
- **Media Storage:** `/public/media/images/`

## Database Schema

```sql
-- Admin credentials
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  code VARCHAR(6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hero section
CREATE TABLE hero_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  content TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Feature cards (Security & Compliance, Innovation & Performance, etc.)
CREATE TABLE feature_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  icon VARCHAR(100),
  content TEXT,
  sort_order INT DEFAULT 0
);

-- Products
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  icon VARCHAR(100),
  description TEXT,
  content TEXT,
  sort_order INT DEFAULT 0
);

-- Reviews
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  image VARCHAR(255),
  role VARCHAR(255),
  industry VARCHAR(255),
  text TEXT,
  rating INT DEFAULT 5,
  sort_order INT DEFAULT 0
);

-- About content
CREATE TABLE about_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_name VARCHAR(100),
  title VARCHAR(255),
  content TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Custom pages
CREATE TABLE custom_pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Social links
CREATE TABLE social_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  platform VARCHAR(50),
  url VARCHAR(500),
  icon VARCHAR(100),
  sort_order INT DEFAULT 0
);

-- Site settings
CREATE TABLE site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_name VARCHAR(100) NOT NULL UNIQUE,
  value TEXT
);

-- Media folders
CREATE TABLE media_folders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media files
CREATE TABLE media_files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  path VARCHAR(500) NOT NULL,
  folder_id INT DEFAULT NULL,
  mime_type VARCHAR(100),
  size INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Routes

### Auth
- `POST /api/auth/send-code` — Accepts `{ email }`, generates 6-digit code, stores in `admins.code`, logs to console
- `POST /api/auth/verify-code` — Accepts `{ email, code }`, verifies match
- `POST /api/auth/login` — Accepts `{ email, username, password }`, returns JWT in httpOnly cookie
- `GET /api/auth/me` — Returns current admin info from JWT
- `POST /api/auth/logout` — Clears auth cookie

### Content (all require auth middleware)
- `GET/PUT /api/content/hero`
- `GET/PUT /api/content/features`
- `GET/PUT /api/content/products`
- `GET/PUT /api/content/reviews`
- `GET/PUT /api/content/about`
- `GET/PUT /api/content/social-links`
- `GET/PUT /api/content/settings/credentials`

### Custom Pages
- `GET /api/custom-pages` — List all
- `POST /api/custom-pages` — Create
- `PUT /api/custom-pages/[id]` — Update
- `DELETE /api/custom-pages/[id]` — Delete

### Media
- `POST /api/media/upload` — Upload file to `/public/media/images/`
- `GET /api/media/files` — List files (optional folder_id query)
- `DELETE /api/media/files/[id]` — Delete file
- `PUT /api/media/files/rename` — Rename file `{ id, new_filename }`
- `POST /api/media/folders` — Create folder
- `GET /api/media/folders` — List folders

## Admin Routes

```
/administrator                    → Login / Dashboard
/administrator/hero               → Hero editor (TipTap)
/administrator/features           → Feature cards editor (TipTap)
/administrator/products           → Products editor (TipTap)
/administrator/reviews            → Reviews editor
/administrator/about              → About editor (TipTap)
/administrator/custom-pages       → Custom pages manager + editor (TipTap)
/administrator/media              → Media manager
/administrator/settings           → Credentials & social links
```

### Admin UI Components
- **Layout:** Sidebar nav + content area, watermark "Powered by: KMCQ-GmbH Agila-WHS" bottom-right
- **RichTextEditor:** Reusable TipTap component with toolbar (bold, italic, heading, bullet list, ordered list, link, image upload, undo/redo)
- **AuthGuard:** Middleware/wrapper that redirects to login if no valid JWT
- **Media Manager:** Grid view with upload button, rename, delete, folder creation

## Frontend Integration

- All extended pages (`/partners`, `/about`, `/careers`, etc.) get a `<div className="custom-content-wrapper">` after the header image and title
- Pages fetch content from API routes and render dynamically
- Existing hardcoded content on homepage (`/`) will be migrated to fetch from DB tables progressively

## Implementation Order

1. **Database & API Layer** — Tables, connection pool, auth API
2. **Auth System** — Login flow, JWT, auth middleware
3. **Admin Dashboard UI** — Layout, sidebar, routing, AuthGuard
4. **TipTap RichTextEditor** — Reusable component with image upload
5. **Content Editor Pages** — Hero, Features, Products, Reviews, About
6. **Media Manager** — File browser, upload, rename, delete, folders
7. **Custom Pages Manager** — CRUD + editor
8. **Settings Pages** — Credentials editor, social links editor
9. **Frontend Integration** — custom-content-wrapper, dynamic content fetching
