import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location") || "header";
  const rows = await query(
    "SELECT * FROM menu_items WHERE location = ? ORDER BY sort_order ASC",
    [location]
  ) as RowDataPacket[];
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items, location } = await req.json();
  const loc = location || "header";
  await query("DELETE FROM menu_items WHERE location = ?", [loc]);
  for (let i = 0; i < items.length; i++) {
    await query(
      "INSERT INTO menu_items (label, href, sort_order, location, section) VALUES (?, ?, ?, ?, ?)",
      [items[i].label, items[i].href, i, loc, items[i].section || null]
    );
  }
  return NextResponse.json({ message: "Saved" });
}
