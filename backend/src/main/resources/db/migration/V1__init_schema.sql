-- Migration V1: tạo toàn bộ schema.
-- Nguồn: done/TechSpec/schema.md (MySQL 8+). Thứ tự tạo bảng theo §13 để tránh lỗi FK.
-- Lưu ý: conversion_jobs.status bổ sung 'QUEUED' để khớp api_spec.md §3.2.

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN', 'SUPPORT') NOT NULL DEFAULT 'USER',
    coin_balance INT UNSIGNED NOT NULL DEFAULT 0,
    status ENUM('ACTIVE', 'LOCKED', 'BANNED') NOT NULL DEFAULT 'ACTIVE',
    last_login_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_password_reset_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE coin_packages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price_vnd INT UNSIGNED NOT NULL,
    coin_amount INT UNSIGNED NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    coin_package_id BIGINT UNSIGNED NULL,
    amount_vnd INT UNSIGNED NOT NULL,
    coin_amount INT UNSIGNED NOT NULL,
    payment_method ENUM('MANUAL', 'BANK_TRANSFER', 'MOMO', 'VNPAY', 'ZALOPAY') NOT NULL DEFAULT 'MANUAL',
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELED') NOT NULL DEFAULT 'PENDING',
    provider_transaction_code VARCHAR(255) NULL,
    payment_content VARCHAR(255) NULL,
    note TEXT NULL,
    paid_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_payments_coin_package FOREIGN KEY (coin_package_id) REFERENCES coin_packages(id)
);

CREATE TABLE conversion_jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    request_code VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NULL,
    guest_token VARCHAR(100) NULL,
    source_ip VARCHAR(45) NULL,
    original_file_name VARCHAR(255) NOT NULL,
    original_file_path VARCHAR(500) NOT NULL,
    output_file_name VARCHAR(255) NULL,
    output_file_path VARCHAR(500) NULL,
    file_size_bytes BIGINT UNSIGNED NOT NULL,
    total_pages INT UNSIGNED NOT NULL,
    conversion_mode ENUM('FREE', 'PREMIUM') NOT NULL,
    processing_type ENUM('NORMAL', 'OCR') NOT NULL DEFAULT 'NORMAL',
    coin_estimated INT UNSIGNED NOT NULL DEFAULT 0,
    coin_charged INT UNSIGNED NOT NULL DEFAULT 0,
    status ENUM('PENDING', 'QUEUED', 'PROCESSING', 'SUCCESS', 'FAILED', 'EXPIRED', 'DELETED') NOT NULL DEFAULT 'PENDING',
    queue_priority TINYINT UNSIGNED NOT NULL DEFAULT 5,
    error_message TEXT NULL,
    started_at DATETIME NULL,
    completed_at DATETIME NULL,
    file_expired_at DATETIME NULL,
    deleted_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_conversion_jobs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE coin_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transaction_code VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    payment_id BIGINT UNSIGNED NULL,
    conversion_job_id BIGINT UNSIGNED NULL,
    type ENUM('ADD', 'DEDUCT', 'REFUND', 'ADJUST') NOT NULL,
    amount INT UNSIGNED NOT NULL,
    balance_before INT UNSIGNED NOT NULL,
    balance_after INT UNSIGNED NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELED') NOT NULL DEFAULT 'SUCCESS',
    created_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_coin_transactions_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_coin_transactions_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
    CONSTRAINT fk_coin_transactions_conversion_job FOREIGN KEY (conversion_job_id) REFERENCES conversion_jobs(id) ON DELETE SET NULL,
    CONSTRAINT fk_coin_transactions_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE free_conversion_usages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    identity_type ENUM('USER', 'GUEST', 'IP') NOT NULL,
    identity_value VARCHAR(255) NOT NULL,
    usage_date DATE NOT NULL,
    used_count INT UNSIGNED NOT NULL DEFAULT 0,
    daily_limit INT UNSIGNED NOT NULL DEFAULT 5,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_free_usage_identity_date (identity_type, identity_value, usage_date)
);

