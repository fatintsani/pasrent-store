# Pedoman Desain Admin Master Data (MD)

Dokumen ini berisi standar desain dan komponen UI/UX untuk seluruh halaman Master Data (MD) Admin (seperti Produk, Pengguna, Kategori, dll), yang mengacu pada desain **Kelola Pesanan (Bookings)**.

Gunakan pedoman ini untuk memastikan konsistensi visual dan interaksi di seluruh dashboard admin.

---

## 1. Layout Utama (List Page)

Layout utama untuk menampilkan data dalam bentuk tabel harus menggunakan struktur berikut:
- **Container Utama**: `<div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 font-plus-jakarta">`
*(Catatan: Pastikan `font-plus-jakarta` digunakan agar desain menggunakan Plus Jakarta Sans sebagai standar tipografi).*

### Header
Terdiri dari Judul, Deskripsi, dan Tombol Aksi Utama (misal: Tambah Data).
```tsx
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
      Kelola [Nama Modul]
    </h1>
    <p className="text-muted-foreground mt-1">
      Pantau dan kelola seluruh data [Nama Modul].
    </p>
  </div>
  <Link
    href="/admin/[modul]/create"
    className="flex items-center gap-2 bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition"
  >
    <PlusIcon className="w-5 h-5" /> Tambah [Nama Modul]
  </Link>
</div>
```

### Summary Cards (Statistik)
**WAJIB** ada di setiap halaman list/tabel utama untuk menampilkan ringkasan data di atas tabel.
Pada tampilan *mobile* (layar kecil), statistik ini disembunyikan dalam bentuk *dropdown/accordion* atau toggle agar tidak memakan tempat.
- **Borders over Shadows**: Jangan gunakan bayangan (`shadow-sm`, `shadow-md`, `shadow-lg`, dsb) di komponen mana pun secara keseluruhan. Semuanya **WAJIB** menggunakan border yang tegas (`border border-gray-200 dark:border-gray-700`) untuk mendefinisikan batas kontainer. Aturan ini berlaku untuk semua halaman:
  - Halaman Utama (List / Tabel)
  - Halaman View (Detail)
  - Halaman Create (Tambah Data)
  - Halaman Edit (Ubah Data)
- **Grid Container**: `<div className={\`grid-cols-2 lg:grid-cols-5 gap-4 \${showMobileStats ? 'grid' : 'hidden lg:grid'}\`}>`
- **Card**: `<div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">`
- **Label**: `<span className="text-sm font-medium text-gray-500 flex items-center gap-1.5">` (Bisa dikustomisasi warnanya sesuai konteks. **Seluruh statistik wajib menyertakan ikon** ukuran `w-4 h-4` dari lucide-react di dalam label ini)
- **Value**: `<span className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">`

### Toolbar (Pencarian, Filter, Sortir)
Pada tampilan *mobile*, filter opsi (Select) disembunyikan dan dapat dimunculkan melalui tombol *Toggle Filter* di sebelah form pencarian.
- **Container**: `<div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row gap-4 items-center justify-between">`
- **Search & Mobile Toggle Wrapper**: `<div className="w-full lg:w-96 flex gap-2">`
- **Search Input Wrapper**: `<div className="relative w-full">`
- **Search Input Element**: `<input className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#5000ef] focus:border-transparent transition" />`
- **Mobile Filter Toggle Button**: `<button className="lg:hidden flex-shrink-0 p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl transition">`
- **Filter Container (Responsive)**: `<div className={\`flex-col lg:flex-row flex-wrap items-stretch lg:items-center gap-3 w-full lg:w-auto \${showMobileFilters ? 'flex' : 'hidden lg:flex'}\`}>`
- **Filter Select**: `<select className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#5000ef]">`
- **Reset Button**: `<button className="p-2.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition">`

