ALTER TABLE conversion_jobs
    ADD COLUMN idempotency_key VARCHAR(255) NULL AFTER guest_token,
    ADD UNIQUE INDEX uk_conversion_jobs_idempotency_key (idempotency_key);
