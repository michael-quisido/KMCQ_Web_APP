import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default function Page() {
  return (
    <PageLayout title="Contact Us">
      <div style={{ width: '100%' }}>
        <PageHeader slug="contact" title="Contact Us" />
        <CustomContentWrapper pageSlug="contact" />
      </div>
    </PageLayout>
  );
}
