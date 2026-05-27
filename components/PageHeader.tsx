"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface PageHeaderProps {
  slug: string;
  title: string;
}

export default function PageHeader({ slug, title: fallbackTitle }: PageHeaderProps) {
  const [headerImage, setHeaderImage] = useState("/header_images/tazz.jpg");
  const [pageTitle, setPageTitle] = useState(fallbackTitle);

  useEffect(() => {
    fetch("/api/custom-pages")
      .then(r => r.json())
      .then((pages: { id: number; slug: string; title: string; header_image: string | null }[]) => {
        const page = pages.find((p) => p.slug === slug);
        if (page) {
          if (page.header_image) setHeaderImage(page.header_image);
          if (page.title) setPageTitle(page.title);
        }
      });
  }, [slug]);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <Image
        src={headerImage}
        alt={`${pageTitle} Header`}
        width={1920}
        height={600}
        sizes="100vw"
        unoptimized
        style={{ width: "100%", height: "auto" }}
      />
      <div style={{
        position: "absolute", top: "50%", left: "30px", transform: "translateY(-50%)", textAlign: "left"
      }}>
        <h1 style={{
          color: "#ffffff", fontSize: "clamp(20px, 5vw, 37px)", fontWeight: "bold",
          fontFamily: "Arial, Helvetica, sans-serif", textShadow: "2px 2px 4px rgba(0,0,0,0.7)"
        }}>
          {pageTitle}
        </h1>
      </div>
    </div>
  );
}
