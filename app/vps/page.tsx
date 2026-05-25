import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default function Page() {
  return (
    <PageLayout title="VPS Hosting">
      <div style={{ width: '100%' }}>
        <PageHeader slug="vps" title="VPS" />
        <CustomContentWrapper pageSlug="vps" />
      </div>
    </PageLayout>
  );
}
