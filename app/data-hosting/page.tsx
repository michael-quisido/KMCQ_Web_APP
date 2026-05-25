import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default function Page() {
  return (
    <PageLayout title="Data Hosting">
      <div style={{ width: '100%' }}>
        <PageHeader slug="data-hosting" title="Data Hosting" />
        <CustomContentWrapper pageSlug="data-hosting" />
      </div>
    </PageLayout>
  );
}
