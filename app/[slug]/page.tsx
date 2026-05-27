import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rows = await query("SELECT id FROM custom_pages WHERE slug = ?", [slug]) as RowDataPacket[];
  if (rows.length === 0) notFound();
  return (
    <PageLayout>
      <div style={{ width: '100%' }}>
        <PageHeader slug={slug} title={slug} />
        <CustomContentWrapper pageSlug={slug} />
      </div>
    </PageLayout>
  );
}
