"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Hero", href: "/administrator/hero", icon: "🏠" },
  { label: "Features", href: "/administrator/features", icon: "⭐" },
  { label: "Products", href: "/administrator/products", icon: "📦" },
  { label: "Reviews", href: "/administrator/reviews", icon: "💬" },
  { label: "About", href: "/administrator/about", icon: "ℹ️" },
  { label: "Menu", href: "/administrator/menu", icon: "📋" },
  { label: "Subpages", href: "/administrator/subpages", icon: "📄" },
  { label: "Custom Pages", href: "/administrator/custom-pages", icon: "📋" },
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
