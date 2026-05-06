-- ================================================================
-- XGROW Platform — MySQL Schema v1.0
-- Database : xgrow_db  (cPanel: xcadoke_xgrow)
-- Engine   : InnoDB | Charset: utf8mb4_unicode_ci
-- Tables   : 22  |  Views: 2
-- Run via  : phpMyAdmin → Import → this file → Go
-- ================================================================

CREATE DATABASE IF NOT EXISTS xgrow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE xgrow_db;

CREATE TABLE regions (
  id         TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(80) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE counties (
  id          SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  region_id   TINYINT UNSIGNED NOT NULL,
  code        CHAR(3)      NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  capital     VARCHAR(100),
  agri_zone   VARCHAR(80),
  lat         DECIMAL(8,4),
  lng         DECIMAL(8,4),
  population  INT UNSIGNED,
  area_km2    INT UNSIGNED,
  rainfall_mm VARCHAR(20),
  elevation_m VARCHAR(20),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id),
  INDEX idx_region (region_id)
) ENGINE=InnoDB;

CREATE TABLE sub_counties (
  id         SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  county_id  SMALLINT UNSIGNED NOT NULL,
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE,
  INDEX idx_county (county_id)
) ENGINE=InnoDB;

CREATE TABLE county_crops (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  county_id  SMALLINT UNSIGNED NOT NULL,
  crop_name  VARCHAR(100) NOT NULL,
  is_primary TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE,
  INDEX idx_county (county_id),
  INDEX idx_crop   (crop_name)
) ENGINE=InnoDB;

CREATE TABLE organisations (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(200) NOT NULL,
  type           ENUM('SACCO','Cooperative','Corporate','NGO','Individual','Government') NOT NULL,
  county_id      SMALLINT UNSIGNED,
  sub_county_id  SMALLINT UNSIGNED,
  contact_name   VARCHAR(150),
  contact_phone  VARCHAR(20),
  contact_email  VARCHAR(150),
  plan           ENUM('Starter','Growth','Enterprise') DEFAULT 'Starter',
  domain         VARCHAR(100),
  active         TINYINT(1) DEFAULT 1,
  mrr_kes        DECIMAL(10,2) DEFAULT 0,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (county_id)     REFERENCES counties(id),
  FOREIGN KEY (sub_county_id) REFERENCES sub_counties(id)
) ENGINE=InnoDB;

CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id        INT UNSIGNED,
  role          ENUM('platform_admin','org_manager','agronomist','supplier','farmer') NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  phone         VARCHAR(20)  NOT NULL UNIQUE,
  email         VARCHAR(150) UNIQUE,
  national_id   VARCHAR(20),
  gender        ENUM('Female','Male','Other'),
  dob           DATE,
  password_hash VARCHAR(255),
  api_token     VARCHAR(64) UNIQUE,
  active        TINYINT(1) DEFAULT 1,
  last_login    TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organisations(id),
  INDEX idx_phone (phone),
  INDEX idx_role  (role)
) ENGINE=InnoDB;

CREATE TABLE farmers (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL UNIQUE,
  org_id          INT UNSIGNED,
  county_id       SMALLINT UNSIGNED NOT NULL,
  sub_county_id   SMALLINT UNSIGNED,
  ward            VARCHAR(100),
  village         VARCHAR(100),
  gps_lat         DECIMAL(10,6),
  gps_lng         DECIMAL(10,6),
  total_acres     DECIMAL(8,2) DEFAULT 0,
  primary_crop    VARCHAR(100),
  education_level VARCHAR(50),
  mpesa_number    VARCHAR(20),
  bank_account    VARCHAR(50),
  credit_score    TINYINT UNSIGNED DEFAULT 0,
  active          TINYINT(1) DEFAULT 1,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)       REFERENCES users(id),
  FOREIGN KEY (org_id)        REFERENCES organisations(id),
  FOREIGN KEY (county_id)     REFERENCES counties(id),
  FOREIGN KEY (sub_county_id) REFERENCES sub_counties(id),
  INDEX idx_county (county_id),
  INDEX idx_org    (org_id)
) ENGINE=InnoDB;

CREATE TABLE plots (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  farmer_id     INT UNSIGNED NOT NULL,
  county_id     SMALLINT UNSIGNED NOT NULL,
  sub_county_id SMALLINT UNSIGNED,
  plot_name     VARCHAR(100),
  area_acres    DECIMAL(8,2) NOT NULL,
  soil_type     VARCHAR(50),
  irrigation    ENUM('Rainfed','Drip','Sprinkler','Flood') DEFAULT 'Rainfed',
  altitude_m    INT,
  gps_polygon   TEXT COMMENT 'GeoJSON polygon string',
  primary_crop  VARCHAR(100),
  intercropped  TINYINT(1) DEFAULT 0,
  active        TINYINT(1) DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
  FOREIGN KEY (county_id) REFERENCES counties(id),
  INDEX idx_farmer (farmer_id)
) ENGINE=InnoDB;