### Tabel Data Utama (dengan Sortable Headers)
- **Wrapper**: `<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">`
- **Tabel Container (Scrollable & Hidden Scrollbar)**: `<div className="overflow-x-auto min-h-[400px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">`
- **Thead**: `<thead className="bg-gray-50 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold select-none">`
- **Header Kolom (Sortable)**: `<th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition" onClick={() => handleSort('nama_kolom')}>`
  - Di dalam Header gunakan layout flex: `<div className="flex items-center">Nama Kolom <SortIcon columnKey="nama_kolom" /></div>`
  - Ikon Sort menggunakan ArrowUpDown/ArrowUp/ArrowDown dari `lucide-react`.
- **Tr (Hover)**: `<tr className="hover:bg-gray-50/80 dark:hover:bg-gray-900/30 transition-colors group">`
- **Td (Konten)**:
  - **Teks Utama/Penting** (Nama Pelanggan, Nama Produk/Tipe, Total Harga): **WAJIB Bold** (`font-bold text-gray-900 dark:text-white`).
  - **ID/Kode Unik** (ID Pesanan, Kode Konsol): **WAJIB Bold** dengan font monospace (`font-mono font-bold text-[#5000ef] dark:text-[#00c3cb]`).
  - **Teks Sekunder/Keterangan** (Email, No WA, Tanggal, Jumlah Fitur): **Medium atau Normal** (`font-medium text-gray-600 dark:text-gray-400`).
- **Empty State**: `<td colSpan={X} className="px-6 py-24 text-center">` dengan ikon besar, judul `text-lg font-bold`, dan deskripsi `text-gray-500`.

### Pagination Footer
- **Container**: `<div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">`
- **Info Text**: `<div className="text-sm text-gray-500 font-medium">`
- **Select Baris**: Sama dengan style Filter/Sort namun ukurannya lebih padat (`px-2 py-1.5`).
- **Kontrol Halaman**: Menggunakan border-x untuk pemisah angka halaman dan background dinamis untuk tombol Prev/Next.

---

## 2. Layout Form (Create / Edit) & View Detail

### Layout Struktur View/Form
Gunakan struktur lebar penuh dengan container padding.
- **Container**: `<div className="p-4 md:p-8 w-full mx-auto">`
- **Navigasi Atas & Judul**:
```tsx
<div className="mb-6 flex items-center gap-4">
  <Link href="/admin/[modul]" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
    <ArrowLeft className="w-6 h-6" />
  </Link>
  <div>
    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
      {Title}
    </h1>
    <p className="text-muted-foreground mt-1">{Subtitle}</p>
  </div>
</div>
```

### Cards (Kartu Konten)
Baik untuk View maupun Form (Input group), bungkus dengan style kartu:
- **Card**: `<div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">`
- **Card Title**: `<h3 className="text-lg font-bold mb-4 flex items-center gap-2">` dengan Ikon berwarna `#5000ef` / `#00c3cb`.

### Form Inputs (Create / Edit)
Untuk input form pada halaman Create/Edit, gunakan styling yang senada dengan Search Input:
- **Label**: `<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">`
- **Input Text/Number/Select/Textarea**: 
```tsx
<input 
  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#5000ef] focus:border-transparent transition"
/>
```
- **Tombol Submit (Form)**: Menggunakan warna gradient primary atau solid `#5000ef` dengan border radius `rounded-xl`.

---

## 3. Komponen Pendukung

### Badges (Status)
Gunakan badge membulat untuk menampilkan status atau kategori:
- `<span className="px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider bg-{color}-100 text-{color}-700 dark:bg-{color}-900/30 dark:text-{color}-400 border border-{color}-200 dark:border-{color}-800">`
- *Warna Umum*: Emerald (Sukses), Blue/Purple (Proses), Amber (Pending), Rose (Batal/Gagal).

### Dropdown Menu Aksi (Titik Tiga di Tabel)
- **Tombol Titik Tiga**: `<button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">`
- **Dropdown Container**: `<div className="absolute right-8 top-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">`
- **Item Dropdown**: `<button className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">`
- **Pemisah (Divider)**: `<div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>`

