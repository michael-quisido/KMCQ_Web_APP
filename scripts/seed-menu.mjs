import mysql from "mysql2/promise";

const DB_CONFIG = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "yourusernamedb",
  password: process.env.DB_PASSWORD || "yoursampledbpassword",
  database: process.env.DB_NAME || "yournewdb",
};

const defaultSections = [
  { section_key: "about", section_label: "About Us", sort_order: 0 },
  { section_key: "products", section_label: "Products", sort_order: 1 },
  { section_key: "community", section_label: "Community", sort_order: 2 },
  { section_key: "learn-more", section_label: "Learn More", sort_order: 3 },
  { section_key: "legal", section_label: "Terms & Policy", sort_order: 4 },
];

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

  // Migration: add location/section columns if missing
  try {
    await pool.execute("SELECT location FROM menu_items LIMIT 1");
  } catch {
    console.log("Running migration: adding location/section columns...");
    await pool.execute("ALTER TABLE menu_items ADD COLUMN location VARCHAR(20) NOT NULL DEFAULT 'header'");
    await pool.execute("ALTER TABLE menu_items ADD COLUMN section VARCHAR(50) DEFAULT NULL");
  }

  // Migration: create menu_sections table if missing
  try {
    await pool.execute("SELECT 1 FROM menu_sections LIMIT 1");
  } catch {
    console.log("Running migration: creating menu_sections table...");
    await pool.execute(
      "CREATE TABLE IF NOT EXISTS menu_sections (id INT AUTO_INCREMENT PRIMARY KEY, section_key VARCHAR(50) NOT NULL UNIQUE, section_label VARCHAR(100) NOT NULL, sort_order INT DEFAULT 0)"
    );
  }

  // Seed sections
  await pool.execute("DELETE FROM menu_sections");
  for (const s of defaultSections) {
    await pool.execute(
      "INSERT INTO menu_sections (section_key, section_label, sort_order) VALUES (?, ?, ?)",
      [s.section_key, s.section_label, s.sort_order]
    );
  }
  console.log(`Seeded ${defaultSections.length} menu sections.`);

  // Seed menu items
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

  // Migration: add url column to products if missing
  try {
    await pool.execute("SELECT url FROM products LIMIT 1");
  } catch {
    console.log("Running migration: adding url column to products...");
    await pool.execute("ALTER TABLE products ADD COLUMN url VARCHAR(500) DEFAULT NULL AFTER content");
  }

  // Seed product URLs for existing products that have empty url
  await pool.execute("UPDATE products SET url = '/data-hosting' WHERE name LIKE '%Data Web Hosting%' AND (url IS NULL OR url = '')");
  await pool.execute("UPDATE products SET url = '/wordpress' WHERE name LIKE '%WordPress%' AND (url IS NULL OR url = '')");
  await pool.execute("UPDATE products SET url = '/email-hosting' WHERE name LIKE '%Email Hosting%' AND (url IS NULL OR url = '')");
  await pool.execute("UPDATE products SET url = '/vps' WHERE name LIKE '%VPS%' AND (url IS NULL OR url = '')");

  // Seed hero content
  const [heroRows] = await pool.execute("SELECT COUNT(*) AS cnt FROM hero_content");
  if (heroRows[0].cnt === 0) {
    await pool.execute(
      "INSERT INTO hero_content (title, subtitle, content) VALUES (?, ?, ?)",
      [
        "Unlock Your Digital Future.",
        "Seamless, Secure, Scalable Cloud Solutions.",
        "<p style='color:#ffffff;font-size:18px;line-height:1.8;text-align:center;max-width:700px;margin:0 auto'>KMCQ GmbH provides enterprise-grade cloud infrastructure and VPS solutions designed for developers, businesses, and organizations that demand performance, reliability, and complete control over their digital infrastructure.</p>"
      ]
    );
    console.log("Seeded hero content.");
  } else {
    console.log("hero_content already has data, skipping.");
  }

  console.log(`Seeded ${defaultItems.length} menu items (header + footer).`);
  await pool.end();
}

seed().catch(console.error);
