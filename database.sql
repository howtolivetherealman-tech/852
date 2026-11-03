-- ====================================================================
-- NETI BHARATHAM (నేటి భారతం) - Hostinger MySQL Database Schema
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS advertisements;
DROP TABLE IF EXISTS news_articles;
DROP TABLE IF EXISTS reporters;
DROP TABLE IF EXISTS website_settings;
DROP TABLE IF EXISTS mandals;
DROP TABLE IF EXISTS districts;
DROP TABLE IF EXISTS states;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. States / UTs Table
CREATE TABLE states (
    code VARCHAR(16) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_telugu VARCHAR(120) NOT NULL,
    type VARCHAR(20) NOT NULL,
    division_label VARCHAR(40) NOT NULL,
    active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Districts Table
CREATE TABLE districts (
    id VARCHAR(64) PRIMARY KEY,
    state_code VARCHAR(16) NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_telugu VARCHAR(120) NOT NULL,
    active TINYINT(1) DEFAULT 1,
    INDEX idx_state (state_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Mandals / Tehsils Table
CREATE TABLE mandals (
    id VARCHAR(64) PRIMARY KEY,
    state_code VARCHAR(16) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_telugu VARCHAR(120) NOT NULL,
    division_type VARCHAR(40) NOT NULL,
    active TINYINT(1) DEFAULT 1,
    INDEX idx_district (district_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Reporters Table
CREATE TABLE reporters (
    uid VARCHAR(128) PRIMARY KEY,
    reporter_id VARCHAR(64) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    father_or_husband_name VARCHAR(120),
    dob VARCHAR(32),
    gender VARCHAR(32),
    mobile VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20),
    email VARCHAR(160),
    residential_address TEXT,
    state VARCHAR(80),
    district VARCHAR(80),
    mandal VARCHAR(80),
    village_or_town VARCHAR(100),
    pin_code VARCHAR(12),
    experience VARCHAR(100),
    previous_organization VARCHAR(160),
    profile_photo_url LONGTEXT,
    aadhaar_document_url LONGTEXT,
    aadhaar_file_name VARCHAR(200),
    aadhaar_file_type VARCHAR(64),
    username VARCHAR(64) UNIQUE,
    password VARCHAR(255),
    consent_accepted TINYINT(1) DEFAULT 1,
    status VARCHAR(32) DEFAULT 'PENDING',
    rejection_remarks TEXT,
    approved_at VARCHAR(64),
    expires_at VARCHAR(64),
    created_at VARCHAR(64),
    updated_at VARCHAR(64),
    INDEX idx_reporter_id (reporter_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. News Articles Table
CREATE TABLE news_articles (
    slug VARCHAR(200) PRIMARY KEY,
    headline VARCHAR(300) NOT NULL,
    subheadline VARCHAR(400),
    content LONGTEXT NOT NULL,
    category VARCHAR(80),
    state VARCHAR(80),
    district VARCHAR(80),
    mandal VARCHAR(80),
    village_or_town VARCHAR(100),
    featured_image_url LONGTEXT,
    gallery_images LONGTEXT,
    image_caption VARCHAR(300),
    video_url VARCHAR(400),
    tags LONGTEXT,
    seo_title VARCHAR(200),
    seo_description VARCHAR(400),
    language VARCHAR(32) DEFAULT 'Bilingual',
    is_breaking TINYINT(1) DEFAULT 0,
    is_featured TINYINT(1) DEFAULT 0,
    is_trending TINYINT(1) DEFAULT 0,
    views INT DEFAULT 0,
    reporter_uid VARCHAR(128),
    reporter_id VARCHAR(64),
    reporter_name VARCHAR(120),
    status VARCHAR(32) DEFAULT 'PENDING',
    rejection_remarks TEXT,
    created_at VARCHAR(64),
    updated_at VARCHAR(64),
    INDEX idx_category (category),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Advertisements Table
CREATE TABLE advertisements (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(160) NOT NULL,
    business_name VARCHAR(160),
    contact_number VARCHAR(32),
    description TEXT,
    image1_url LONGTEXT,
    image2_url LONGTEXT,
    link_url VARCHAR(400),
    target_state VARCHAR(80),
    target_district VARCHAR(80),
    target_mandal VARCHAR(80),
    start_date VARCHAR(64),
    expiry_date VARCHAR(64),
    position VARCHAR(32) DEFAULT 'HOMEPAGE_BANNER',
    price_amount DECIMAL(10,2) DEFAULT 0.00,
    payment_status VARCHAR(32) DEFAULT 'PENDING',
    status VARCHAR(32) DEFAULT 'PENDING',
    reporter_uid VARCHAR(128),
    reporter_id VARCHAR(64),
    created_at VARCHAR(64)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Website Settings Table
CREATE TABLE website_settings (
    setting_key VARCHAR(64) PRIMARY KEY,
    setting_value LONGTEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Notifications Table
CREATE TABLE notifications (
    id VARCHAR(64) PRIMARY KEY,
    recipient_uid VARCHAR(128) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(32) DEFAULT 'SYSTEM',
    is_read TINYINT(1) DEFAULT 0,
    created_at VARCHAR(64)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Audit Logs Table
CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    actor_uid VARCHAR(128),
    actor_name VARCHAR(120),
    actor_role VARCHAR(40),
    action VARCHAR(120),
    target_collection VARCHAR(64),
    target_id VARCHAR(128),
    details TEXT,
    created_at VARCHAR(64)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
