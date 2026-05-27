import Link from "next/link";
import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rows = await query("SELECT id FROM custom_pages WHERE slug = ?", [slug]) as RowDataPacket[];
  if (rows.length === 0) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", backgroundColor: "#040f2d", color: "#ffffff", textAlign: "center", padding: "40px",
        position: "relative", zIndex: 1
      }}>
        <h1 style={{ fontSize: "clamp(60px, 15vw, 120px)", fontWeight: "bold", margin: "0 0 10px", color: "#28a745" }}>404</h1>
        <h2 style={{ fontSize: "clamp(20px, 4vw, 32px)", fontWeight: "bold", margin: "0 0 15px" }}>Page Not Found</h2>
        <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "#9d9d9d", maxWidth: 500, margin: "0 0 30px", lineHeight: 1.6 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.<br />
          Check the URL or head back home.
        </p>
        <Link href="/" style={{
          padding: "14px 36px", backgroundColor: "#28a745", color: "white",
          borderRadius: 8, textDecoration: "none", fontSize: 16, fontWeight: 600,
        }}>
          Go Home
        </Link>
      </div>
    );
  }
  return (
    <PageLayout>
      <div style={{ width: '100%' }}>
        <PageHeader slug={slug} title={slug} />
        <CustomContentWrapper pageSlug={slug} />
      </div>
    </PageLayout>
  );
}
