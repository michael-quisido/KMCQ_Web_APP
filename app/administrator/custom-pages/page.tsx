"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomPagesList() {
  const [pages, setPages] = useState<{ id: number; slug: string; title: string; created_at: string }[]>([]);
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/custom-pages").then(r => r.json()).then(setPages);
  }, []);

  async function handleCreate() {
    if (!newSlug || !newTitle) return;
    const res = await fetch("/api/custom-pages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: newSlug, title: newTitle }),
    });
    if (res.ok) {
      setNewSlug(""); setNewTitle("");
      const data = await res.json();
      router.push(`/administrator/custom-pages/${data.slug}`);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this page?")) return;
    await fetch(`/api/custom-pages/${id}`, { method: "DELETE" });
    setPages(pages.filter(p => p.id !== id));
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Custom Pages</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input placeholder="Slug (e.g. our-team)" value={newSlug} onChange={(e) => setNewSlug(e.target.value)}
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 6, flex: 1 }} />
        <input placeholder="Page title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 6, flex: 1 }} />
        <button onClick={handleCreate} style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Create</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#040f2d", color: "white" }}>
            <th style={{ padding: 10, textAlign: "left" }}>Title</th>
            <th style={{ padding: 10, textAlign: "left" }}>Slug</th>
            <th style={{ padding: 10, textAlign: "left" }}>Created</th>
            <th style={{ padding: 10, textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(p => (
            <tr key={p.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: 10 }}>{p.title}</td>
              <td style={{ padding: 10 }}>/{p.slug}</td>
              <td style={{ padding: 10 }}>{new Date(p.created_at).toLocaleDateString()}</td>
              <td style={{ padding: 10 }}>
                <Link href={`/administrator/custom-pages/${p.slug}`} style={{ color: "#007bff", marginRight: 10 }}>Edit</Link>
                <button onClick={() => handleDelete(p.id)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pages.length === 0 && <p style={{ color: "#999", textAlign: "center", padding: 40 }}>No custom pages yet.</p>}
    </div>
  );
}
