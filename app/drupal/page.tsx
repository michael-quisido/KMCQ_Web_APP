import PageLayout from "@/components/PageLayout";
import CustomContentWrapper from "@/components/CustomContentWrapper";
import Image from "next/image";

export default function Page() {
  return (
    <PageLayout title="Drupal Hosting">
      <div style={{ width: '100%' }}>
        <div style={{ width: '100%', position: 'relative' }}>
          <Image
            src="/header_images/tazz.jpg"
            alt="Drupal Header"
            width={1920}
            height={600}
            sizes="100vw"
            unoptimized
            style={{ width: '100%', height: 'auto' }}
          />
          <div style={{
            position: 'absolute', top: '50%', left: '30px', transform: 'translateY(-50%)', textAlign: 'left'
          }}>
            <h1 style={{ 
              color: '#ffffff', fontSize: 'clamp(20px, 5vw, 37px)', fontWeight: 'bold',
              fontFamily: 'Arial, Helvetica, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
            }}>
              Drupal
            </h1>
          </div>
          <CustomContentWrapper pageSlug="drupal" />
        </div>
      </div>
    </PageLayout>
  );
}
