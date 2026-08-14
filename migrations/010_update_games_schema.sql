-- Tambahkan kolom baru ke tabel games
ALTER TABLE games 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS is_multiplayer boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS supported_consoles text[];

-- Hapus NOT NULL constraint dari console_type lama jika ada, atau biarkan tetap (tapi diisi dari app)
ALTER TABLE games ALTER COLUMN console_type DROP NOT NULL;
