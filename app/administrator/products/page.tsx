"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Product {
  id?: number; name: string; icon: string; description: string; content: string;
}

export default function ProductsEditor() {
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content/products").then(r => r.json()).then(setProducts);
  }, []);

  function updateProduct(i: number, field: keyof Product, value: string) {
    const updated = [...products];
    updated[i] = { ...updated[i], [field]: value };
    setProducts(updated);
  }

  function addProduct() {
    setProducts([...products, { name: "", icon: "", description: "", content: "" }]);
  }

  function removeProduct(i: number) {
    setProducts(products.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/products", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Products Editor</h1>
      {products.map((p, i) => (
        <div key={i} style={{ marginBottom: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8, background: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <strong>Product {i + 1}</strong>
            <button onClick={() => removeProduct(i)} style={{ color: "red", cursor: "pointer", background: "none", border: "none" }}>Remove</button>
          </div>
          <input placeholder="Name" value={p.name} onChange={(e) => updateProduct(i, "name", e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Icon name" value={p.icon} onChange={(e) => updateProduct(i, "icon", e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Short description" value={p.description} onChange={(e) => updateProduct(i, "description", e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <RichTextEditor content={p.content} onChange={(v) => updateProduct(i, "content", v)} />
        </div>
      ))}
      <button onClick={addProduct} style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer", marginRight: 10 }}>Add Product</button>
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Save All"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
