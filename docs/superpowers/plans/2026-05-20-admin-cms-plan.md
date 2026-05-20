# CMS Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full CMS admin panel with authentication, rich text editing, media management, and dynamic frontend content.

**Architecture:** Next.js App Router API routes under `app/api/` as backend, MariaDB via `mysql2` connection pool, JWT httpOnly cookies for auth, TipTap for rich text editing. Admin pages under `app/administrator/` route group.

**Tech Stack:** Next.js 16, MariaDB/MySQL, `mysql2`, `jsonwebtoken`, `bcryptjs`, `@tiptap/react`, `uuid`

---

## File Structure

```
lib/
  db.ts                      — MySQL connection pool
  auth.ts                    — JWT sign/verify, middleware
  constants.ts               — DB config constants
scripts/
  init-db.sql                — Database migration SQL

app/api/
  auth/
    send-code/route.ts       — Send 6-digit code to email
    verify-code/route.ts     — Verify 6-digit code
    login/route.ts           — Username + password login
    logout/route.ts          — Clear auth cookie
    me/route.ts              — Get current admin
  content/
    hero/route.ts            — GET/PUT hero content
    features/route.ts        — GET/PUT feature cards
    products/route.ts        — GET/PUT products
    reviews/route.ts         — GET/PUT reviews
    about/route.ts           — GET/PUT about content
    social-links/route.ts    — GET/PUT social links
    settings/
      credentials/route.ts   — PUT admin credentials
  custom-pages/
    route.ts                 — GET (list) / POST custom pages
    [id]/route.ts            — PUT / DELETE custom page
  media/
    upload/route.ts          — POST upload file
    files/
      route.ts               — GET list files
      rename/route.ts        — PUT rename file
      [id]/route.ts          — DELETE file
    folders/
      route.ts               — GET/POST folders

app/administrator/
  layout.tsx                 — Admin layout with sidebar + auth guard
  page.tsx                   — Dashboard (redirects to hero)
  login/page.tsx             — Login flow (email → code → credentials)
  hero/page.tsx              — Hero editor
  features/page.tsx          — Feature cards editor
  products/page.tsx          — Products editor
  reviews/page.tsx           — Reviews editor
  about/page.tsx             — About editor
  custom-pages/
    page.tsx                 — Custom pages list
    [slug]/page.tsx          — Custom page editor
  media/page.tsx             — Media manager
  settings/page.tsx          — Credentials & social links

components/
  admin/
    RichTextEditor.tsx       — TipTap editor with toolbar + image insert
    AuthGuard.tsx            — Auth wrapper component
    Sidebar.tsx              — Admin sidebar navigation
    MediaGrid.tsx            — Media library grid
    ImageUpload.tsx          — Image upload component
  CustomContentWrapper.tsx   — Dynamic content wrapper for frontend pages
```

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install npm packages**

```bash
npm install mysql2 jsonwebtoken bcryptjs uuid @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/pm
npm install -D @types/jsonwebtoken @types/bcryptjs @types/uuid
```

Expected: packages installed successfully

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install CMS dependencies (mysql2, jsonwebtoken, bcryptjs, tiptap)"
```

---

### Task 2: Database Migration & Connection Pool

**Files:**
- Create: `lib/db.ts`
- Create: `lib/constants.ts`
- Create: `scripts/init-db.sql`

- [ ] **Step 1: Create `lib/constants.ts`**

```ts
export const DB_CONFIG = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "yourusernamedb",
  password: process.env.DB_PASSWORD || "yoursampledbpassword",
  database: process.env.DB_NAME || "yournewdb",
  waitForConnections: true,
  connectionLimit: 10,
};

export const JWT_SECRET = process.env.JWT_SECRET || "kmcq-admin-jwt-secret-2026";
export const AUTH_COOKIE_NAME = "kmcq_admin_token";
```

- [ ] **Step 2: Create `lib/db.ts`**

```ts
import mysql from "mysql2/promise";
import { DB_CONFIG } from "./constants";

const pool = mysql.createPool(DB_CONFIG);

export async function query(sql: string, params?: any[]) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function getConnection() {
  return pool.getConnection();
}

export default pool;
```

- [ ] **Step 3: Create `scripts/init-db.sql`**

```sql
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  code VARCHAR(6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hero_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  content TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feature_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  content TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  description TEXT,
  content TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  role VARCHAR(255),
  industry VARCHAR(255),
  text TEXT NOT NULL,
  rating INT DEFAULT 5,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS about_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_name VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  content TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS custom_pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS social_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  url VARCHAR(500) NOT NULL,
  icon VARCHAR(100),
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_name VARCHAR(100) NOT NULL UNIQUE,
  value TEXT
);

CREATE TABLE IF NOT EXISTS media_folders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media_files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  path VARCHAR(500) NOT NULL,
  folder_id INT DEFAULT NULL,
  mime_type VARCHAR(100),
  size INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin123)
