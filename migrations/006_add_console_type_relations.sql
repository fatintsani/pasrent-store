-- Migration 006: Relate tables to console_types

-- 1. Ensure basic console types exist so we can map old string values
INSERT INTO console_types (code, name) VALUES ('PS3', 'PlayStation 3') ON CONFLICT (code) DO NOTHING;
INSERT INTO console_types (code, name) VALUES ('PS4', 'PlayStation 4') ON CONFLICT (code) DO NOTHING;
INSERT INTO console_types (code, name) VALUES ('PS5', 'PlayStation 5') ON CONFLICT (code) DO NOTHING;
INSERT INTO console_types (code, name) VALUES ('ALL', 'Semua Konsol') ON CONFLICT (code) DO NOTHING;

-- 2. Add columns
ALTER TABLE units ADD COLUMN IF NOT EXISTS console_type_id UUID REFERENCES console_types(id) ON DELETE RESTRICT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS console_type_id UUID REFERENCES console_types(id) ON DELETE RESTRICT;
ALTER TABLE rental_packages ADD COLUMN IF NOT EXISTS console_type_id UUID REFERENCES console_types(id) ON DELETE RESTRICT;

-- 3. Backfill data
-- Update units based on the text column "type"
UPDATE units 
SET console_type_id = (SELECT id FROM console_types WHERE code = units.type)
WHERE console_type_id IS NULL;

-- Update games based on the text column "console_type"
UPDATE games 
SET console_type_id = (SELECT id FROM console_types WHERE code = games.console_type)
WHERE console_type_id IS NULL;

-- Update rental_packages based on the text column "console_type"
UPDATE rental_packages 
SET console_type_id = (SELECT id FROM console_types WHERE code = rental_packages.console_type)
WHERE console_type_id IS NULL;

-- 4. Optional: If we want to enforce it immediately, we can make it NOT NULL
-- (Be careful, this will fail if there was a text value not matched above. But we just seeded the most common ones).
-- We'll leave it nullable for a moment or make it not null if we're confident:
-- ALTER TABLE units ALTER COLUMN console_type_id SET NOT NULL;
-- ALTER TABLE games ALTER COLUMN console_type_id SET NOT NULL;
-- ALTER TABLE rental_packages ALTER COLUMN console_type_id SET NOT NULL;
