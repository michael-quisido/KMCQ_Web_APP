import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

export async function GET() {
  const rows = await query("SELECT * FROM social_links ORDER BY sort_order ASC") as RowDataPacket[];
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { links } = await req.json();
  await query("DELETE FROM social_links");
  for (let i = 0; i < links.length; i++) {
    await query("INSERT INTO social_links (platform, url, icon, sort_order) VALUES (?, ?, ?, ?)",
      [links[i].platform, links[i].url, links[i].icon || "", i]);
  }
  return NextResponse.json({ message: "Saved" });
}
