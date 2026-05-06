-- ================================================================
-- XCADO Platform Admin Setup
-- Run Section 1 in xgrow_db | Run Section 2 in xcadoke_xcado
-- EDIT: YOUR_FIRST_NAME  YOUR_LAST_NAME  +254700000001  your@email.com
-- ================================================================

-- ████████  SECTION 1 — XGROW DATABASE  ████████████████████████
USE xgrow_db;

-- STEP 1: Create XCADO Limited organisation
INSERT INTO organisations(name,type,county_id,sub_county_id,contact_name,contact_phone,contact_email,plan,domain,active,mrr_kes)
VALUES('XCADO Limited','Corporate',
  (SELECT id FROM counties WHERE code='047' LIMIT 1),
  (SELECT sc.id FROM sub_counties sc JOIN counties c ON c.id=sc.county_id WHERE c.code='047' AND sc.name='Westlands' LIMIT 1),
  'YOUR_FIRST_NAME YOUR_LAST_NAME','+254700000001','your@email.com','Enterprise','xgrow.xcado.africa',1,0.00);
SET @xgrow_org_id = LAST_INSERT_ID();

-- Verify Step 1
SELECT id AS org_id,name,type,plan,contact_email,active FROM organisations WHERE id=@xgrow_org_id;

-- STEP 2: Create platform_admin user (org_id NULL until Step 3)
-- Password hash is BCrypt of 'Xgrow@Admin2025' — CHANGE IMMEDIATELY
INSERT INTO users(org_id,role,first_name,last_name,phone,email,password_hash,active)
VALUES(NULL,'platform_admin','YOUR_FIRST_NAME','YOUR_LAST_NAME','+254700000001','your@email.com',
  '$2y$10$TKh8H1.PyfcAZgra5i.2punoYSBBJ3OWJLLhEjB3tFKOwX3IvSvZu',1);
SET @xgrow_admin_id = LAST_INSERT_ID();

-- Verify Step 2
SELECT id,role,first_name,last_name,email,org_id,active FROM users WHERE id=@xgrow_admin_id;

-- STEP 3: Link user to organisation
UPDATE users SET org_id=@xgrow_org_id WHERE id=@xgrow_admin_id;

-- Verify Step 3
SELECT u.id,u.role,CONCAT(u.first_name,' ',u.last_name) AS name,u.email,
       o.name AS organisation,o.plan FROM users u JOIN organisations o ON o.id=u.org_id WHERE u.id=@xgrow_admin_id;

-- STEP 4: Generate API token
UPDATE users SET api_token=LOWER(CONCAT(HEX(RANDOM_BYTES(16)),HEX(RANDOM_BYTES(16)))) WHERE id=@xgrow_admin_id;
SELECT id,api_token FROM users WHERE id=@xgrow_admin_id;
-- *** COPY THIS TOKEN — store in password manager ***

-- STEP 5: Create API keys
INSERT INTO api_keys(org_id,label,key_hash,environment,active) VALUES
  (@xgrow_org_id,'XCADO Admin — Production',SHA2(CONCAT('xg_live_placeholder_',NOW()),256),'production',1),
  (@xgrow_org_id,'XCADO Admin — Sandbox',   SHA2(CONCAT('xg_test_placeholder_',NOW()),256),'sandbox',   1);

SELECT '=== XGROW SETUP COMPLETE ===' AS status;
SELECT u.id,u.role,CONCAT(u.first_name,' ',u.last_name) AS admin,u.email,o.name AS org,
  CASE WHEN u.api_token IS NOT NULL THEN 'SET' ELSE 'MISSING' END AS token_status
FROM users u JOIN organisations o ON o.id=u.org_id WHERE u.id=@xgrow_admin_id;


-- ████████  SECTION 2 — XCADO TRADE DATABASE  ████████████████████
USE xcadoke_xcado;

-- STEP 1: Create XCADO Group Limited organisation
INSERT INTO organisations(country_id,name,type,contact_name,contact_phone,contact_email,website,plan,active,verified)
VALUES(1,'XCADO Group Limited','Partner Body','YOUR_FIRST_NAME YOUR_LAST_NAME',
  '+254700000001','hello@xcado.africa','https://xcado.africa','Enterprise',1,1);
SET @xcado_org_id = LAST_INSERT_ID();

SELECT id AS org_id,name,type,plan,verified,contact_email FROM organisations WHERE id=@xcado_org_id;

-- STEP 2: Create platform_admin user
-- Password hash is BCrypt of 'Xcado@Admin2025' — CHANGE IMMEDIATELY
INSERT INTO users(org_id,role,first_name,last_name,phone,email,password_hash,active)
VALUES(NULL,'platform_admin','YOUR_FIRST_NAME','YOUR_LAST_NAME','+254700000001','your@email.com',
  '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p4nIB7oLiLj5bHhSc.6vXm',1);
SET @xcado_admin_id = LAST_INSERT_ID();

SELECT id,role,first_name,last_name,email,org_id FROM users WHERE id=@xcado_admin_id;

-- STEP 3: Link user to organisation
UPDATE users SET org_id=@xcado_org_id WHERE id=@xcado_admin_id;

SELECT u.id,u.role,CONCAT(u.first_name,' ',u.last_name) AS name,
       o.name AS organisation,o.verified FROM users u JOIN organisations o ON o.id=u.org_id WHERE u.id=@xcado_admin_id;

-- STEP 4: API token
UPDATE users SET api_token=LOWER(CONCAT(HEX(RANDOM_BYTES(16)),HEX(RANDOM_BYTES(16)))) WHERE id=@xcado_admin_id;
SELECT id,api_token FROM users WHERE id=@xcado_admin_id;

-- STEP 5: Enterprise API keys
INSERT INTO api_keys(org_id,label,key_hash,tier,rate_limit,environment,active) VALUES
  (@xcado_org_id,'XCADO Platform — Production',SHA2(CONCAT('xcado_live_placeholder_',NOW()),256),'enterprise',1000,'production',1),
  (@xcado_org_id,'XCADO Platform — Sandbox',   SHA2(CONCAT('xcado_test_placeholder_',NOW()),256),'standard', 200, 'sandbox',   1);

SELECT '=== XCADO SETUP COMPLETE ===' AS status;
SELECT u.id,u.role,CONCAT(u.first_name,' ',u.last_name) AS admin,
       o.name AS org,o.verified,CASE WHEN u.api_token IS NOT NULL THEN 'SET' ELSE 'MISSING' END AS token
FROM users u JOIN organisations o ON o.id=u.org_id WHERE u.id=@xcado_admin_id;

-- ================================================================
-- CHANGE PASSWORDS (run after first login):
-- php -r "echo password_hash('YourNewPassword!', PASSWORD_BCRYPT);"
-- UPDATE xgrow_db.users     SET password_hash='$2y$10$...' WHERE email='your@email.com';
-- UPDATE xcadoke_xcado.users SET password_hash='$2y$10$...' WHERE email='your@email.com';
--
-- REPLACE API KEY HASHES:
-- openssl rand -hex 32  →  prefix with xg_live_ or xcado_live_
-- UPDATE xgrow_db.api_keys     SET key_hash=SHA2('xg_live_YOURKEY',256) WHERE label LIKE '%Production%';
-- UPDATE xcadoke_xcado.api_keys SET key_hash=SHA2('xcado_live_YOURKEY',256) WHERE label LIKE '%Production%';
-- ================================================================
