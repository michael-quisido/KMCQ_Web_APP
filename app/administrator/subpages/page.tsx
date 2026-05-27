"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const builtinSubpages = [
  { label: "About Us", slug: "about" },
  { label: "Career/Jobs", slug: "careers" },
  { label: "Our Partners", slug: "partners" },
  { label: "Contact Us", slug: "contact" },
  { label: "Data Hosting", slug: "data-hosting" },
  { label: "WordPress", slug: "wordpress" },
  { label: "Joomla", slug: "joomla" },
  { label: "Drupal", slug: "drupal" },
  { label: "VPS", slug: "vps" },
  { label: "Email Hosting", slug: "email-hosting" },
  { label: "Our Community", slug: "community" },
  { label: "FAQs", slug: "faqs" },
  { label: "Become a Contributor", slug: "contributor" },
  { label: "Terms of Use", slug: "terms" },
  { label: "Our Policy", slug: "policy" },
];

interface CustomPage {
  id: number; slug: string; title: string;
}

export default function SubpagesList() {
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const builtinSlugs = new Set(builtinSubpages.map(p => p.slug));

  useEffect(() => {
    fetch("/api/custom-pages")
      .then(r => r.json())
      .then((pages: CustomPage[]) => setCustomPages(pages.filter(p => !builtinSlugs.has(p.slug))))
      .catch(() => {});
  }, []);

  const allPages = [
    ...builtinSubpages.map(p => ({ ...p, isBuiltin: true as const })),
    ...customPages.map(p => ({ label: p.title, slug: p.slug, isBuiltin: false as const })),
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Subpages</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>Edit the content of each subpage below. Each page has a rich text editor with image support.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {allPages.map((p) => (
          <Link
            key={p.slug}
            href={p.isBuiltin ? `/administrator/subpages/${p.slug}` : `/administrator/custom-pages/${p.slug}`}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", background: "white", border: "1px solid #ddd",
              borderRadius: 8, textDecoration: "none", color: "#040f2d",
              fontSize: 15, fontWeight: 500, transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
          >
            <span>{p.label}</span>
            <span style={{ color: "#007bff", fontSize: 13 }}>Edit →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
