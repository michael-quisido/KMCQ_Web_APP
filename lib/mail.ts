import nodemailer from "nodemailer";
import { query } from "./db";
import type { RowDataPacket } from "mysql2/promise";

export async function getSmtpConfig() {
  const rows = await query("SELECT key_name, value FROM site_settings WHERE key_name IN (?, ?, ?, ?, ?)", ["smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from"]) as RowDataPacket[];
  const config: Record<string, string> = {};
  for (const row of rows as { key_name: string; value: string }[]) {
    config[row.key_name] = row.value;
  }
  return config;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const config = await getSmtpConfig();
  if (!config.smtp_host || !config.smtp_user || !config.smtp_pass) {
    console.log("[MAIL] SMTP not configured. Would send:", { to, subject, html });
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: parseInt(config.smtp_port || "587", 10),
    secure: config.smtp_port === "465",
    auth: { user: config.smtp_user, pass: config.smtp_pass },
  });

  await transporter.sendMail({
    from: config.smtp_from || config.smtp_user,
    to,
    subject,
    html,
  });

  return true;
}
