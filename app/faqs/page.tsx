import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default function Page() {
  return (
    <PageLayout title="FAQs">
      <div style={{ width: '100%' }}>
        <PageHeader slug="faqs" title="FAQs" />
        <CustomContentWrapper pageSlug="faqs" />
      </div>
    </PageLayout>
  );
}
