import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

export async function GET() {
  const rows = await query("SELECT * FROM hero_content LIMIT 1") as RowDataPacket[];
  return NextResponse.json(rows[0] || {});
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, subtitle, content } = await req.json();
  const existing = await query("SELECT id FROM hero_content LIMIT 1") as RowDataPacket[];
  if (existing.length > 0) {
    await query("UPDATE hero_content SET title = ?, subtitle = ?, content = ? WHERE id = ?", [title, subtitle, content, existing[0].id]);
  } else {
    await query("INSERT INTO hero_content (title, subtitle, content) VALUES (?, ?, ?)", [title, subtitle, content]);
  }
  return NextResponse.json({ message: "Saved" });
}
