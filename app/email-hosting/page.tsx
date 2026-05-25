import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import CustomContentWrapper from "@/components/CustomContentWrapper";

export default function Page() {
  return (
    <PageLayout title="Email Hosting">
      <div style={{ width: '100%' }}>
        <PageHeader slug="email-hosting" title="Email Hosting" />
        <CustomContentWrapper pageSlug="email-hosting" />
      </div>
    </PageLayout>
  );
}
