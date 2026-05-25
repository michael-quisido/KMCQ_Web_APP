"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";
import HeaderImagePicker from "@/components/admin/HeaderImagePicker";

function buildDefaultContent(title: string) {
  return `<h1 style="color:#040f2d;font-size:37px;font-weight:bold;font-family:Arial,Helvetica,sans-serif;margin:0 0 30px 0">${title}</h1>
<p style="color:#040f2d;font-size:16px;line-height:1.8;font-family:Arial,Helvetica,sans-serif;margin:0 0 20px 0">KMCQ GmbH, headquartered in Cebu, Philippines, has specialized in open-source industrial technology for 15 years. We believe secure, free communication is the foundation of progress; it has been our core source code for decades. As premier Linux experts, we provide professional, eye-level partnership to companies, the public sector, and individuals. By navigating diverse business landscapes, KMCQ GmbH enables customers to reclaim their digital sovereignty and maintain complete control over their essential technical infrastructure and data.</p>
<p style="color:#040f2d;font-size:16px;line-height:1.8;font-family:Arial,Helvetica,sans-serif;margin:0 0 20px 0"><strong>Mission:</strong></p>
<p style="color:#040f2d;font-size:16px;line-height:1.8;font-family:Arial,Helvetica,sans-serif;margin:0 0 20px 0">KMCQ GmbH mission is, To empower the global developer community by engineering high-performance cloud infrastructure and flexible VPS solutions that eliminate technical barriers, allowing creators to deploy, manage, and scale their most ambitious digital projects with absolute speed, precision, and unwavering reliability in an ever-evolving technological landscape.</p>
<p style="color:#040f2d;font-size:16px;line-height:1.8;font-family:Arial,Helvetica,sans-serif;margin:0 0 20px 0"><strong>Vision:</strong></p>
<p style="color:#040f2d;font-size:16px;line-height:1.8;font-family:Arial,Helvetica,sans-serif;margin:0">KMCQ GmbH vision is, To become the world\u2019s most trusted foundation for digital transformation, where seamless connectivity and sophisticated server architecture converge to inspire a future where every business, regardless of size, possesses the computational power and creative freedom to redefine what is possible on the modern web.</p>`;
}

export default function CustomPageEditor() {
  const params = useParams();
  const slug = params.slug as string;
  const [title, setTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [content, setContent] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [pageId, setPageId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/custom-pages").then(r => r.json()).then(async (pages: { id: number; slug: string; title: string }[]) => {
      const page = pages.find((p) => p.slug === slug);
      if (page) {
        setPageId(page.id);
        setTitle(page.title);
        setPageSlug(page.slug);
        fetch(`/api/custom-pages/${page.id}`).then(r => r.json()).then(data => {
          if (data.content) setContent(data.content);
          if (data.header_image) setHeaderImage(data.header_image);
          setLoading(false);
        });
      } else {
        const res = await fetch("/api/custom-pages", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, title: slug, content: buildDefaultContent(slug) }),
        });
        if (res.ok) {
          const created = await res.json();
          setPageId(created.id);
          setPageSlug(created.slug);
          setTitle(slug);
          setContent(buildDefaultContent(slug));
          if (created.header_image) setHeaderImage(created.header_image);
        }
        setLoading(false);
      }
    });
  }, [slug]);

  async function handleSave() {
    if (!pageId) return;
    setSaving(true); setMessage("");
    const res = await fetch(`/api/custom-pages/${pageId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: pageSlug, title, content, header_image: headerImage || null }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Edit: {title}</h1>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 6 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <HeaderImagePicker value={headerImage} onChange={setHeaderImage} />
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
