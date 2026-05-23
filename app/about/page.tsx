import PageLayout from "@/components/PageLayout";
import CustomContentWrapper from "@/components/CustomContentWrapper";
import Image from "next/image";

const aboutHtml = `<div style="background-color:#ffffff;padding:60px 20px;width:100%;box-sizing:border-box"><div style="max-width:1200px;margin:0 auto;display:flex;flex-direction:column"><h1 style="color:#040f2d;font-size:37px;font-weight:bold;font-family:Arial,Helvetica,sans-serif;margin:0 0 30px 0">About Us</h1><p style="color:#040f2d;font-size:16px;line-height:1.8;font-family:Arial,Helvetica,sans-serif;margin:0 0 20px 0">KMCQ GmbH, headquartered in Cebu, Philippines, has specialized in open-source industrial technology for 15 years. We believe secure, free communication is the foundation of progress; it has been our core source code for decades. As premier Linux experts, we provide professional, eye-level partnership to companies, the public sector, and individuals. By navigating diverse business landscapes, KMCQ GmbH enables customers to reclaim their digital sovereignty and maintain complete control over their essential technical infrastructure and data.</p><p style="color:#040f2d;font-size:16px;line-height:1.8;font-family:Arial,Helvetica,sans-serif;margin:0 0 20px 0"><strong>Mission:</strong></p><p style="color:#040f2d;font-size:16px;line-height:1.8;font-family:Arial,Helvetica,sans-serif;margin:0 0 20px 0">KMCQ GmbH mission is, To empower the global developer community by engineering high-performance cloud infrastructure and flexible VPS solutions that eliminate technical barriers, allowing creators to deploy, manage, and scale their most ambitious digital projects with absolute speed, precision, and unwavering reliability in an ever-evolving technological landscape.</p><p style="color:#040f2d;font-size:16px;line-height:1.8;font-family:Arial,Helvetica,sans-serif;margin:0 0 20px 0"><strong>Vision:</strong></p><p style="color:#040f2d;font-size:16px;line-height:1.8;font-family:Arial,Helvetica,sans-serif;margin:0">KMCQ GmbH vision is, To become the world&#x27;s most trusted foundation for digital transformation, where seamless connectivity and sophisticated server architecture converge to inspire a future where every business, regardless of size, possesses the computational power and creative freedom to redefine what is possible on the modern web.</p></div></div>`;

export default function Page() {
  return (
    <PageLayout title="About Us">
      <div style={{ 
        width: '100%'
      }}>
        <div style={{ 
          width: '100%',
          position: 'relative'
        }}>
          <Image
            src="/header_images/tazz.jpg"
            alt="About Us Header"
            width={1920}
            height={600}
            sizes="100vw"
            unoptimized
            style={{ 
              width: '100%', 
              height: 'auto'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '30px',
            transform: 'translateY(-50%)',
            textAlign: 'left'
          }}>
            <h1 style={{ 
              color: '#ffffff', 
              fontSize: 'clamp(20px, 5vw, 37px)', 
              fontWeight: 'bold',
              fontFamily: 'Arial, Helvetica, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
            }}>
              About Us
            </h1>
          </div>
          <CustomContentWrapper pageSlug="about" />
        </div>
        <div dangerouslySetInnerHTML={{ __html: aboutHtml }} />
      </div>
    </PageLayout>
  );
}