CREATE TABLE crops (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plot_id          INT UNSIGNED NOT NULL,
  crop_name        VARCHAR(100) NOT NULL,
  variety          VARCHAR(100),
  planted_date     DATE,
  expected_harvest DATE,
  actual_harvest   DATE NULL,
  yield_kg         DECIMAL(10,2),
  quality_grade    VARCHAR(20),
  status           ENUM('Planted','Growing','Harvested','Lost') DEFAULT 'Planted',
  notes            TEXT,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plot_id) REFERENCES plots(id) ON DELETE CASCADE,
  INDEX idx_plot (plot_id)
) ENGINE=InnoDB;

CREATE TABLE listings (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id         INT UNSIGNED NOT NULL,
  farmer_id      INT UNSIGNED,
  crop_id        INT UNSIGNED,
  product_name   VARCHAR(150) NOT NULL,
  category       VARCHAR(60),
  quantity_kg    DECIMAL(12,2) NOT NULL,
  unit           VARCHAR(20) DEFAULT 'kg',
  price_kes      DECIMAL(12,2),
  price_usd      DECIMAL(12,4),
  grade          VARCHAR(20),
  certifications TEXT COMMENT 'JSON array',
  moq            DECIMAL(10,2),
  lead_days      TINYINT UNSIGNED DEFAULT 14,
  available_from DATE,
  status         ENUM('Active','Pending','Sold','Expired','Draft') DEFAULT 'Active',
  featured       TINYINT(1) DEFAULT 0,
  notes          TEXT,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id)    REFERENCES organisations(id),
  FOREIGN KEY (farmer_id) REFERENCES farmers(id),
  INDEX idx_status   (status),
  INDEX idx_featured (featured)
) ENGINE=InnoDB;

CREATE TABLE orders (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  listing_id    INT UNSIGNED NOT NULL,
  buyer_org_id  INT UNSIGNED NOT NULL,
  quantity_kg   DECIMAL(12,2) NOT NULL,
  unit          VARCHAR(20) DEFAULT 'kg',
  price_kes     DECIMAL(12,2),
  price_usd     DECIMAL(12,4),
  total_kes     DECIMAL(14,2),
  total_usd     DECIMAL(14,2),
  stage         ENUM('Confirmed','Escrow Funded','Quality Check','Dispatched','In Transit','Delivered','Cancelled') DEFAULT 'Confirmed',
  escrow_status ENUM('Pending','Funded','Released','Settled','Disputed') DEFAULT 'Pending',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id)   REFERENCES listings(id),
  FOREIGN KEY (buyer_org_id) REFERENCES organisations(id),
  INDEX idx_stage (stage)
) ENGINE=InnoDB;

CREATE TABLE shipments (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id       INT UNSIGNED NOT NULL,
  stage          ENUM('Farm','Packhouse','KEPHIS','Port','In Transit','Delivered') DEFAULT 'Farm',
  carrier        VARCHAR(150),
  tracking_ref   VARCHAR(100),
  vessel         VARCHAR(150),
  container_no   VARCHAR(50),
  port_loading   VARCHAR(100),
  port_discharge VARCHAR(100),
  etd            DATE,
  eta            DATE,
  atd            DATE NULL,
  ata            DATE NULL,
  notes          TEXT,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order (order_id)
) ENGINE=InnoDB;

CREATE TABLE payments (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id       INT UNSIGNED NOT NULL,
  type           ENUM('escrow_fund','release','refund','platform_fee') NOT NULL,
  amount_kes     DECIMAL(14,2),
  amount_usd     DECIMAL(14,4),
  fx_rate        DECIMAL(14,6),
  method         ENUM('M-Pesa','Bank Transfer','Equity H2H','Card') NOT NULL,
  reference      VARCHAR(100),
  status         ENUM('Pending','Completed','Failed') DEFAULT 'Pending',
  transacted_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  INDEX idx_order (order_id)
) ENGINE=InnoDB;

CREATE TABLE certifications (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id      INT UNSIGNED NOT NULL,
  cert_name   VARCHAR(150) NOT NULL,
  cert_body   VARCHAR(200),
  status      ENUM('Not Started','In Progress','Certified','Renewal Due','Expired') DEFAULT 'Not Started',
  issued_date DATE NULL,
  expiry_date DATE NULL,
  cert_file   VARCHAR(500),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_expiry (expiry_date)
) ENGINE=InnoDB;

