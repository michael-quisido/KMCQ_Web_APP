import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

export async function GET() {
  const rows = await query("SELECT * FROM about_content ORDER BY id ASC") as RowDataPacket[];
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sections } = await req.json();
  await query("DELETE FROM about_content");
  for (const s of sections) {
    await query("INSERT INTO about_content (section_name, title, content) VALUES (?, ?, ?)",
      [s.section_name, s.title || "", s.content || ""]);
  }
  return NextResponse.json({ message: "Saved" });
}
