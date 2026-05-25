import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default function Page() {
  return (
    <PageLayout title="WordPress Hosting">
      <div style={{ width: '100%' }}>
        <PageHeader slug="wordpress" title="WordPress" />
        <CustomContentWrapper pageSlug="wordpress" />
      </div>
    </PageLayout>
  );
}
