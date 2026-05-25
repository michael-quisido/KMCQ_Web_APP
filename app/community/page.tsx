import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default function Page() {
  return (
    <PageLayout title="Community">
      <div style={{ width: '100%' }}>
        <PageHeader slug="community" title="Our Community" />
        <CustomContentWrapper pageSlug="community" />
      </div>
    </PageLayout>
  );
}
