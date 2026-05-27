import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <PageLayout>
      <div style={{ width: '100%' }}>
        <PageHeader slug={slug} title={slug} />
        <CustomContentWrapper pageSlug={slug} />
      </div>
    </PageLayout>
  );
}
