import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default function Page() {
  return (
    <PageLayout title="Drupal Hosting">
      <div style={{ width: '100%' }}>
        <PageHeader slug="drupal" title="Drupal" />
        <CustomContentWrapper pageSlug="drupal" />
      </div>
    </PageLayout>
  );
}
