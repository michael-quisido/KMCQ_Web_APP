import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query("SELECT * FROM reviews ORDER BY sort_order ASC") as any[];
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reviews } = await req.json();
  await query("DELETE FROM reviews");
  for (let i = 0; i < reviews.length; i++) {
    const r = reviews[i];
    await query("INSERT INTO reviews (name, image, role, industry, text, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [r.name, r.image || "", r.role || "", r.industry || "", r.text, r.rating || 5, i]);
  }
  return NextResponse.json({ message: "Saved" });
}
