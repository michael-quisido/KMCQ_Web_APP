-- Migration: Add header_image column to custom_pages table
ALTER TABLE custom_pages ADD COLUMN header_image VARCHAR(500) DEFAULT NULL AFTER content;
