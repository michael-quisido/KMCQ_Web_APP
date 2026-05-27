CREATE TABLE IF NOT EXISTS menu_sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_key VARCHAR(50) NOT NULL UNIQUE,
  section_label VARCHAR(100) NOT NULL,
  sort_order INT DEFAULT 0
);

INSERT INTO menu_sections (section_key, section_label, sort_order) VALUES
('about', 'About Us', 0),
('products', 'Products', 1),
('community', 'Community', 2),
('learn-more', 'Learn More', 3),
('legal', 'Terms & Policy', 4);
