<?php
/**
 * NETI BHARATHAM (నేటి భారతం) - Hostinger PHP + MySQL API Backend
 * This single file handles database connection, automatic table creation,
 * and all CRUD operations for reporters, news, advertisements, and settings.
 */

error_reporting(E_ALL);
ini_set('display_errors', '0');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ==========================================
// CONFIGURATION (Update with your Hostinger MySQL details)
// ==========================================
$host = 'localhost';
$dbname = 'u123456789_netibharatham'; // Replace with your Hostinger DB name
$username = 'u123456789_user';       // Replace with your Hostinger DB username
$password = 'YourStrongPassword123'; // Replace with your Hostinger DB password

try {
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $pdo->exec("USE `$dbname`;");

    // Automatically create required tables
    $pdo->exec("CREATE TABLE IF NOT EXISTS reporters (
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
        updated_at VARCHAR(64)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS news_articles (
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
        updated_at VARCHAR(64)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS advertisements (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS website_settings (
        setting_key VARCHAR(64) PRIMARY KEY,
        setting_value LONGTEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(64) PRIMARY KEY,
        recipient_uid VARCHAR(128) NOT NULL,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(32) DEFAULT 'SYSTEM',
        is_read TINYINT(1) DEFAULT 0,
        created_at VARCHAR(64)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(64) PRIMARY KEY,
        actor_uid VARCHAR(128),
        actor_name VARCHAR(120),
        actor_role VARCHAR(40),
        action VARCHAR(120),
        target_collection VARCHAR(64),
        target_id VARCHAR(128),
        details TEXT,
        created_at VARCHAR(64)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

} catch (PDOException $e) {
    echo json_encode(["ok" => false, "error" => "Database Connection Failed: " . $e->getMessage()]);
    exit();
}

// ==========================================
// REQUEST HANDLING
// ==========================================
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? $_POST['action'] ?? '';

if ($method === 'GET' && ($action === 'get_all' || $action === '')) {
    // Fetch all portal records
    try {
        $reporters = $pdo->query("SELECT * FROM reporters")->fetchAll();
        $news = $pdo->query("SELECT * FROM news_articles")->fetchAll();
        $ads = $pdo->query("SELECT * FROM advertisements")->fetchAll();
        $notifications = $pdo->query("SELECT * FROM notifications")->fetchAll();
        $auditLogs = $pdo->query("SELECT * FROM audit_logs")->fetchAll();

        $settingsStmt = $pdo->query("SELECT * FROM website_settings");
        $websiteSettings = [];
        while ($row = $settingsStmt->fetch()) {
            $websiteSettings[$row['setting_key']] = json_decode($row['setting_value'], true) ?? $row['setting_value'];
        }

        // Decode JSON fields
        foreach ($news as &$art) {
            $art['galleryImages'] = json_decode($art['gallery_images'] ?? '[]', true);
            $art['tags'] = json_decode($art['tags'] ?? '[]', true);
            $art['isBreaking'] = (bool)$art['is_breaking'];
            $art['isFeatured'] = (bool)$art['is_featured'];
            $art['isTrending'] = (bool)$art['is_trending'];
        }

        foreach ($reporters as &$rep) {
            $rep['consentAccepted'] = (bool)$rep['consent_accepted'];
        }

        echo json_encode([
            "ok" => true,
            "reporters" => $reporters,
            "news" => $news,
            "advertisements" => $ads,
            "notifications" => $notifications,
            "auditLogs" => $auditLogs,
            "websiteSettings" => $websiteSettings
        ]);
    } catch (Exception $e) {
        echo json_encode(["ok" => false, "error" => $e->getMessage()]);
    }
    exit();
}

$inputData = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$postAction = $inputData['action'] ?? $action;

if ($method === 'POST') {
    if ($postAction === 'save_reporter') {
        try {
            $r = $inputData['reporter'];
            $stmt = $pdo->prepare("REPLACE INTO reporters (
                uid, reporter_id, full_name, father_or_husband_name, dob, gender, mobile, whatsapp, email,
                residential_address, state, district, mandal, village_or_town, pin_code, experience,
                previous_organization, profile_photo_url, aadhaar_document_url, aadhaar_file_name,
                aadhaar_file_type, username, password, consent_accepted, status, rejection_remarks,
                approved_at, expires_at, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            $stmt->execute([
                $r['uid'], $r['reporterId'], $r['fullName'], $r['fatherOrHusbandName'] ?? '', $r['dob'] ?? '',
                $r['gender'] ?? '', $r['mobile'], $r['whatsapp'] ?? '', $r['email'] ?? '', $r['residentialAddress'] ?? '',
                $r['state'] ?? '', $r['district'] ?? '', $r['mandal'] ?? '', $r['villageOrTown'] ?? '', $r['pinCode'] ?? '',
                $r['experience'] ?? '', $r['previousOrganization'] ?? '', $r['profilePhotoUrl'] ?? '', $r['aadhaarDocumentUrl'] ?? '',
                $r['aadhaarFileName'] ?? '', $r['aadhaarFileType'] ?? '', $r['username'] ?? '', $r['password'] ?? '',
                ($r['consentAccepted'] ?? true) ? 1 : 0, $r['status'] ?? 'PENDING', $r['rejectionRemarks'] ?? '',
                $r['approvedAt'] ?? '', $r['expiresAt'] ?? '', $r['createdAt'] ?? date('c'), $r['updatedAt'] ?? date('c')
            ]);

            echo json_encode(["ok" => true, "message" => "Reporter saved successfully"]);
        } catch (Exception $e) {
            echo json_encode(["ok" => false, "error" => $e->getMessage()]);
        }
        exit();
    }

    if ($postAction === 'save_news') {
        try {
            $n = $inputData['article'];
            $stmt = $pdo->prepare("REPLACE INTO news_articles (
                slug, headline, subheadline, content, category, state, district, mandal, village_or_town,
                featured_image_url, gallery_images, image_caption, video_url, tags, seo_title, seo_description,
                language, is_breaking, is_featured, is_trending, views, reporter_uid, reporter_id, reporter_name,
                status, rejection_remarks, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            $stmt->execute([
                $n['slug'], $n['headline'], $n['subheadline'] ?? '', $n['content'], $n['category'] ?? 'State News',
                $n['state'] ?? '', $n['district'] ?? '', $n['mandal'] ?? '', $n['villageOrTown'] ?? '',
                $n['featuredImageUrl'] ?? '', json_encode($n['galleryImages'] ?? []), $n['imageCaption'] ?? '',
                $n['videoUrl'] ?? '', json_encode($n['tags'] ?? []), $n['seoTitle'] ?? '', $n['seoDescription'] ?? '',
                $n['language'] ?? 'Bilingual', ($n['isBreaking'] ?? false) ? 1 : 0, ($n['isFeatured'] ?? false) ? 1 : 0,
                ($n['isTrending'] ?? false) ? 1 : 0, $n['views'] ?? 0, $n['reporterUid'] ?? '', $n['reporterId'] ?? '',
                $n['reporterName'] ?? '', $n['status'] ?? 'PENDING', $n['rejectionRemarks'] ?? '',
                $n['createdAt'] ?? date('c'), $n['updatedAt'] ?? date('c')
            ]);

            echo json_encode(["ok" => true, "message" => "News article saved successfully"]);
        } catch (Exception $e) {
            echo json_encode(["ok" => false, "error" => $e->getMessage()]);
        }
        exit();
    }

    if ($postAction === 'delete_news') {
        try {
            $slug = $inputData['slug'];
            $stmt = $pdo->prepare("DELETE FROM news_articles WHERE slug = ?");
            $stmt->execute([$slug]);
            echo json_encode(["ok" => true, "message" => "News deleted successfully"]);
        } catch (Exception $e) {
            echo json_encode(["ok" => false, "error" => $e->getMessage()]);
        }
        exit();
    }

    if ($postAction === 'update_settings') {
        try {
            $settings = $inputData['settings'];
            foreach ($settings as $key => $val) {
                $stmt = $pdo->prepare("REPLACE INTO website_settings (setting_key, setting_value) VALUES (?, ?)");
                $stmt->execute([$key, is_array($val) ? json_encode($val) : $val]);
            }
            echo json_encode(["ok" => true, "message" => "Settings updated successfully"]);
        } catch (Exception $e) {
            echo json_encode(["ok" => false, "error" => $e->getMessage()]);
        }
        exit();
    }
}

echo json_encode(["ok" => false, "error" => "Invalid API action or request method"]);
