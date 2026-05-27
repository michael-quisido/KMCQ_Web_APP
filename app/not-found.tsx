"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", backgroundColor: "#040f2d", color: "#ffffff", textAlign: "center", padding: "40px"
    }}>
      <h1 style={{ fontSize: "clamp(60px, 15vw, 120px)", fontWeight: "bold", margin: "0 0 10px", color: "#28a745" }}>
        404
      </h1>
      <h2 style={{ fontSize: "clamp(20px, 4vw, 32px)", fontWeight: "bold", margin: "0 0 15px" }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "#9d9d9d", maxWidth: 500, margin: "0 0 30px", lineHeight: 1.6 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.<br />
        Check the URL or head back home.
      </p>
      <Link href="/" style={{
        padding: "14px 36px", backgroundColor: "#28a745", color: "white",
        borderRadius: 8, textDecoration: "none", fontSize: 16, fontWeight: 600,
        transition: "opacity 0.2s",
      }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
      >
        Go Home
      </Link>
    </div>
  );
}
