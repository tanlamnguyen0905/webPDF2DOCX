-- MySQL init script — chạy lần đầu khi container MySQL khởi tạo.
-- Lưu ý: schema bảng do backend quản lý bằng Flyway migration
-- (xem backend/src/main/resources/db/migration). File này chỉ đảm bảo
-- database & charset đúng chuẩn UTF-8.

CREATE DATABASE IF NOT EXISTS pdf_converter
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
