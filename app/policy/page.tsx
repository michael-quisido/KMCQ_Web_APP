import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default function Page() {
  return (
    <PageLayout title="Privacy Policy">
      <div style={{ width: '100%' }}>
        <PageHeader slug="policy" title="Our Policy" />
        <CustomContentWrapper pageSlug="policy" />
      </div>
    </PageLayout>
  );
}
