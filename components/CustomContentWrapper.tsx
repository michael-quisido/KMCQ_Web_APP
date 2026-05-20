"use client";

import { useState, useEffect } from "react";

interface CustomContentWrapperProps {
  pageSlug: string;
}

export default function CustomContentWrapper({ pageSlug }: CustomContentWrapperProps) {
  const [content, setContent] = useState<{ content: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/custom-pages")
      .then(r => r.json())
      .then((pages: { id: number; slug: string }[]) => {
        const page = pages.find((p) => p.slug === pageSlug);
        if (page) {
          fetch(`/api/custom-pages/${page.id}`)
            .then(r => r.json())
            .then(data => { setContent(data); setLoading(false); });
        } else {
          setLoading(false);
        }
      });
  }, [pageSlug]);

  if (loading) return null;
  if (!content) return null;

  return (
    <div className="custom-content-wrapper" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
      <div dangerouslySetInnerHTML={{ __html: content.content }} />
    </div>
  );
}
