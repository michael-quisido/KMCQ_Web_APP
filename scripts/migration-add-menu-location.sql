ALTER TABLE menu_items ADD COLUMN location VARCHAR(20) NOT NULL DEFAULT 'header';
ALTER TABLE menu_items ADD COLUMN section VARCHAR(50) DEFAULT NULL;

UPDATE menu_items SET location = 'header' WHERE location = 'header';