INSERT IGNORE INTO admins (email, username, password_hash) VALUES ('admin@kmcq.com', 'admin', '$2a$10$XQxBj0gYK5VGhHzGCgk6aeuQ5GzX0GqGq0Gh0GqGq0Gh0GqGq0Gh0e');
```

- [ ] **Step 4: Run migration**

```bash
echo 'KyleMichael_0677' | sudo -S mysql -u root < scripts/init-db.sql
```

Expected: tables created successfully

- [ ] **Step 5: Skip seed here — done properly in Task 3 with bcrypt**

(Proper seeding with bcrypt happens in Task 3 Step 6)

- [ ] **Step 6: Add `.env.local` with DB config**

```bash
cat >> .env.local << 'EOF'
DB_HOST=127.0.0.1
DB_USER=yourusernamedb
DB_PASSWORD=yoursampledbpassword
DB_NAME=yournewdb
JWT_SECRET=kmcq-admin-jwt-secret-2026
EOF
```

- [ ] **Step 7: Commit**

```bash
git add lib/db.ts lib/constants.ts scripts/init-db.sql .env.local
git commit -m "feat: add DB connection pool and migration scripts"
```

---

### Task 3: Auth Library & Seed Admin

**Files:**
- Create: `lib/auth.ts`

- [ ] **Step 1: Create `lib/auth.ts`**

```ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { JWT_SECRET, AUTH_COOKIE_NAME } from "./constants";
import { query } from "./db";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { id: number; email: string; username: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string): { id: number; email: string; username: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function getAuthFromCookies(): Promise<{ id: number; email: string; username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(): Promise<{ id: number; email: string; username: string }> {
  const user = await getAuthFromCookies();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function seedAdmin() {
  const existing = await query("SELECT id FROM admins LIMIT 1");
  if ((existing as any[]).length > 0) return;
  
  const hash = await hashPassword("admin123");
  await query(
    "INSERT INTO admins (email, username, password_hash) VALUES (?, ?, ?)",
    ["admin@kmcq.com", "admin", hash]
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/auth.ts
git commit -m "feat: add auth library with JWT, bcrypt, and seed function"
```

---

### Task 4: Auth API Routes

**Files:**
- Create: `app/api/auth/send-code/route.ts`
- Create: `app/api/auth/verify-code/route.ts`
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/logout/route.ts`
- Create: `app/api/auth/me/route.ts`

- [ ] **Step 1: Create `app/api/auth/send-code/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const users = await query("SELECT id FROM admins WHERE email = ?", [email]) as any[];
    if (users.length === 0) return NextResponse.json({ error: "Email not found" }, { status: 404 });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await query("UPDATE admins SET code = ? WHERE email = ?", [code, email]);

    console.log(`[ADMIN AUTH] Verification code for ${email}: ${code}`);

    return NextResponse.json({ message: "Code sent", code }); // code returned for dev mode
  } catch (err) {
    console.error("send-code error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create `app/api/auth/verify-code/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) return NextResponse.json({ error: "Email and code required" }, { status: 400 });

    const users = await query("SELECT id FROM admins WHERE email = ? AND code = ?", [email, code]) as any[];
    if (users.length === 0) return NextResponse.json({ error: "Invalid code" }, { status: 401 });

    return NextResponse.json({ message: "Code verified", email });
  } catch (err) {
    console.error("verify-code error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Create `app/api/auth/login/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { signToken, verifyPassword } from "@/lib/auth";
import { query } from "@/lib/db";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = await req.json();
    if (!email || !username || !password) return NextResponse.json({ error: "All fields required" }, { status: 400 });

    const users = await query("SELECT id, email, username, password_hash FROM admins WHERE email = ? AND username = ?", [email, username]) as any[];
    if (users.length === 0) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const admin = users[0];
    const valid = await verifyPassword(password, admin.password_hash);
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    await query("UPDATE admins SET code = NULL WHERE id = ?", [admin.id]);

    const token = signToken({ id: admin.id, email: admin.email, username: admin.username });

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Create `app/api/auth/logout/route.ts`**

```ts
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set(AUTH_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return response;
}
```

- [ ] **Step 5: Create `app/api/auth/me/route.ts`**

```ts
import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET() {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  return NextResponse.json(user);
}
```

- [ ] **Step 6: Seed the default admin**

```bash
cd /home/mike_q/Downloads/Apps/KMCQ\ GmbH/dev_app_nextjs
node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 10).then(hash => {
  const { execSync } = require('child_process');
  execSync(\"echo 'KyleMichael_0677' | sudo -S mysql -u root -e 'USE yournewdb; DELETE FROM admins; INSERT INTO admins (email, username, password_hash) VALUES (\\\"admin@kmcq.com\\\", \\\"admin\\\", \\\"\" + hash + \"\\\");'\");
  console.log('Admin seeded with hash:', hash);
});
"
```

- [ ] **Step 7: Commit**

```bash
git add app/api/auth/
git commit -m "feat: add auth API routes (send-code, verify-code, login, logout, me)"
```

---

### Task 5: Admin Login Page (UI)

**Files:**
- Create: `app/administrator/login/page.tsx`
- Create: `app/administrator/layout.tsx`
- Create: `components/admin/AuthGuard.tsx`

- [ ] **Step 1: Create `components/admin/AuthGuard.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (r.ok) setAuthed(true);
        else { setAuthed(false); router.push("/administrator/login"); }
      })
      .catch(() => { setAuthed(false); router.push("/administrator/login"); });
  }, []);

  if (authed === null) return <div className="flex items-center justify-center h-screen bg-[#040f2d]"><p className="text-white text-xl">Loading...</p></div>;
  if (!authed) return null;
  return <>{children}</>;
}
```

- [ ] **Step 2: Create `app/administrator/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "../globals.css";
import AuthGuard from "@/components/admin/AuthGuard";
import AdminSidebar from "@/components/admin/Sidebar";

export const metadata: Metadata = {
  title: "KMCQ Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>
          <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            <AdminSidebar />
            <main style={{ flex: 1, padding: "30px", position: "relative" }}>
              {children}
              <div style={{ position: "fixed", bottom: 10, right: 10, fontSize: 12, color: "#999", zIndex: 9999 }}>
                Powered by: KMCQ-GmbH Agila-WHS
              </div>
            </main>
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}
```

Note: The layout won't compile yet because `AdminSidebar` isn't created. That's fine — it's created in the next task.

- [ ] **Step 3: Create `app/administrator/login/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code" | "credentials">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSendCode() {
    setError(""); setMessage("");
    const res = await fetch("/api/auth/send-code", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) { setMessage("Code sent to " + email + (data.code ? `<br/>Dev code: ${data.code}` : "")); setStep("code"); }
    else setError(data.error);
  }

  async function handleVerifyCode() {
    setError(""); setMessage("");
    const res = await fetch("/api/auth/verify-code", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (res.ok) { setMessage("Code verified"); setStep("credentials"); }
    else setError(data.error);
  }

  async function handleLogin() {
    setError(""); setMessage("");
    const res = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });
    const data = await res.json();
    if (res.ok) { router.push("/administrator"); }
    else setError(data.error);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#040f2d" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: 12, width: 400, maxWidth: "90%" }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#040f2d" }}>Admin Login</h1>
        {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}
        {message && <p style={{ color: "green", marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: message }} />}

        {step === "email" && (
          <div>
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
            <button onClick={handleSendCode} style={{ width: "100%", padding: 10, background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Send Code</button>
          </div>
        )}

        {step === "code" && (
          <div>
            <input type="text" placeholder="6-digit code" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6}
              style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
            <button onClick={handleVerifyCode} style={{ width: "100%", padding: 10, background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Verify Code</button>
          </div>
        )}

        {step === "credentials" && (
          <div>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
            <button onClick={handleLogin} style={{ width: "100%", padding: 10, background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Login</button>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/administrator/login/page.tsx app/administrator/layout.tsx components/admin/AuthGuard.tsx
git commit -m "feat: add admin login page and auth guard"
```

---

### Task 6: Admin Sidebar

**Files:**
- Create: `components/admin/Sidebar.tsx`

- [ ] **Step 1: Create `components/admin/Sidebar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Hero", href: "/administrator/hero", icon: "🏠" },
  { label: "Features", href: "/administrator/features", icon: "⭐" },
  { label: "Products", href: "/administrator/products", icon: "📦" },
  { label: "Reviews", href: "/administrator/reviews", icon: "💬" },
  { label: "About", href: "/administrator/about", icon: "ℹ️" },
  { label: "Custom Pages", href: "/administrator/custom-pages", icon: "📄" },
  { label: "Media", href: "/administrator/media", icon: "🖼️" },
  { label: "Settings", href: "/administrator/settings", icon: "⚙️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/administrator/login");
  }

  return (
    <div style={{ width: 220, background: "#040f2d", color: "white", display: "flex", flexDirection: "column", padding: "20px 0", minHeight: "100vh" }}>
      <div style={{ padding: "0 20px 20px", borderBottom: "1px solid #1a2a4d", marginBottom: 10 }}>
        <h2 style={{ fontSize: 18, fontWeight: "bold" }}>KMCQ Admin</h2>
      </div>
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 20px",
              color: pathname === item.href ? "white" : "#9d9d9d",
              background: pathname === item.href ? "#1a2a4d" : "transparent",
              textDecoration: "none", fontSize: 14, borderLeft: pathname === item.href ? "3px solid white" : "3px solid transparent"
            }}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div style={{ padding: "20px", borderTop: "1px solid #1a2a4d" }}>
        <button onClick={handleLogout} style={{ background: "transparent", color: "#ff6b6b", border: "1px solid #ff6b6b", padding: "8px 16px", borderRadius: 6, cursor: "pointer", width: "100%", fontSize: 14 }}>
          Logout
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/admin/Sidebar.tsx
git commit -m "feat: add admin sidebar navigation"
```

---

### Task 7: Admin Dashboard Page

**Files:**
- Create: `app/administrator/page.tsx`

- [ ] **Step 1: Create `app/administrator/page.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  useEffect(() => { router.push("/administrator/hero"); }, []);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <p>Redirecting to Hero editor...</p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/administrator/page.tsx
git commit -m "feat: add admin dashboard redirect"
```

---

### Task 8: TipTap RichTextEditor Component

**Files:**
- Create: `components/admin/RichTextEditor.tsx`

- [ ] **Step 1: Create `components/admin/RichTextEditor.tsx`**

```tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: content || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  function addImage() {
    const url = prompt("Image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8 }}>
      <div style={{ display: "flex", gap: 4, padding: 8, borderBottom: "1px solid #ddd", background: "#f9f9f9", flexWrap: "wrap" }}>
        <button onClick={() => editor.chain().focus().toggleBold().run()} style={{ padding: "4px 8px", fontWeight: editor.isActive("bold") ? "bold" : "normal", cursor: "pointer" }}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} style={{ padding: "4px 8px", fontStyle: "italic", cursor: "pointer" }}>I</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={{ padding: "4px 8px", cursor: "pointer" }}>H2</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={{ padding: "4px 8px", cursor: "pointer" }}>H3</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} style={{ padding: "4px 8px", cursor: "pointer" }}>UL</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} style={{ padding: "4px 8px", cursor: "pointer" }}>OL</button>
        <button onClick={addImage} style={{ padding: "4px 8px", cursor: "pointer" }}>🖼️</button>
        <button onClick={() => { const url = prompt("Link URL:"); if (url) editor.chain().focus().setLink({ href: url }).run(); }} style={{ padding: "4px 8px", cursor: "pointer" }}>🔗</button>
        <button onClick={() => editor.chain().focus().undo().run()} style={{ padding: "4px 8px", cursor: "pointer" }}>↩</button>
        <button onClick={() => editor.chain().focus().redo().run()} style={{ padding: "4px 8px", cursor: "pointer" }}>↪</button>
      </div>
      <EditorContent editor={editor} style={{ padding: 16, minHeight: 300 }} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/admin/RichTextEditor.tsx
git commit -m "feat: add TipTap rich text editor component"
```

---

### Task 9: Content API Routes (Hero, Features, Products, Reviews, About, Social Links, Credentials)

**Files:**
- Create: `app/api/content/hero/route.ts`
- Create: `app/api/content/features/route.ts`
- Create: `app/api/content/products/route.ts`
- Create: `app/api/content/reviews/route.ts`
- Create: `app/api/content/about/route.ts`
- Create: `app/api/content/social-links/route.ts`
- Create: `app/api/content/settings/credentials/route.ts`

Each route follows the same pattern: GET to fetch, PUT to update, both require auth.

- [ ] **Step 1: Create `app/api/content/hero/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query("SELECT * FROM hero_content LIMIT 1") as any[];
  return NextResponse.json(rows[0] || {});
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, subtitle, content } = await req.json();
  const existing = await query("SELECT id FROM hero_content LIMIT 1") as any[];
  if (existing.length > 0) {
    await query("UPDATE hero_content SET title = ?, subtitle = ?, content = ? WHERE id = ?", [title, subtitle, content, existing[0].id]);
  } else {
    await query("INSERT INTO hero_content (title, subtitle, content) VALUES (?, ?, ?)", [title, subtitle, content]);
  }
  return NextResponse.json({ message: "Saved" });
}
```

- [ ] **Step 2: Create `app/api/content/features/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query("SELECT * FROM feature_cards ORDER BY sort_order ASC") as any[];
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cards } = await req.json();
  await query("DELETE FROM feature_cards");
  for (let i = 0; i < cards.length; i++) {
    await query("INSERT INTO feature_cards (title, icon, content, sort_order) VALUES (?, ?, ?, ?)", [cards[i].title, cards[i].icon || "", cards[i].content, i]);
  }
  return NextResponse.json({ message: "Saved" });
}
```

- [ ] **Step 3: Create `app/api/content/products/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query("SELECT * FROM products ORDER BY sort_order ASC") as any[];
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { products } = await req.json();
  await query("DELETE FROM products");
  for (let i = 0; i < products.length; i++) {
    await query("INSERT INTO products (name, icon, description, content, sort_order) VALUES (?, ?, ?, ?, ?)",
      [products[i].name, products[i].icon || "", products[i].description || "", products[i].content || "", i]);
  }
  return NextResponse.json({ message: "Saved" });
}
```

- [ ] **Step 4: Create `app/api/content/reviews/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query("SELECT * FROM reviews ORDER BY sort_order ASC") as any[];
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reviews } = await req.json();
  await query("DELETE FROM reviews");
  for (let i = 0; i < reviews.length; i++) {
    const r = reviews[i];
    await query("INSERT INTO reviews (name, image, role, industry, text, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [r.name, r.image || "", r.role || "", r.industry || "", r.text, r.rating || 5, i]);
  }
  return NextResponse.json({ message: "Saved" });
}
```

- [ ] **Step 5: Create `app/api/content/about/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query("SELECT * FROM about_content ORDER BY id ASC") as any[];
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sections } = await req.json();
  await query("DELETE FROM about_content");
  for (const s of sections) {
    await query("INSERT INTO about_content (section_name, title, content) VALUES (?, ?, ?)",
      [s.section_name, s.title || "", s.content || ""]);
  }
  return NextResponse.json({ message: "Saved" });
}
```

- [ ] **Step 6: Create `app/api/content/social-links/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query("SELECT * FROM social_links ORDER BY sort_order ASC") as any[];
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { links } = await req.json();
  await query("DELETE FROM social_links");
  for (let i = 0; i < links.length; i++) {
    await query("INSERT INTO social_links (platform, url, icon, sort_order) VALUES (?, ?, ?, ?)",
      [links[i].platform, links[i].url, links[i].icon || "", i]);
  }
  return NextResponse.json({ message: "Saved" });
}
```

- [ ] **Step 7: Create `app/api/content/settings/credentials/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies, hashPassword, verifyPassword } from "@/lib/auth";
import { query } from "@/lib/db";

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newUsername, newPassword, newEmail } = await req.json();

  const admins = await query("SELECT id, password_hash FROM admins WHERE id = ?", [user.id]) as any[];
  if (admins.length === 0) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

  const valid = await verifyPassword(currentPassword, admins[0].password_hash);
  if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });

  const updates: string[] = [];
  const params: any[] = [];

  if (newUsername) { updates.push("username = ?"); params.push(newUsername); }
  if (newPassword) { updates.push("password_hash = ?"); params.push(await hashPassword(newPassword)); }
  if (newEmail) { updates.push("email = ?"); params.push(newEmail); }

  if (updates.length > 0) {
    params.push(user.id);
    await query(`UPDATE admins SET ${updates.join(", ")} WHERE id = ?`, params);
  }

  return NextResponse.json({ message: "Credentials updated" });
}
```

- [ ] **Step 8: Commit**

```bash
git add app/api/content/
git commit -m "feat: add content API routes for all editable sections"
```

---

### Task 10: Content Editor Pages (Hero, Features, Products, Reviews, About)

**Files:**
- Create: `app/administrator/hero/page.tsx`
- Create: `app/administrator/features/page.tsx`
- Create: `app/administrator/products/page.tsx`
- Create: `app/administrator/reviews/page.tsx`
- Create: `app/administrator/about/page.tsx`

- [ ] **Step 1: Create `app/administrator/hero/page.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function HeroEditor() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content/hero").then(r => r.json()).then(data => {
      if (data.title) setTitle(data.title);
      if (data.subtitle) setSubtitle(data.subtitle);
      if (data.content) setContent(data.content);
    });
  }, []);

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/hero", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, subtitle, content }),
    });
    const data = await res.json();
    setMessage(data.message || "Error saving");
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Hero Section Editor</h1>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 6, fontSize: 16 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Subtitle</label>
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
          style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 6, fontSize: 16 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Rich Content</label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 16 }}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
      {message && <p style={{ marginTop: 10, color: "#040f2d" }}>{message}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Create `app/administrator/features/page.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Feature {
  id?: number; title: string; icon: string; content: string;
}

export default function FeaturesEditor() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content/features").then(r => r.json()).then(setFeatures);
  }, []);

  function updateFeature(i: number, field: keyof Feature, value: string) {
    const updated = [...features];
    updated[i] = { ...updated[i], [field]: value };
    setFeatures(updated);
  }

  function addFeature() {
    setFeatures([...features, { title: "", icon: "", content: "" }]);
  }

  function removeFeature(i: number) {
    setFeatures(features.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/features", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cards: features }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Feature Cards Editor</h1>
      {features.map((f, i) => (
        <div key={i} style={{ marginBottom: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8, background: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <strong>Feature {i + 1}</strong>
            <button onClick={() => removeFeature(i)} style={{ color: "red", cursor: "pointer", background: "none", border: "none" }}>Remove</button>
          </div>
          <input placeholder="Title" value={f.title} onChange={(e) => updateFeature(i, "title", e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Icon name (optional)" value={f.icon} onChange={(e) => updateFeature(i, "icon", e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <RichTextEditor content={f.content} onChange={(v) => updateFeature(i, "content", v)} />
        </div>
      ))}
      <button onClick={addFeature} style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer", marginRight: 10 }}>Add Feature</button>
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Save All"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
```

- [ ] **Step 3: Create `app/administrator/products/page.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Product {
  id?: number; name: string; icon: string; description: string; content: string;
}

export default function ProductsEditor() {
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content/products").then(r => r.json()).then(setProducts);
  }, []);

  function updateProduct(i: number, field: keyof Product, value: string) {
    const updated = [...products];
    updated[i] = { ...updated[i], [field]: value };
    setProducts(updated);
  }

  function addProduct() {
    setProducts([...products, { name: "", icon: "", description: "", content: "" }]);
  }

  function removeProduct(i: number) {
    setProducts(products.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/products", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Products Editor</h1>
      {products.map((p, i) => (
        <div key={i} style={{ marginBottom: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8, background: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <strong>Product {i + 1}</strong>
            <button onClick={() => removeProduct(i)} style={{ color: "red", cursor: "pointer", background: "none", border: "none" }}>Remove</button>
          </div>
          <input placeholder="Name" value={p.name} onChange={(e) => updateProduct(i, "name", e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Icon name" value={p.icon} onChange={(e) => updateProduct(i, "icon", e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Short description" value={p.description} onChange={(e) => updateProduct(i, "description", e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <RichTextEditor content={p.content} onChange={(v) => updateProduct(i, "content", v)} />
        </div>
      ))}
      <button onClick={addProduct} style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer", marginRight: 10 }}>Add Product</button>
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Save All"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
```

- [ ] **Step 4: Create `app/administrator/reviews/page.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";

interface Review {
  id?: number; name: string; image: string; role: string; industry: string; text: string; rating: number;
}

export default function ReviewsEditor() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content/reviews").then(r => r.json()).then(setReviews);
  }, []);

  function updateReview(i: number, field: keyof Review, value: any) {
    const updated = [...reviews];
    updated[i] = { ...updated[i], [field]: value };
    setReviews(updated);
  }

  function addReview() {
    setReviews([...reviews, { name: "", image: "", role: "", industry: "", text: "", rating: 5 }]);
  }

  function removeReview(i: number) {
    setReviews(reviews.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/reviews", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviews }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Reviews Editor</h1>
      {reviews.map((r, i) => (
        <div key={i} style={{ marginBottom: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8, background: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <strong>Review {i + 1}</strong>
            <button onClick={() => removeReview(i)} style={{ color: "red", cursor: "pointer", background: "none", border: "none" }}>Remove</button>
          </div>
          <input placeholder="Name" value={r.name} onChange={(e) => updateReview(i, "name", e.target.value)}
            style={{ width: "48%", padding: 8, marginBottom: 8, marginRight: "2%", border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Image filename" value={r.image} onChange={(e) => updateReview(i, "image", e.target.value)}
            style={{ width: "48%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Role" value={r.role} onChange={(e) => updateReview(i, "role", e.target.value)}
            style={{ width: "48%", padding: 8, marginBottom: 8, marginRight: "2%", border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Industry" value={r.industry} onChange={(e) => updateReview(i, "industry", e.target.value)}
            style={{ width: "48%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Rating (1-5)" type="number" min={1} max={5} value={r.rating} onChange={(e) => updateReview(i, "rating", parseInt(e.target.value) || 5)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <textarea placeholder="Review text" value={r.text} onChange={(e) => updateReview(i, "text", e.target.value)}
            style={{ width: "100%", padding: 8, minHeight: 80, border: "1px solid #ddd", borderRadius: 4 }} />
        </div>
      ))}
      <button onClick={addReview} style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer", marginRight: 10 }}>Add Review</button>
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Save All"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
```

- [ ] **Step 5: Create `app/administrator/about/page.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Section {
  id?: number; section_name: string; title: string; content: string;
}

export default function AboutEditor() {
  const [sections, setSections] = useState<Section[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content/about").then(r => r.json()).then(setSections);
  }, []);

  function updateSection(i: number, field: keyof Section, value: string) {
    const updated = [...sections];
    updated[i] = { ...updated[i], [field]: value };
    setSections(updated);
  }

  function addSection() {
    setSections([...sections, { section_name: "", title: "", content: "" }]);
  }

  function removeSection(i: number) {
    setSections(sections.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/about", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>About Section Editor</h1>
      {sections.map((s, i) => (
        <div key={i} style={{ marginBottom: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8, background: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <strong>Section {i + 1}</strong>
            <button onClick={() => removeSection(i)} style={{ color: "red", cursor: "pointer", background: "none", border: "none" }}>Remove</button>
          </div>
          <input placeholder="Section name (e.g. mission, vision)" value={s.section_name} onChange={(e) => updateSection(i, "section_name", e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Title" value={s.title} onChange={(e) => updateSection(i, "title", e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <RichTextEditor content={s.content} onChange={(v) => updateSection(i, "content", v)} />
        </div>
      ))}
      <button onClick={addSection} style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer", marginRight: 10 }}>Add Section</button>
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Save All"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add app/administrator/hero/ app/administrator/features/ app/administrator/products/ app/administrator/reviews/ app/administrator/about/
git commit -m "feat: add content editor pages for all sections"
```

---

### Task 11: Menu Editor

**Files:**
- Modify: `scripts/init-db.sql` — add `menu_items` table
- Create: `app/api/content/menu/route.ts`
- Create: `app/administrator/menu/page.tsx`
- Modify: `components/admin/Sidebar.tsx` — add Menu link

- [ ] **Step 1: Add `menu_items` table to `scripts/init-db.sql`**

Add before the last `INSERT IGNORE`:
```sql
CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  href VARCHAR(500) NOT NULL,
  sort_order INT DEFAULT 0
);
```

- [ ] **Step 2: Run migration**

```bash
echo 'KyleMichael_0677' | sudo -S mysql -u root -e "USE yournewdb; CREATE TABLE IF NOT EXISTS menu_items (id INT AUTO_INCREMENT PRIMARY KEY, label VARCHAR(100) NOT NULL, href VARCHAR(500) NOT NULL, sort_order INT DEFAULT 0);"
```

- [ ] **Step 3: Create `app/api/content/menu/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query("SELECT * FROM menu_items ORDER BY sort_order ASC") as any[];
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items } = await req.json();
  await query("DELETE FROM menu_items");
  for (let i = 0; i < items.length; i++) {
    await query("INSERT INTO menu_items (label, href, sort_order) VALUES (?, ?, ?)",
      [items[i].label, items[i].href, i]);
  }
  return NextResponse.json({ message: "Saved" });
}
```

- [ ] **Step 4: Create `app/administrator/menu/page.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";

interface MenuItem {
  id?: number; label: string; href: string;
}

export default function MenuEditor() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content/menu").then(r => r.json()).then(setItems);
  }, []);

  function updateItem(i: number, field: keyof MenuItem, value: string) {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  }

  function addItem() {
    setItems([...items, { label: "", href: "" }]);
  }

  function removeItem(i: number) {
    setItems(items.filter((_, idx) => idx !== i));
  }

  function moveItem(i: number, direction: "up" | "down") {
    if (direction === "up" && i === 0) return;
    if (direction === "down" && i === items.length - 1) return;
    const updated = [...items];
    const swap = direction === "up" ? i - 1 : i + 1;
    [updated[i], updated[swap]] = [updated[swap], updated[i]];
    setItems(updated);
  }

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/menu", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Navigation Menu Editor</h1>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center", padding: 12, background: "white", border: "1px solid #ddd", borderRadius: 8 }}>
          <span style={{ color: "#999", minWidth: 24 }}>{i + 1}.</span>
          <input placeholder="Label (e.g. Home)" value={item.label} onChange={(e) => updateItem(i, "label", e.target.value)}
            style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4, flex: 1 }} />
          <input placeholder="URL (e.g. / or /#products)" value={item.href} onChange={(e) => updateItem(i, "href", e.target.value)}
            style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4, flex: 1.5 }} />
          <button onClick={() => moveItem(i, "up")} disabled={i === 0} style={{ cursor: i === 0 ? "not-allowed" : "pointer", background: "none", border: "1px solid #ddd", borderRadius: 4, padding: "4px 8px" }}>↑</button>
          <button onClick={() => moveItem(i, "down")} disabled={i === items.length - 1} style={{ cursor: i === items.length - 1 ? "not-allowed" : "pointer", background: "none", border: "1px solid #ddd", borderRadius: 4, padding: "4px 8px" }}>↓</button>
          <button onClick={() => removeItem(i)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>✕</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button onClick={addItem} style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Add Item</button>
        <button onClick={handleSave} disabled={saving}
          style={{ padding: "10px 20px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
          {saving ? "Saving..." : "Save Menu"}
        </button>
      </div>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
```

- [ ] **Step 5: Add Menu link to `components/admin/Sidebar.tsx`**

Add `{ label: "Menu", href: "/administrator/menu", icon: "📋" }` before the Settings entry in the `navItems` array.

- [ ] **Step 6: Commit**

```bash
git add scripts/init-db.sql app/api/content/menu/ app/administrator/menu/ components/admin/Sidebar.tsx
git commit -m "feat: add navigation menu editor"
```

---

**Files:**
- Create: `app/api/media/upload/route.ts`
- Create: `app/api/media/files/route.ts`
- Create: `app/api/media/files/rename/route.ts`
- Create: `app/api/media/files/[id]/route.ts`
- Create: `app/api/media/folders/route.ts`
- Create: `components/admin/MediaGrid.tsx`
- Create: `components/admin/ImageUpload.tsx`
- Create: `app/administrator/media/page.tsx`

- [ ] **Step 1: Create `app/api/media/upload/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const folderId = formData.get("folder_id") as string | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const filename = `${uuidv4()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "media", "images");
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  const filePath = `/media/images/${filename}`;
  const rows = await query(
    "INSERT INTO media_files (filename, original_name, path, folder_id, mime_type, size) VALUES (?, ?, ?, ?, ?, ?)",
    [filename, file.name, filePath, folderId || null, file.type, file.size]
  ) as any;

  return NextResponse.json({ id: rows.insertId, filename, path: filePath, original_name: file.name });
}
```

- [ ] **Step 2: Create `app/api/media/files/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const folderId = req.nextUrl.searchParams.get("folder_id");
  let sql = "SELECT * FROM media_files";
  const params: any[] = [];
  if (folderId) { sql += " WHERE folder_id = ?"; params.push(folderId); }
  sql += " ORDER BY created_at DESC";

  const rows = await query(sql, params);
  return NextResponse.json(rows);
}
```

- [ ] **Step 3: Create `app/api/media/files/rename/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";
import { rename } from "fs/promises";
import path from "path";

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, newFilename } = await req.json();
  if (!id || !newFilename) return NextResponse.json({ error: "id and newFilename required" }, { status: 400 });

  const files = await query("SELECT * FROM media_files WHERE id = ?", [id]) as any[];
  if (files.length === 0) return NextResponse.json({ error: "File not found" }, { status: 404 });

  const file = files[0];
  const ext = file.filename.split(".").pop();
  const newName = `${newFilename}.${ext}`;
  const oldPath = path.join(process.cwd(), "public", file.path);
  const newPath = path.join(process.cwd(), "public", "media", "images", newName);

  await rename(oldPath, newPath);
  await query("UPDATE media_files SET filename = ?, original_name = ? WHERE id = ?", [newName, newFilename, id]);

  return NextResponse.json({ message: "Renamed" });
}
```

- [ ] **Step 4: Create `app/api/media/files/[id]/route.ts`**

```ts
import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const files = await query("SELECT * FROM media_files WHERE id = ?", [id]) as any[];
  if (files.length === 0) return NextResponse.json({ error: "File not found" }, { status: 404 });

  const filePath = path.join(process.cwd(), "public", files[0].path);
  await unlink(filePath).catch(() => {});
  await query("DELETE FROM media_files WHERE id = ?", [id]);

  return NextResponse.json({ message: "Deleted" });
}
```

- [ ] **Step 5: Create `app/api/media/folders/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await query("SELECT * FROM media_folders ORDER BY name ASC");
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, parent_id } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const result = await query("INSERT INTO media_folders (name, parent_id) VALUES (?, ?)", [name, parent_id || null]) as any;
  return NextResponse.json({ id: result.insertId, name });
}
```

- [ ] **Step 6: Create `components/admin/ImageUpload.tsx`**

```tsx
"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  onUploaded: (url: string) => void;
}

export default function ImageUpload({ onUploaded }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/media/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (res.ok) onUploaded(data.path);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} id="image-upload" />
      <label htmlFor="image-upload" style={{ padding: "8px 16px", background: "#040f2d", color: "white", borderRadius: 6, cursor: uploading ? "not-allowed" : "pointer", display: "inline-block" }}>
        {uploading ? "Uploading..." : "Upload Image"}
      </label>
    </div>
  );
}
```

- [ ] **Step 7: Create `components/admin/MediaGrid.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";

interface MediaFile {
  id: number; filename: string; original_name: string; path: string; mime_type: string; size: number;
}

interface MediaGridProps {
  onSelect?: (url: string) => void;
}

export default function MediaGrid({ onSelect }: MediaGridProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState<number | null>(null);
  const [renaming, setRenaming] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");

  async function loadFiles() {
    const params = currentFolder ? `?folder_id=${currentFolder}` : "";
    const [filesRes, foldersRes] = await Promise.all([
      fetch(`/api/media/files${params}`),
      fetch("/api/media/folders"),
    ]);
    setFiles(await filesRes.json());
    setFolders(await foldersRes.json());
  }

  useEffect(() => { loadFiles(); }, [currentFolder]);

  async function handleDelete(id: number) {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/media/files/${id}`, { method: "DELETE" });
    loadFiles();
  }

  async function handleRename(id: number) {
    if (!newName) return;
    await fetch("/api/media/files/rename", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, newFilename: newName }),
    });
    setRenaming(null);
    setNewName("");
    loadFiles();
  }

  async function handleNewFolder() {
    if (!newFolderName) return;
    await fetch("/api/media/folders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFolderName, parent_id: currentFolder }),
    });
    setNewFolderName("");
    loadFiles();
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="New folder name"
          style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4 }} />
        <button onClick={handleNewFolder} style={{ padding: "8px 16px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Add Folder</button>
        {currentFolder && <button onClick={() => setCurrentFolder(null)} style={{ padding: "8px 16px", background: "#6c757d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Root</button>}
      </div>

      {folders.filter(f => currentFolder ? f.parent_id === currentFolder : !f.parent_id).map(f => (
        <div key={f.id} onClick={() => setCurrentFolder(f.id)} style={{ cursor: "pointer", padding: 8, background: "#e9ecef", borderRadius: 4, marginBottom: 4, display: "inline-block", marginRight: 8 }}>
          📁 {f.name}
        </div>
      ))}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginTop: 16 }}>
        {files.map(f => (
          <div key={f.id} style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden", background: "white" }}>
            <img src={f.path} alt={f.original_name} style={{ width: "100%", height: 150, objectFit: "cover" }}
              onClick={() => onSelect?.(f.path)} />
            <div style={{ padding: 8 }}>
              {renaming === f.id ? (
                <div style={{ display: "flex", gap: 4 }}>
                  <input value={newName} onChange={(e) => setNewName(e.target.value)} style={{ flex: 1, padding: 4, border: "1px solid #ddd", borderRadius: 4 }} />
                  <button onClick={() => handleRename(f.id)} style={{ cursor: "pointer" }}>✓</button>
                  <button onClick={() => setRenaming(null)} style={{ cursor: "pointer" }}>✗</button>
                </div>
              ) : (
                <p style={{ fontSize: 12, wordBreak: "break-all" }}>{f.original_name}</p>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button onClick={() => { setRenaming(f.id); setNewName(f.original_name?.replace(/\.[^.]+$/, "") || ""); }} style={{ fontSize: 12, cursor: "pointer", background: "none", border: "none", color: "#007bff" }}>Rename</button>
                <button onClick={() => handleDelete(f.id)} style={{ fontSize: 12, cursor: "pointer", background: "none", border: "none", color: "red" }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {files.length === 0 && <p style={{ color: "#999", textAlign: "center", padding: 40 }}>No files yet.</p>}
    </div>
  );
}
```

- [ ] **Step 8: Create `app/administrator/media/page.tsx`**

```tsx
"use client";

import ImageUpload from "@/components/admin/ImageUpload";
import MediaGrid from "@/components/admin/MediaGrid";

export default function MediaPage() {
  function handleUploaded(url: string) {
    window.location.reload();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Media Library</h1>
        <ImageUpload onUploaded={handleUploaded} />
      </div>
      <MediaGrid />
    </div>
  );
}
```

- [ ] **Step 9: Commit**

```bash
git add app/api/media/ components/admin/MediaGrid.tsx components/admin/ImageUpload.tsx app/administrator/media/
git commit -m "feat: add media manager with upload, rename, delete, folders"
```

---

### Task 12: Custom Pages Manager

**Files:**
- Create: `app/api/custom-pages/route.ts`
- Create: `app/api/custom-pages/[id]/route.ts`
- Create: `app/administrator/custom-pages/page.tsx`
- Create: `app/administrator/custom-pages/[slug]/page.tsx`

- [ ] **Step 1: Create `app/api/custom-pages/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query("SELECT id, slug, title, created_at, updated_at FROM custom_pages ORDER BY id ASC");
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug, title, content } = await req.json();
  if (!slug || !title) return NextResponse.json({ error: "Slug and title required" }, { status: 400 });

  try {
    const result = await query("INSERT INTO custom_pages (slug, title, content) VALUES (?, ?, ?)", [slug, title, content || ""]) as any;
    return NextResponse.json({ id: result.insertId, slug, title });
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    throw err;
  }
}
```

- [ ] **Step 2: Create `app/api/custom-pages/[id]/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { slug, title, content } = await req.json();

  await query("UPDATE custom_pages SET slug = ?, title = ?, content = ? WHERE id = ?", [slug, title, content, id]);
  return NextResponse.json({ message: "Updated" });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await query("DELETE FROM custom_pages WHERE id = ?", [id]);
  return NextResponse.json({ message: "Deleted" });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query("SELECT * FROM custom_pages WHERE id = ?", [id]) as any[];
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}
```

- [ ] **Step 3: Create `app/administrator/custom-pages/page.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomPagesList() {
  const [pages, setPages] = useState<any[]>([]);
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/custom-pages").then(r => r.json()).then(setPages);
  }, []);

  async function handleCreate() {
    if (!newSlug || !newTitle) return;
    const res = await fetch("/api/custom-pages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: newSlug, title: newTitle }),
    });
    if (res.ok) {
      setNewSlug(""); setNewTitle("");
      const data = await res.json();
      router.push(`/administrator/custom-pages/${data.slug}`);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this page?")) return;
    await fetch(`/api/custom-pages/${id}`, { method: "DELETE" });
    setPages(pages.filter(p => p.id !== id));
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Custom Pages</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input placeholder="Slug (e.g. our-team)" value={newSlug} onChange={(e) => setNewSlug(e.target.value)}
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 6, flex: 1 }} />
        <input placeholder="Page title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 6, flex: 1 }} />
        <button onClick={handleCreate} style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Create</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#040f2d", color: "white" }}>
            <th style={{ padding: 10, textAlign: "left" }}>Title</th>
            <th style={{ padding: 10, textAlign: "left" }}>Slug</th>
            <th style={{ padding: 10, textAlign: "left" }}>Created</th>
            <th style={{ padding: 10, textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(p => (
            <tr key={p.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: 10 }}>{p.title}</td>
              <td style={{ padding: 10 }}>/{p.slug}</td>
              <td style={{ padding: 10 }}>{new Date(p.created_at).toLocaleDateString()}</td>
              <td style={{ padding: 10 }}>
                <Link href={`/administrator/custom-pages/${p.slug}`} style={{ color: "#007bff", marginRight: 10 }}>Edit</Link>
                <button onClick={() => handleDelete(p.id)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pages.length === 0 && <p style={{ color: "#999", textAlign: "center", padding: 40 }}>No custom pages yet.</p>}
    </div>
  );
}
```

- [ ] **Step 4: Create `app/administrator/custom-pages/[slug]/page.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function CustomPageEditor() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [title, setTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [pageId, setPageId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/custom-pages").then(r => r.json()).then((pages: any[]) => {
      const page = pages.find((p: any) => p.slug === slug);
      if (page) {
        setPageId(page.id);
        setTitle(page.title);
        setPageSlug(page.slug);
        fetch(`/api/custom-pages/${page.id}`).then(r => r.json()).then(data => {
          if (data.content) setContent(data.content);
        });
      }
    });
  }, [slug]);

  async function handleSave() {
    if (!pageId) return;
    setSaving(true); setMessage("");
    const res = await fetch(`/api/custom-pages/${pageId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: pageSlug, title, content }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Edit: {title}</h1>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Content</label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/api/custom-pages/ app/administrator/custom-pages/
git commit -m "feat: add custom pages CRUD with rich text editor"
```

---

### Task 13: Settings Page (Credentials & Social Links)

**Files:**
- Create: `app/administrator/settings/page.tsx`

- [ ] **Step 1: Create `app/administrator/settings/page.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"credentials" | "social">("credentials");

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Settings</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setActiveTab("credentials")}
          style={{ padding: "8px 16px", background: activeTab === "credentials" ? "#040f2d" : "#ddd", color: activeTab === "credentials" ? "white" : "black", border: "none", borderRadius: 6, cursor: "pointer" }}>Credentials</button>
        <button onClick={() => setActiveTab("social")}
          style={{ padding: "8px 16px", background: activeTab === "social" ? "#040f2d" : "#ddd", color: activeTab === "social" ? "white" : "black", border: "none", borderRadius: 6, cursor: "pointer" }}>Social Links</button>
      </div>

      {activeTab === "credentials" && <CredentialsForm />}
      {activeTab === "social" && <SocialLinksForm />}
    </div>
  );
}

function CredentialsForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/settings/credentials", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newUsername, newPassword, newEmail }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    if (res.ok) { setCurrentPassword(""); setNewPassword(""); }
    setSaving(false);
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      <input type="email" placeholder="New email (leave blank to keep)" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      <input placeholder="New username (leave blank to keep)" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      <input type="password" placeholder="New password (leave blank to keep)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Update Credentials"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}

function SocialLinksForm() {
  const [links, setLinks] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/social-links").then(r => r.json()).then(setLinks);
  }, []);

  function updateLink(i: number, field: string, value: string) {
    const updated = [...links];
    updated[i] = { ...updated[i], [field]: value };
    setLinks(updated);
  }

  function addLink() { setLinks([...links, { platform: "", url: "", icon: "" }]); }
  function removeLink(i: number) { setLinks(links.filter((_, idx) => idx !== i)); }

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/social-links", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ links }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      {links.map((l, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
          <input placeholder="Platform" value={l.platform} onChange={(e) => updateLink(i, "platform", e.target.value)}
            style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4, flex: 1 }} />
          <input placeholder="URL" value={l.url} onChange={(e) => updateLink(i, "url", e.target.value)}
            style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4, flex: 2 }} />
          <input placeholder="Icon class" value={l.icon} onChange={(e) => updateLink(i, "icon", e.target.value)}
            style={{ padding: 8, border: "1px solid #ddd", borderRadius: 4, flex: 1 }} />
          <button onClick={() => removeLink(i)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>✕</button>
        </div>
      ))}
      <button onClick={addLink} style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer", marginRight: 10 }}>Add Link</button>
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Save Social Links"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/administrator/settings/
git commit -m "feat: add settings page with credentials and social links editor"
```

---

### Task 14: Frontend Integration — CustomContentWrapper & Dynamic Pages

**Files:**
- Create: `components/CustomContentWrapper.tsx`
- Modify: All extended page files (about, partners, careers, etc.)

- [ ] **Step 1: Create `components/CustomContentWrapper.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";

interface CustomContentWrapperProps {
  pageSlug: string;
}

export default function CustomContentWrapper({ pageSlug }: CustomContentWrapperProps) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/custom-pages")
      .then(r => r.json())
      .then((pages: any[]) => {
        const page = pages.find((p: any) => p.slug === pageSlug);
        if (page) {
          fetch(`/api/custom-pages/${page.id}`)
            .then(r => r.json())
            .then(data => { setContent(data); setLoading(false); });
        } else {
          setLoading(false);
        }
      });
  }, [pageSlug]);

  if (loading) return null;
  if (!content) return null;

  return (
    <div className="custom-content-wrapper" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
      <div dangerouslySetInnerHTML={{ __html: content.content }} />
    </div>
  );
}
```

- [ ] **Step 2: Add CustomContentWrapper import + usage to each extended page**

Extended pages to modify: `app/partners/page.tsx`, `app/about/page.tsx`, `app/careers/page.tsx`, `app/contact/page.tsx`, `app/community/page.tsx`, `app/contributor/page.tsx`, `app/faqs/page.tsx`, `app/terms/page.tsx`, `app/policy/page.tsx`, `app/vps/page.tsx`, `app/wordpress/page.tsx`, `app/joomla/page.tsx`, `app/data-hosting/page.tsx`, `app/drupal/page.tsx`, `app/email-hosting/page.tsx`.

For each page:
1. Read the file
2. Add `import CustomContentWrapper from "@/components/CustomContentWrapper";` to imports
3. Find the `</div>` closing tag after the header title area (after the tazz.jpg image and title heading)
4. Add `<CustomContentWrapper pageSlug="{slug}" />` just before that closing div
5. Where `{slug}` is the page's route name (e.g., "partners", "about", "careers")

Example modification pattern for `app/partners/page.tsx`:
```tsx
// Add this import:
import CustomContentWrapper from "@/components/CustomContentWrapper";

// Add this after the header title section (after the <h1>Our Partners</h1> or similar):
<CustomContentWrapper pageSlug="partners" />
```

- [ ] **Step 4: Commit**

```bash
git add components/CustomContentWrapper.tsx app/partners/page.tsx app/about/page.tsx app/careers/page.tsx
git commit -m "feat: add CustomContentWrapper to extended pages"
```

---

### Task 15: Build & Verify

- [ ] **Step 1: Run Next.js build to check for errors**

```bash
cd /home/mike_q/Downloads/Apps/KMCQ\ GmbH/dev_app_nextjs && npm run build
```

Expected: Build succeeds without errors

- [ ] **Step 2: Fix any TypeScript or import issues**

- [ ] **Step 3: Final commit**

```bash
git add -A && git commit -m "fix: resolve build issues"
git push
```
