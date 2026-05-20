import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query("SELECT * FROM menu_items ORDER BY sort_order ASC") as any[];
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items } = await req.json();
  await query("DELETE FROM menu_items");
  for (let i = 0; i < items.length; i++) {
    await query("INSERT INTO menu_items (label, href, sort_order) VALUES (?, ?, ?)",
      [items[i].label, items[i].href, i]);
  }
  return NextResponse.json({ message: "Saved" });
}
