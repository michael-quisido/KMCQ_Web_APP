import mysql from "mysql2/promise";

const DB_CONFIG = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "yourusernamedb",
  password: process.env.DB_PASSWORD || "yoursampledbpassword",
  database: process.env.DB_NAME || "yournewdb",
};

const defaultItems = [
  // Header nav
  { label: "Home", href: "/", sort_order: 0, location: "header", section: null },
  { label: "Products", href: "/#products", sort_order: 1, location: "header", section: null },
  { label: "Reviews", href: "/#reviews", sort_order: 2, location: "header", section: null },
  { label: "Blog", href: "/blog", sort_order: 3, location: "header", section: null },
  { label: "About Us", href: "/#about-us", sort_order: 4, location: "header", section: null },
  // Footer - About Us column
  { label: "KMCQ GmbH", href: "/about", sort_order: 0, location: "footer", section: "about" },
  { label: "Career/Jobs", href: "/careers", sort_order: 1, location: "footer", section: "about" },
  { label: "Partners", href: "/partners", sort_order: 2, location: "footer", section: "about" },
  { label: "Contact Us", href: "/contact", sort_order: 3, location: "footer", section: "about" },
  // Footer - Products column
  { label: "Data Hosting", href: "/data-hosting", sort_order: 0, location: "footer", section: "products" },
  { label: "WordPress", href: "/wordpress", sort_order: 1, location: "footer", section: "products" },
  { label: "Joomla", href: "/joomla", sort_order: 2, location: "footer", section: "products" },
  { label: "Drupal", href: "/drupal", sort_order: 3, location: "footer", section: "products" },
  { label: "VPS", href: "/vps", sort_order: 4, location: "footer", section: "products" },
  { label: "Email Hosting", href: "/email-hosting", sort_order: 5, location: "footer", section: "products" },
  // Footer - Community column
  { label: "KMCQ Community", href: "/community", sort_order: 0, location: "footer", section: "community" },
  // Footer - Learn More column
  { label: "FAQs", href: "/faqs", sort_order: 0, location: "footer", section: "learn-more" },
  { label: "Our Blog", href: "/blog", sort_order: 1, location: "footer", section: "learn-more" },
  { label: "Become a Contributor", href: "/contributor", sort_order: 2, location: "footer", section: "learn-more" },
  // Footer - Legal (second row)
  { label: "Terms of Use", href: "/terms", sort_order: 0, location: "footer", section: "legal" },
  { label: "Policy", href: "/policy", sort_order: 1, location: "footer", section: "legal" },
];

async function seed() {
  const pool = mysql.createPool(DB_CONFIG);

  // Check if columns exist, add migration if needed
  try {
    await pool.execute("SELECT location FROM menu_items LIMIT 1");
  } catch {
    console.log("Running migration: adding location/section columns...");
    await pool.execute("ALTER TABLE menu_items ADD COLUMN location VARCHAR(20) NOT NULL DEFAULT 'header'");
    await pool.execute("ALTER TABLE menu_items ADD COLUMN section VARCHAR(50) DEFAULT NULL");
  }

  const [rows] = await pool.execute("SELECT COUNT(*) AS cnt FROM menu_items");
  const count = rows[0].cnt;
  if (count > 0) {
    console.log(`menu_items table already has ${count} row(s). Clearing and re-seeding...`);
    await pool.execute("DELETE FROM menu_items");
  }

  for (const item of defaultItems) {
    await pool.execute(
      "INSERT INTO menu_items (label, href, sort_order, location, section) VALUES (?, ?, ?, ?, ?)",
      [item.label, item.href, item.sort_order, item.location, item.section]
    );
  }

  console.log(`Seeded ${defaultItems.length} menu items (header + footer).`);
  await pool.end();
}

seed().catch(console.error);