### Modal Alert (Konfirmasi & Pesan Error)
Gunakan modal custom dari `bookings-client.tsx` (bukan `window.confirm` atau `window.alert` bawaan). Dukung stat alert (error/informasi saja) maupun konfirmasi 2 tombol.
- **State Interface**: Tambahkan `isAlert?: boolean` pada object state dialog.
- **Overlay**: `<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">`
- **Dialog Box**: `<div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">`
- **Header**: 
```tsx
<div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
    <AlertCircle className={`w-5 h-5 ${confirmDialog.isAlert ? 'text-rose-500' : 'text-blue-500'}`} />
    {Title}
  </h3>
  {Close Button}
</div>
```
- **Body**: `<div className="p-6"><p className="text-gray-600 dark:text-gray-300">{Message}</p></div>`
- **Footer**: 
```tsx
<div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
  {!confirmDialog.isAlert && (
    <button className="px-4 py-2 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition">
      Batal
    </button>
  )}
  <button className={`px-4 py-2 font-bold text-white rounded-xl transition ${confirmDialog.isAlert ? 'bg-gray-900 hover:bg-gray-800' : 'bg-[#5000ef] hover:bg-[#4000c0]'}`}>
    {confirmDialog.isAlert ? "Tutup" : "Ya, Lanjutkan"}
  </button>
</div>
```

---

## 4. Efek dan Animasi
- Seluruh elemen besar seperti container utama gunakan class: `animate-in fade-in duration-500`
- Animasi dropdown/modal gunakan class: `animate-in zoom-in-95 duration-200`
- Tombol loading gunakan icon `Loader2` dari `lucide-react` dengan class `animate-spin`.

---

## 5. Fitur Lanjutan (Advanced Features)

Sebagai pedoman untuk pengembangan fitur yang lebih kompleks (terutama pada modul seperti Kelola Pesanan), berikut adalah acuan letak komponen:

### Aksi Data (Tabel & Toolbar)
- **Export Data (Excel/CSV)**: Tombol *Export* diletakkan di dalam *Toolbar* utama (area Filter/Sort). Tombol ini berguna untuk mengunduh laporan tabel ke format CSV/Excel. Gunakan ikon `Download` atau `FileSpreadsheet`.
- **Bulk Actions (Aksi Massal)**: 
  - Sediakan *checkbox* pada kolom paling kiri tabel.
  - Ketika data dipilih, munculkan *Action Bar* (bisa *floating* di bawah layar atau menggantikan toolbar atas) berisi opsi seperti "Ubah Status Sekaligus".
- **Quick Action (Tabel)**: Untuk aksi berulang yang paling sering dipakai (misal: "Konfirmasi Pembayaran"), tombol dapat diletakkan berdampingan dengan ikon titik tiga di kolom Aksi. Gunakan desain tombol kecil (*size-sm*) dengan warna solid agar mudah diklik tanpa harus membuka dropdown.

### Detail Lengkap (View Page)
Saat merancang halaman detail yang kompleks (seperti Detail Pesanan), elemen berikut perlu ditambahkan:
- **Cetak / Download Invoice (PDF)**: Tombol aksi cetak dokumen diletakkan di pojok kanan atas sejajar dengan judul/Header halaman. Gunakan ikon `Printer`. Implementasikan CSS Print (`@media print` atau `print:hidden`) pada elemen global (seperti *Sidebar* admin dan *Top Navbar*) agar seluruh struktur *dashboard* tersembunyi dan layar hanya mencetak komponen invoice khusus ukuran kertas/PDF.
- **Timeline Status**: Representasi visual untuk alur status (misal: dari *Menunggu* hingga *Selesai*). Gunakan desain list vertikal dengan bulatan (dot) dan garis penghubung untuk menunjukkan perjalanan proses data.
- **Riwayat Perubahan Status**: Log *audit trail* yang mencatat waktu pasti dan nama user/admin yang mengubah status data. Letakkan dalam bentuk tabel kecil atau daftar historis di kartu tersendiri.
- **Catatan Internal Admin**: Tambahkan kartu berisi *Textarea* yang hanya bisa dilihat oleh internal sistem. Berguna untuk mencatat kendala, detail konfirmasi manual, atau log operasional harian.
