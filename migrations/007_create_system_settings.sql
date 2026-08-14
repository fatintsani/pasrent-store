CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tambahkan trigger untuk updated_at jika belum ada fungsi
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc'::text, now());
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_system_settings_modtime ON system_settings;
CREATE TRIGGER update_system_settings_modtime
BEFORE UPDATE ON system_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial default settings
INSERT INTO system_settings (key, value) VALUES 
('app_mode', '"development"'), 
('maintenance_mode', 'false'),
('smtp_config', '{"host": "", "port": "465", "user": "", "pass": "", "from": ""}')
ON CONFLICT (key) DO NOTHING;

-- Mengaktifkan RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Menambahkan policy untuk mengizinkan operasi oleh admin (authenticated users)
DROP POLICY IF EXISTS "Allow authenticated read" ON system_settings;
CREATE POLICY "Allow authenticated read" ON system_settings
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert" ON system_settings;
CREATE POLICY "Allow authenticated insert" ON system_settings
FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update" ON system_settings;
CREATE POLICY "Allow authenticated update" ON system_settings
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
