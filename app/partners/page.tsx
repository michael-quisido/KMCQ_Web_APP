import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default function Page() {
  return (
    <PageLayout title="Partners">
      <div style={{ width: '100%' }}>
        <PageHeader slug="partners" title="Our Partners" />
        <CustomContentWrapper pageSlug="partners" />
      </div>
    </PageLayout>
  );
}
