-- Migration V2: dữ liệu cấu hình & gói coin ban đầu.
-- Nguồn: done/TechSpec/schema.md §8.

INSERT INTO system_settings (setting_key, setting_value, data_type, description) VALUES
('free_max_file_size_mb', '5', 'INT', 'Dung lượng file tối đa cho chế độ miễn phí'),
('free_max_pages', '30', 'INT', 'Số trang tối đa cho chế độ miễn phí'),
('free_daily_limit', '5', 'INT', 'Số lần convert miễn phí mỗi ngày'),
('free_file_storage_hours', '1', 'INT', 'Thời gian lưu file miễn phí'),
('premium_file_storage_hours', '24', 'INT', 'Thời gian lưu file nâng cao'),
('coin_normal_per_page', '1', 'INT', 'Coin cho convert thường mỗi trang'),
('coin_ocr_per_page', '2', 'INT', 'Coin cho convert OCR mỗi trang'),
('coin_after_30_pages_per_page', '3', 'INT', 'Coin cho mỗi trang sau trang 30'),
('max_file_size_premium_mb', '50', 'INT', 'Dung lượng tối đa cho nâng cao'),
('max_pages_premium', '500', 'INT', 'Số trang tối đa cho nâng cao'),
('file_retention_original_days', '7', 'INT', 'Thời gian lưu PDF gốc (ngày)'),
('rate_limit_upload_per_minute', '10', 'INT', 'Giới hạn upload mỗi phút'),
('rate_limit_chatbot_per_minute', '30', 'INT', 'Giới hạn chatbot mỗi phút'),
('virus_scan_enabled', 'true', 'BOOLEAN', 'Bật/tắt quét virus');

INSERT INTO coin_packages (name, price_vnd, coin_amount, description, sort_order) VALUES
('Gói 1', 10000, 100, 'Gói coin cơ bản', 1),
('Gói 2', 50000, 600, 'Gói coin tiết kiệm', 2),
('Gói 3', 100000, 1500, 'Gói coin nhiều ưu đãi', 3);
