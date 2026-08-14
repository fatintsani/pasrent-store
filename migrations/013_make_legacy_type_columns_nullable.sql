-- Migration: 013_make_legacy_type_columns_nullable.sql
-- Removes the NOT NULL constraint from legacy string type columns since we now use console_type_id

ALTER TABLE units ALTER COLUMN type DROP NOT NULL;
ALTER TABLE games ALTER COLUMN console_type DROP NOT NULL;
ALTER TABLE rental_packages ALTER COLUMN console_type DROP NOT NULL;
