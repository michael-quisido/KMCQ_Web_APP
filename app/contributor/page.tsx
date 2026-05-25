import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default function Page() {
  return (
    <PageLayout title="Become a Contributor">
      <div style={{ width: '100%' }}>
        <PageHeader slug="contributor" title="Become a Contributor" />
        <CustomContentWrapper pageSlug="contributor" />
      </div>
    </PageLayout>
  );
}
