import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default function Page() {
  return (
    <PageLayout title="About Us">
      <div style={{ width: '100%' }}>
        <PageHeader slug="about" title="About Us" />
        <CustomContentWrapper pageSlug="about" />
      </div>
    </PageLayout>
  );
}
