"use client";

import { useState, useEffect } from "react";

interface Review {
  id?: number; name: string; image: string; role: string; industry: string; text: string; rating: number;
}

export default function ReviewsEditor() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content/reviews").then(r => r.json()).then(setReviews);
  }, []);

  function updateReview(i: number, field: keyof Review, value: string | number) {
    const updated = [...reviews];
    updated[i] = { ...updated[i], [field]: value };
    setReviews(updated);
  }

  function addReview() {
    setReviews([...reviews, { name: "", image: "", role: "", industry: "", text: "", rating: 5 }]);
  }

  function removeReview(i: number) {
    setReviews(reviews.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/content/reviews", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviews }),
    });
    setMessage((await res.json()).message);
    setSaving(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Reviews Editor</h1>
      {reviews.map((r, i) => (
        <div key={i} style={{ marginBottom: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8, background: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <strong>Review {i + 1}</strong>
            <button onClick={() => removeReview(i)} style={{ color: "red", cursor: "pointer", background: "none", border: "none" }}>Remove</button>
          </div>
          <input placeholder="Name" value={r.name} onChange={(e) => updateReview(i, "name", e.target.value)}
            style={{ width: "48%", padding: 8, marginBottom: 8, marginRight: "2%", border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Image filename" value={r.image} onChange={(e) => updateReview(i, "image", e.target.value)}
            style={{ width: "48%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Role" value={r.role} onChange={(e) => updateReview(i, "role", e.target.value)}
            style={{ width: "48%", padding: 8, marginBottom: 8, marginRight: "2%", border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Industry" value={r.industry} onChange={(e) => updateReview(i, "industry", e.target.value)}
            style={{ width: "48%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <input placeholder="Rating (1-5)" type="number" min={1} max={5} value={r.rating} onChange={(e) => updateReview(i, "rating", parseInt(e.target.value) || 5)}
            style={{ width: "100%", padding: 8, marginBottom: 8, border: "1px solid #ddd", borderRadius: 4 }} />
          <textarea placeholder="Review text" value={r.text} onChange={(e) => updateReview(i, "text", e.target.value)}
            style={{ width: "100%", padding: 8, minHeight: 80, border: "1px solid #ddd", borderRadius: 4 }} />
        </div>
      ))}
      <button onClick={addReview} style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: 6, cursor: "pointer", marginRight: 10 }}>Add Review</button>
      <button onClick={handleSave} disabled={saving}
        style={{ padding: "12px 24px", background: "#040f2d", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
        {saving ? "Saving..." : "Save All"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
