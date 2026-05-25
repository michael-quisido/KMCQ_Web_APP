import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default function Page() {
  return (
    <PageLayout title="Terms of Use">
      <div style={{ width: '100%' }}>
        <PageHeader slug="terms" title="Terms of Use" />
        <CustomContentWrapper pageSlug="terms" />
      </div>
    </PageLayout>
  );
}