CREATE TABLE trace_records (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  qr_id         VARCHAR(20)  NOT NULL UNIQUE,
  order_id      INT UNSIGNED,
  farmer_id     INT UNSIGNED,
  product_name  VARCHAR(150),
  quantity_kg   DECIMAL(12,2),
  buyer_name    VARCHAR(200),
  grade         VARCHAR(20),
  gps_lat       DECIMAL(10,6),
  gps_lng       DECIMAL(10,6),
  export_date   DATE,
  certifications TEXT,
  scan_count    INT UNSIGNED DEFAULT 0,
  public_url    VARCHAR(300),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id)  REFERENCES orders(id),
  FOREIGN KEY (farmer_id) REFERENCES farmers(id),
  INDEX idx_qr (qr_id)
) ENGINE=InnoDB;

CREATE TABLE trace_events (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  trace_id    INT UNSIGNED NOT NULL,
  stage       VARCHAR(100),
  location    VARCHAR(200),
  actor       VARCHAR(200),
  note        TEXT,
  tx_hash     VARCHAR(70) COMMENT 'Blockchain hash',
  verified    TINYINT(1) DEFAULT 0,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trace_id) REFERENCES trace_records(id) ON DELETE CASCADE,
  INDEX idx_trace (trace_id)
) ENGINE=InnoDB;

CREATE TABLE api_keys (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id      INT UNSIGNED NOT NULL,
  label       VARCHAR(100),
  key_hash    VARCHAR(64) NOT NULL UNIQUE,
  environment ENUM('production','sandbox') DEFAULT 'sandbox',
  last_used   TIMESTAMP NULL,
  active      TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  type       VARCHAR(40),
  title      VARCHAR(200),
  body       TEXT,
  urgency    ENUM('low','normal','high') DEFAULT 'normal',
  read_at    TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user   (user_id),
  INDEX idx_unread (read_at)
) ENGINE=InnoDB;

CREATE TABLE price_alerts (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id         INT UNSIGNED NOT NULL,
  commodity      VARCHAR(100),
  market         ENUM('Farm Gate','FOB','CIF EU','CIF UAE','CIF Japan') DEFAULT 'FOB',
  threshold_usd  DECIMAL(12,4),
  direction      ENUM('above','below') DEFAULT 'above',
  notify_email   VARCHAR(150),
  notify_phone   VARCHAR(20),
  active         TINYINT(1) DEFAULT 1,
  last_triggered TIMESTAMP NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE training_progress (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  module_id    VARCHAR(10)  NOT NULL,
  progress_pct TINYINT UNSIGNED DEFAULT 0,
  completed_at TIMESTAMP NULL,
  cert_issued  TINYINT(1) DEFAULT 0,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_module (user_id, module_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE webhook_endpoints (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  org_id     INT UNSIGNED NOT NULL,
  event      VARCHAR(80)  NOT NULL,
  url        VARCHAR(500) NOT NULL,
  active     TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE CASCADE,
  INDEX idx_event (event)
) ENGINE=InnoDB;

CREATE TABLE fx_rates (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  base        CHAR(3) DEFAULT 'KES',
  currency    CHAR(3) NOT NULL,
  rate        DECIMAL(16,8) NOT NULL,
  source      VARCHAR(50),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_currency (currency)
) ENGINE=InnoDB;

-- Seed FX rates
INSERT INTO fx_rates (base, currency, rate, source) VALUES
  ('KES','USD', 0.00775, 'Equity Bank H2H'),
  ('KES','EUR', 0.00713, 'Equity Bank H2H'),
  ('KES','GBP', 0.00610, 'Equity Bank H2H'),
  ('KES','AED', 0.02848, 'Equity Bank H2H');

-- Views
CREATE OR REPLACE VIEW v_farmer_summary AS
  SELECT f.id AS farmer_id,
         CONCAT(u.first_name,' ',u.last_name) AS full_name,
         u.phone, c.name AS county, sc.name AS sub_county,
         f.total_acres, f.primary_crop, f.credit_score,
         COUNT(p.id) AS plot_count
  FROM   farmers f
  JOIN   users u        ON u.id  = f.user_id
  JOIN   counties c     ON c.id  = f.county_id
  LEFT JOIN sub_counties sc ON sc.id = f.sub_county_id
  LEFT JOIN plots p     ON p.farmer_id = f.id
  WHERE  f.active = 1
  GROUP  BY f.id;

CREATE OR REPLACE VIEW v_platform_summary AS
  SELECT
    (SELECT COUNT(*) FROM farmers  WHERE active=1)               AS active_farmers,
    (SELECT COUNT(*) FROM listings WHERE status='Active')        AS active_listings,
    (SELECT COUNT(*) FROM orders   WHERE stage NOT IN('Cancelled')) AS total_orders,
    (SELECT COALESCE(SUM(total_kes),0) FROM orders WHERE stage='Delivered') AS lifetime_gmv_kes,
    (SELECT COUNT(*) FROM trace_records)                         AS traced_shipments,
    (SELECT COUNT(DISTINCT county_id) FROM farmers WHERE active=1) AS counties_covered;
