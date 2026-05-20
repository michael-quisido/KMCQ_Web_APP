import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query("SELECT id, slug, title, created_at, updated_at FROM custom_pages ORDER BY id ASC");
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug, title, content } = await req.json();
  if (!slug || !title) return NextResponse.json({ error: "Slug and title required" }, { status: 400 });

  try {
    const result = await query("INSERT INTO custom_pages (slug, title, content) VALUES (?, ?, ?)", [slug, title, content || ""]) as any;
    return NextResponse.json({ id: result.insertId, slug, title });
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    throw err;
  }
}
