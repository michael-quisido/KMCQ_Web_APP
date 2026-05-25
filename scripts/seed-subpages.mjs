import mysql from "mysql2/promise";

const DB_CONFIG = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "yourusernamedb",
  password: process.env.DB_PASSWORD || "yoursampledbpassword",
  database: process.env.DB_NAME || "yournewdb",
};

const subpages = [
  { slug: "about", title: "About Us" },
  { slug: "careers", title: "Career/Jobs" },
  { slug: "partners", title: "Our Partners" },
  { slug: "contact", title: "Contact Us" },
  { slug: "data-hosting", title: "Data Hosting" },
  { slug: "wordpress", title: "WordPress" },
  { slug: "joomla", title: "Joomla" },
  { slug: "drupal", title: "Drupal" },
  { slug: "vps", title: "VPS" },
  { slug: "email-hosting", title: "Email Hosting" },
  { slug: "community", title: "Our Community" },
  { slug: "faqs", title: "FAQs" },
  { slug: "contributor", title: "Become a Contributor" },
  { slug: "terms", title: "Terms of Use" },
  { slug: "policy", title: "Our Policy" },
];

function buildContent(title) {
  return `<h1 style="color:#040f2d;font-size:37px;font-weight:bold;font-family:Arial,Helvetica,sans-serif;margin:0 0 30px 0">${title}</h1>
<p style="color:#040f2d;font-size:16px;line-height:1.8;font-family:Arial,Helvetica,sans-serif;margin:0 0 20px 0">KMCQ GmbH, headquartered in Cebu, Philippines, has specialized in open-source industrial technology for 15 years. We believe secure, free communication is the foundation of progress; it has been our core source code for decades. As premier Linux experts, we provide professional, eye-level partnership to companies, the public sector, and individuals. By navigating diverse business landscapes, KMCQ GmbH enables customers to reclaim their digital sovereignty and maintain complete control over their essential technical infrastructure and data.</p>
<p style="color:#040f2d;font-size:16px;line-height:1.8;font-family:Arial,Helvetica,sans-serif;margin:0 0 20px 0"><strong>Mission:</strong></p>
<p style="color:#040f2d;font-size:16px;line-height:1.8;font-family:Arial,Helvetica,sans-serif;margin:0 0 20px 0">KMCQ GmbH mission is, To empower the global developer community by engineering high-performance cloud infrastructure and flexible VPS solutions that eliminate technical barriers, allowing creators to deploy, manage, and scale their most ambitious digital projects with absolute speed, precision, and unwavering reliability in an ever-evolving technological landscape.</p>
<p style="color:#040f2d;font-size:16px;line-height:1.8;font-family:Arial,Helvetica,sans-serif;margin:0 0 20px 0"><strong>Vision:</strong></p>
<p style="color:#040f2d;font-size:16px;line-height:1.8;font-family:Arial,Helvetica,sans-serif;margin:0">KMCQ GmbH vision is, To become the world\u2019s most trusted foundation for digital transformation, where seamless connectivity and sophisticated server architecture converge to inspire a future where every business, regardless of size, possesses the computational power and creative freedom to redefine what is possible on the modern web.</p>`;
}

async function seed() {
  const pool = mysql.createPool(DB_CONFIG);
  let count = 0;

  for (const { slug, title } of subpages) {
    const [rows] = await pool.execute(
      "SELECT id FROM custom_pages WHERE slug = ?", [slug]
    );
    if (rows.length === 0) {
      const content = buildContent(title);
      await pool.execute(
        "INSERT INTO custom_pages (slug, title, content, header_image) VALUES (?, ?, ?, ?)",
        [slug, title, content, "/header_images/tazz.jpg"]
      );
      console.log(`  Created: ${slug} (${title})`);
      count++;
    } else {
      console.log(`  Exists: ${slug}`);
    }
  }

  console.log(`\nDone. ${count} pages created.`);
  await pool.end();
}

seed().catch(console.error);
