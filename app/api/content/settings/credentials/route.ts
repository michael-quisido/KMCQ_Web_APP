import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies, hashPassword, verifyPassword } from "@/lib/auth";
import { query } from "@/lib/db";

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newUsername, newPassword, newEmail } = await req.json();

  const admins = await query("SELECT id, password_hash FROM admins WHERE id = ?", [user.id]) as any[];
  if (admins.length === 0) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

  const valid = await verifyPassword(currentPassword, admins[0].password_hash);
  if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });

  const updates: string[] = [];
  const params: any[] = [];

  if (newUsername) { updates.push("username = ?"); params.push(newUsername); }
  if (newPassword) { updates.push("password_hash = ?"); params.push(await hashPassword(newPassword)); }
  if (newEmail) { updates.push("email = ?"); params.push(newEmail); }

  if (updates.length > 0) {
    params.push(user.id);
    await query(`UPDATE admins SET ${updates.join(", ")} WHERE id = ?`, params);
  }

  return NextResponse.json({ message: "Credentials updated" });
}