CREATE TABLE support_tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_code VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    assigned_support_id BIGINT UNSIGNED NULL,
    related_payment_id BIGINT UNSIGNED NULL,
    related_conversion_job_id BIGINT UNSIGNED NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    issue_type ENUM('CONVERT_ERROR', 'PAYMENT_ERROR', 'COIN_ERROR', 'ACCOUNT_ERROR', 'OTHER') NOT NULL DEFAULT 'OTHER',
    priority ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT') NOT NULL DEFAULT 'NORMAL',
    status ENUM('NEW', 'IN_PROGRESS', 'REPLIED', 'RESOLVED', 'CANCELED') NOT NULL DEFAULT 'NEW',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,
    CONSTRAINT fk_support_tickets_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_support_tickets_assigned_support FOREIGN KEY (assigned_support_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_support_tickets_payment FOREIGN KEY (related_payment_id) REFERENCES payments(id) ON DELETE SET NULL,
    CONSTRAINT fk_support_tickets_conversion_job FOREIGN KEY (related_conversion_job_id) REFERENCES conversion_jobs(id) ON DELETE SET NULL
);

CREATE TABLE support_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    support_ticket_id BIGINT UNSIGNED NOT NULL,
    sender_id BIGINT UNSIGNED NULL,
    sender_role ENUM('USER', 'SUPPORT', 'ADMIN', 'BOT', 'SYSTEM') NOT NULL,
    message TEXT NOT NULL,
    attachment_path VARCHAR(500) NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_support_messages_ticket FOREIGN KEY (support_ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_support_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE chatbot_conversations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    guest_token VARCHAR(100) NULL,
    status ENUM('OPEN', 'CLOSED', 'ESCALATED') NOT NULL DEFAULT 'OPEN',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_chatbot_conversations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE chatbot_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    chatbot_conversation_id BIGINT UNSIGNED NOT NULL,
    sender_role ENUM('USER', 'BOT', 'SYSTEM') NOT NULL,
    message TEXT NOT NULL,
    rating TINYINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chatbot_messages_conversation FOREIGN KEY (chatbot_conversation_id) REFERENCES chatbot_conversations(id) ON DELETE CASCADE
);

CREATE TABLE system_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value VARCHAR(500) NOT NULL,
    data_type ENUM('STRING', 'INT', 'BOOLEAN', 'JSON') NOT NULL DEFAULT 'STRING',
    description VARCHAR(255) NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_system_settings_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE admin_audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    actor_id BIGINT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100) NULL,
    target_id BIGINT UNSIGNED NULL,
    old_value JSON NULL,
    new_value JSON NULL,
    source_ip VARCHAR(45) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_audit_logs_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Index (done/TechSpec/schema.md §7)
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_conversion_jobs_user_id ON conversion_jobs(user_id);
CREATE INDEX idx_conversion_jobs_status ON conversion_jobs(status);
CREATE INDEX idx_conversion_jobs_mode ON conversion_jobs(conversion_mode);
CREATE INDEX idx_conversion_jobs_created_at ON conversion_jobs(created_at);
CREATE INDEX idx_conversion_jobs_file_expired_at ON conversion_jobs(file_expired_at);
CREATE INDEX idx_coin_transactions_user_id ON coin_transactions(user_id);
CREATE INDEX idx_coin_transactions_type ON coin_transactions(type);
CREATE INDEX idx_coin_transactions_created_at ON coin_transactions(created_at);
CREATE INDEX idx_coin_transactions_payment_id ON coin_transactions(payment_id);
CREATE INDEX idx_coin_transactions_conversion_job_id ON coin_transactions(conversion_job_id);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_assigned_support_id ON support_tickets(assigned_support_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_issue_type ON support_tickets(issue_type);
CREATE INDEX idx_support_messages_ticket_id ON support_messages(support_ticket_id);
CREATE INDEX idx_chatbot_messages_conversation_id ON chatbot_messages(chatbot_conversation_id);
