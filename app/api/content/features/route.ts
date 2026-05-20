import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query("SELECT * FROM feature_cards ORDER BY sort_order ASC") as any[];
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cards } = await req.json();
  await query("DELETE FROM feature_cards");
  for (let i = 0; i < cards.length; i++) {
    await query("INSERT INTO feature_cards (title, icon, content, sort_order) VALUES (?, ?, ?, ?)", [cards[i].title, cards[i].icon || "", cards[i].content, i]);
  }
  return NextResponse.json({ message: "Saved" });
}
