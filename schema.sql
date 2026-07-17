-- ============================================
-- Portfolio Database Schema for Cloudflare D1
-- Version: 2.0
-- ============================================

-- TABLE: config
CREATE TABLE IF NOT EXISTS config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  hero_greeting TEXT NOT NULL DEFAULT 'Hai, Saya',
  hero_name TEXT NOT NULL DEFAULT 'Eka Ryan',
  hero_description TEXT NOT NULL DEFAULT '',
  hero_tagline TEXT NOT NULL DEFAULT '',
  hero_image TEXT NOT NULL DEFAULT '',
  guarantee_title TEXT NOT NULL DEFAULT '',
  guarantee_desc TEXT NOT NULL DEFAULT '',
  guarantee_p1 TEXT NOT NULL DEFAULT '',
  guarantee_p2 TEXT NOT NULL DEFAULT '',
  guarantee_p3 TEXT NOT NULL DEFAULT '',
  quality_title TEXT NOT NULL DEFAULT '',
  quality_desc TEXT NOT NULL DEFAULT '',
  quality_p1 TEXT NOT NULL DEFAULT '',
  quality_p2 TEXT NOT NULL DEFAULT '',
  quality_p3 TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT '',
  contact_wa TEXT NOT NULL DEFAULT '',
  contact_location TEXT NOT NULL DEFAULT '',
  contact_website TEXT NOT NULL DEFAULT '',
  social_linkedin TEXT NOT NULL DEFAULT '',
  social_instagram TEXT NOT NULL DEFAULT '',
  social_tiktok TEXT NOT NULL DEFAULT '',
  social_twitter TEXT NOT NULL DEFAULT '',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO config (id) VALUES ('main');

-- TABLE: services
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_services_sort ON services(sort_order);

-- TABLE: service_details
CREATE TABLE IF NOT EXISTS service_details (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_service_details_service ON service_details(service_id);

-- TABLE: service_tags
CREATE TABLE IF NOT EXISTS service_tags (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_service_tags_service ON service_tags(service_id);

-- TABLE: workflow
CREATE TABLE IF NOT EXISTS workflow (
  id TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  short_desc TEXT NOT NULL DEFAULT '',
  long_desc TEXT NOT NULL DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workflow_sort ON workflow(sort_order);

-- TABLE: skills
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skills_sort ON skills(sort_order);

-- TABLE: messages
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL DEFAULT '',
  service_id TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  add_ons TEXT NOT NULL DEFAULT '[]',
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- TABLE: add_ons
CREATE TABLE IF NOT EXISTS add_ons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_addons_category ON add_ons(category);
CREATE INDEX IF NOT EXISTS idx_addons_sort ON add_ons(sort_order);
