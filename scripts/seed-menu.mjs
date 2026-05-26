import mysql from "mysql2/promise";

const DB_CONFIG = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "yourusernamedb",
  password: process.env.DB_PASSWORD || "yoursampledbpassword",
  database: process.env.DB_NAME || "yournewdb",
};

const defaultItems = [
  { label: "Home", href: "/", sort_order: 0 },
  { label: "Products", href: "/#products", sort_order: 1 },
  { label: "Reviews", href: "/#reviews", sort_order: 2 },
  { label: "Blog", href: "/blog", sort_order: 3 },
  { label: "About Us", href: "/#about-us", sort_order: 4 },
];

async function seed() {
  const pool = mysql.createPool(DB_CONFIG);

  const [rows] = await pool.execute("SELECT COUNT(*) AS cnt FROM menu_items");
  const count = rows[0].cnt;
  if (count > 0) {
    console.log(`menu_items table already has ${count} row(s). Skipping seed.`);
    await pool.end();
    return;
  }

  for (const item of defaultItems) {
    await pool.execute(
      "INSERT INTO menu_items (label, href, sort_order) VALUES (?, ?, ?)",
      [item.label, item.href, item.sort_order]
    );
  }

  console.log(`Seeded ${defaultItems.length} default menu items.`);
  await pool.end();
}

seed().catch(console.error);
