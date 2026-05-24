"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";

const subpageTitles: Record<string, string> = {
  about: "About Us", careers: "Career/Jobs", partners: "Our Partners",
  contact: "Contact Us", "data-hosting": "Data Hosting", wordpress: "WordPress",
  joomla: "Joomla", drupal: "Drupal", vps: "VPS",
  "email-hosting": "Email Hosting", community: "Our Community",
  faqs: "FAQs", contributor: "Become a Contributor", terms: "Terms of Use",
  policy: "Our Policy",
};

export default function SubpageEditor() {
  const params = useParams();
  const slug = params.slug as string;
  const [pageId, setPageId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!slug) return;
    setTitle(subpageTitles[slug] || slug);
    fetch("/api/custom-pages").then(r => r.json()).then((pages: { id: number; slug: string }[]) => {
      const page = pages.find((p) => p.slug === slug);
      if (page) {
        setPageId(page.id);
        fetch(`/api/custom-pages/${page.id}`).then(r => r.json()).then(data => {
          if (data.content) setContent(data.content);
        });
      }
    });
  }, [slug]);

  async function handleSave() {
    if (!pageId) return;
    setSaving(true); setMessage("");
    const res = await fetch(`/api/custom-pages/${pageId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title, content }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Edit: {title}</h1>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Content</label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>
      <button onClick={handleSave} disabled={saving || !pageId}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
