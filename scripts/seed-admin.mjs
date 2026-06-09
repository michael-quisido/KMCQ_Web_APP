import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const DB_CONFIG = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "yourusernamedb",
  password: process.env.DB_PASSWORD || "yoursampledbpassword",
  database: process.env.DB_NAME || "yournewdb",
};

async function seed() {
  const pool = mysql.createPool(DB_CONFIG);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      username VARCHAR(100) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      code VARCHAR(6),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Ensured admins table exists.");

  const [existing] = await pool.execute("SELECT id FROM admins WHERE email = ?", ["admin@kmcq.com"]) as any;
  if (existing.length > 0) {
    console.log("Admin admin@kmcq.com already exists. Skipping.");
    await pool.end();
    return;
  }

  const password = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(password, 10);
  await pool.execute(
    "INSERT INTO admins (email, username, password_hash) VALUES (?, ?, ?)",
    ["admin@kmcq.com", "admin", hash]
  );
  console.log(`Created admin: admin@kmcq.com / username: admin / password: ${password}`);
  console.log("IMPORTANT: Change the password after first login.");

  await pool.end();
}

seed().catch(console.error);
