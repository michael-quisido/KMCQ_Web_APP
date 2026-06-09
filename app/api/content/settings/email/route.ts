import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { query } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

const SETTING_KEYS = ["smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from"];

async function getSettings() {
  const rows = await query("SELECT key_name, value FROM site_settings WHERE key_name IN (?, ?, ?, ?, ?)", SETTING_KEYS) as RowDataPacket[];
  const settings: Record<string, string> = {};
  for (const row of rows as { key_name: string; value: string }[]) {
    settings[row.key_name] = row.value;
  }
  return settings;
}

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({
    smtp_host: settings.smtp_host || "",
    smtp_port: settings.smtp_port || "587",
    smtp_user: settings.smtp_user || "",
    smtp_pass: settings.smtp_pass || "",
    smtp_from: settings.smtp_from || "",
  });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from } = await req.json();

  const values: Record<string, string> = {
    smtp_host: smtp_host || "",
    smtp_port: smtp_port || "587",
    smtp_user: smtp_user || "",
    smtp_pass: smtp_pass || "",
    smtp_from: smtp_from || "",
  };

  for (const key of SETTING_KEYS) {
    const existing = await query("SELECT id FROM site_settings WHERE key_name = ?", [key]) as RowDataPacket[];
    if ((existing as { id: number }[]).length > 0) {
      await query("UPDATE site_settings SET value = ? WHERE key_name = ?", [values[key], key]);
    } else {
      await query("INSERT INTO site_settings (key_name, value) VALUES (?, ?)", [key, values[key]]);
    }
  }

  return NextResponse.json({ message: "Email settings saved" });
}
