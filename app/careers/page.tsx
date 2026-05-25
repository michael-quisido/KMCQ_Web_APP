import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default function Page() {
  return (
    <PageLayout title="Careers">
      <div style={{ width: '100%' }}>
        <PageHeader slug="careers" title="Career/Jobs" />
        <CustomContentWrapper pageSlug="careers" />
      </div>
    </PageLayout>
  );
}
