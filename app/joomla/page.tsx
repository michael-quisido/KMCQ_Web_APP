import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default function Page() {
  return (
    <PageLayout title="Joomla Hosting">
      <div style={{ width: '100%' }}>
        <PageHeader slug="joomla" title="Joomla" />
        <CustomContentWrapper pageSlug="joomla" />
      </div>
    </PageLayout>
  );
}
