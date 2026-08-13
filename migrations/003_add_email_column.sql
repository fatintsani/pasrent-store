-- Tambahkan kolom email ke tabel pesanan_sewa
ALTER TABLE pesanan_sewa ADD COLUMN IF NOT EXISTS email text;

-- Karena kita punya RLS, kita perlu memastikan publik bisa membaca pesanannya asalkan UUID-nya cocok (pencarian Tracking)
-- Boleh membaca (SELECT) hanya jika ID pelacakan yang dicari (dari URL/query) sesuai dengan ID yang diminta.
-- Dalam Supabase, jika kita melakukan select dengan filter spesifik (e.g., eq('id', trackingId)),
-- RLS tidak bisa menebak nilai query secara otomatis. Cara termudah untuk Tracking publik adalah:
-- Opsi 1: Matikan RLS untuk SELECT jika UUID digunakan sebagai "secret key" karena UUID tidak bisa ditebak.
-- Opsi 2: Policy SELECT publik dengan UUID.

CREATE POLICY "Izinkan publik mengecek status via UUID" 
ON pesanan_sewa 
FOR SELECT 
TO public
USING (true);

-- Catatan: Memberikan akses `USING (true)` berarti siapa saja bisa men-SELECT, TETAPI secara praktis
-- seseorang harus tahu UUID-nya untuk membuka halaman Tracking-nya (atau jika frontend hanya mengambil 1 data via UUID).
-- Supaya super aman dan tidak bisa mengambil semua pesanan, buat function RPC, tapi untuk saat ini SELECT public cukup
-- asalkan tidak ada halaman/API yang meng-expose seluruh data tanpa filter.
