interface AboutContentProps {
  title: string;
}

export default function AboutContent({ title }: AboutContentProps) {
  return (
    <div style={{ backgroundColor: "#ffffff", padding: "60px 20px" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            color: "#040f2d",
            fontSize: "clamp(24px, 4vw, 37px)",
            fontWeight: "bold",
            fontFamily: "Arial, Helvetica, sans-serif",
            marginBottom: 30,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            color: "#040f2d",
            fontSize: "clamp(14px, 2vw, 16px)",
            lineHeight: 1.8,
            fontFamily: "Arial, Helvetica, sans-serif",
            marginBottom: 20,
          }}
        >
          KMCQ GmbH, headquartered in Cebu, Philippines, has specialized in open-source industrial technology for 15 years. We believe secure, free communication is the foundation of progress; it has been our core source code for decades. As premier Linux experts, we provide professional, eye-level partnership to companies, the public sector, and individuals. By navigating diverse business landscapes, KMCQ GmbH enables customers to reclaim their digital sovereignty and maintain complete control over their essential technical infrastructure and data.
        </p>
        <p
          style={{
            color: "#040f2d",
            fontSize: "clamp(14px, 2vw, 16px)",
            lineHeight: 1.8,
            fontFamily: "Arial, Helvetica, sans-serif",
            marginBottom: 20,
          }}
        >
          <strong>Mission:</strong>
        </p>
        <p
          style={{
            color: "#040f2d",
            fontSize: "clamp(14px, 2vw, 16px)",
            lineHeight: 1.8,
            fontFamily: "Arial, Helvetica, sans-serif",
            marginBottom: 20,
          }}
        >
          KMCQ GmbH mission is, To empower the global developer community by engineering high-performance cloud infrastructure and flexible VPS solutions that eliminate technical barriers, allowing creators to deploy, manage, and scale their most ambitious digital projects with absolute speed, precision, and unwavering reliability in an ever-evolving technological landscape.
        </p>
        <p
          style={{
            color: "#040f2d",
            fontSize: "clamp(14px, 2vw, 16px)",
            lineHeight: 1.8,
            fontFamily: "Arial, Helvetica, sans-serif",
            marginBottom: 20,
          }}
        >
          <strong>Vision:</strong>
        </p>
        <p
          style={{
            color: "#040f2d",
            fontSize: "clamp(14px, 2vw, 16px)",
            lineHeight: 1.8,
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          KMCQ GmbH vision is, To become the world&apos;s most trusted foundation for digital transformation, where seamless connectivity and sophisticated server architecture converge to inspire a future where every business, regardless of size, possesses the computational power and creative freedom to redefine what is possible on the modern web.
        </p>
      </div>
    </div>
  );
}
