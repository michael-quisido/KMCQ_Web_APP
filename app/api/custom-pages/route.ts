import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";
import type { ResultSetHeader } from "mysql2/promise";

export async function GET() {
  const rows = await query("SELECT id, slug, title, header_image, created_at, updated_at FROM custom_pages ORDER BY id ASC");
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug, title, content, header_image } = await req.json();
  if (!slug || !title) return NextResponse.json({ error: "Slug and title required" }, { status: 400 });

  try {
    const result = await query("INSERT INTO custom_pages (slug, title, content, header_image) VALUES (?, ?, ?, ?)", [slug, title, content || "", header_image || null]) as ResultSetHeader;
    return NextResponse.json({ id: result.insertId, slug, title, header_image });
  } catch (err: unknown) {
    if ((err as Record<string, unknown>).code === "ER_DUP_ENTRY") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    throw err;
  }
}
