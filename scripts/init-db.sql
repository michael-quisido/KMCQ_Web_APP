USE yournewdb;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  code VARCHAR(6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hero_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  content TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feature_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  content TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  description TEXT,
  content TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  role VARCHAR(255),
  industry VARCHAR(255),
  text TEXT NOT NULL,
  rating INT DEFAULT 5,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS about_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_name VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  content TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS custom_pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  header_image VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  href VARCHAR(500) NOT NULL,
  sort_order INT DEFAULT 0,
  location VARCHAR(20) NOT NULL DEFAULT 'header',
  section VARCHAR(50) DEFAULT NULL
);

INSERT INTO menu_items (label, href, sort_order, location, section) VALUES
('Home', '/', 0, 'header', NULL),
('Products', '/#products', 1, 'header', NULL),
('Reviews', '/#reviews', 2, 'header', NULL),
('Blog', '/blog', 3, 'header', NULL),
('About Us', '/#about-us', 4, 'header', NULL);

INSERT INTO menu_items (label, href, sort_order, location, section) VALUES
('KMCQ GmbH', '/about', 0, 'footer', 'about'),
('Career/Jobs', '/careers', 1, 'footer', 'about'),
('Partners', '/partners', 2, 'footer', 'about'),
('Contact Us', '/contact', 3, 'footer', 'about'),
('Data Hosting', '/data-hosting', 0, 'footer', 'products'),
('WordPress', '/wordpress', 1, 'footer', 'products'),
('Joomla', '/joomla', 2, 'footer', 'products'),
('Drupal', '/drupal', 3, 'footer', 'products'),
('VPS', '/vps', 4, 'footer', 'products'),
('Email Hosting', '/email-hosting', 5, 'footer', 'products'),
('KMCQ Community', '/community', 0, 'footer', 'community'),
('FAQs', '/faqs', 0, 'footer', 'learn-more'),
('Our Blog', '/blog', 1, 'footer', 'learn-more'),
('Become a Contributor', '/contributor', 2, 'footer', 'learn-more'),
('Terms of Use', '/terms', 0, 'footer', 'legal'),
('Policy', '/policy', 1, 'footer', 'legal');

CREATE TABLE IF NOT EXISTS social_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  url VARCHAR(500) NOT NULL,
  icon VARCHAR(100),
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_name VARCHAR(100) NOT NULL UNIQUE,
  value TEXT
);

CREATE TABLE IF NOT EXISTS media_folders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media_files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  path VARCHAR(500) NOT NULL,
  folder_id INT DEFAULT NULL,
  mime_type VARCHAR(100),
  size INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
