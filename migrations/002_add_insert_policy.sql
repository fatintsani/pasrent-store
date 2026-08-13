-- Aktifkan RLS (Row Level Security) jika belum aktif
ALTER TABLE pesanan_sewa ENABLE ROW LEVEL SECURITY;

-- Buat policy yang mengizinkan siapa saja (publik) untuk melakukan INSERT (membuat pesanan)
CREATE POLICY "Izinkan publik membuat pesanan" 
ON pesanan_sewa 
FOR INSERT 
TO public
WITH CHECK (true);

-- (Opsional) Policy agar publik tidak bisa melihat pesanan orang lain (SELECT)
-- Jangan buat policy SELECT untuk public jika Anda tidak ingin pesanan bocor.
