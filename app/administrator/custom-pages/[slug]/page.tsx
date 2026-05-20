"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function CustomPageEditor() {
  const params = useParams();
  const slug = params.slug as string;
  const [title, setTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [pageId, setPageId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/custom-pages").then(r => r.json()).then((pages: { id: number; slug: string; title: string }[]) => {
      const page = pages.find((p) => p.slug === slug);
      if (page) {
        setPageId(page.id);
        setTitle(page.title);
        setPageSlug(page.slug);
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
      body: JSON.stringify({ slug: pageSlug, title, content }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Edit: {title}</h1>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Content</label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
