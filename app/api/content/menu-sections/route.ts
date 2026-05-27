import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

export async function GET() {
  const rows = await query("SELECT * FROM menu_sections ORDER BY sort_order ASC") as RowDataPacket[];
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sections } = await req.json();
  await query("DELETE FROM menu_sections");
  for (let i = 0; i < sections.length; i++) {
    await query(
      "INSERT INTO menu_sections (section_key, section_label, sort_order) VALUES (?, ?, ?)",
      [sections[i].section_key, sections[i].section_label, i]
    );
  }
  return NextResponse.json({ message: "Saved" });
}
