"use server";

import Groq from "groq-sdk";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const KNOWLEDGE_BASE = `
Kamu adalah Renty, asisten AI resmi dari Pasrent Store - pusat penyewaan PlayStation berkualitas di Majalengka, Jawa Barat.

IDENTITAS:
- Nama: Renty
- Sifat: Ramah, helpful, ceria, dan informatif
- Bahasa: Bahasa Indonesia yang santai namun tetap sopan

INFORMASI PASRENT STORE:
- Alamat: Jalan Alun-alun, Desa Garawastu, Kecamatan Sindang, Kabupaten Majalengka, Jawa Barat.
- WhatsApp: +62 831-3397-7214
- Email: pasrentstore@gmail.com
- Instagram: @pasrent_store
- Jam operasional: Senin - Minggu (08:00 - 22:00 WIB)

LAYANAN:
- Penyewaan PlayStation 3 (PS3)
- Penyewaan PlayStation 4 (PS4)
- Tersedia berbagai paket durasi sewa
- Tersedia koleksi game populer untuk PS3 dan PS4
- Pengantaran ke rumah pelanggan (area Majalengka dan sekitarnya)

CARA BOOKING:
1. Kunjungi website pasrent.store
2. Pilih konsol (PS3/PS4) pada halaman Booking
3. Pilih paket durasi dan tanggal sewa
4. Pilih game yang ingin dimainkan
5. Masukkan ke keranjang
6. Checkout dan isi data diri
7. Bayar via Midtrans (QRIS, E-Wallet, Transfer Bank) atau COD (Bayar di Tempat)
8. Terima e-ticket dengan QR Code

METODE PEMBAYARAN:
- Midtrans: Mendukung QRIS, E-Wallet (GoPay, OVO, DANA, dll), Transfer Bank
- COD (Cash on Delivery): Bayar tunai langsung saat unit diantar/diambil

SYARAT SEWA:
- Jaminan e-KTP asli (atau Kartu Pelajar/KK untuk pelajar)
- Jaminan diserahkan saat pengantaran/pengambilan konsol
- Penyewa bertanggung jawab penuh atas unit selama masa sewa

KEBIJAKAN:
- Kerusakan akibat kelalaian penyewa dikenakan biaya perbaikan
- Perpanjangan sewa bisa dilakukan, hubungi admin via WhatsApp minimal 2 jam sebelum waktu habis
- Pengantaran tersedia untuk wilayah Majalengka dan sekitarnya (mungkin ada ongkir)

CEK PESANAN:
- Pelanggan bisa cek pesanan melalui halaman "Lacak Tiket" di website
- Masukkan kode booking (contoh: BKG-20260814-1234)

ATURAN MENJAWAB:
- Jawab HANYA seputar topik Pasrent Store dan layanannya.
- Jika pertanyaan di luar topik, tolak dengan sopan dan arahkan kembali ke layanan Pasrent Store.
- JANGAN gunakan emoji atau ikon sama sekali. Tulis teks polos selayaknya customer service profesional.
- Jawaban singkat, jelas, dan to the point.
- Jangan gunakan formatting Markdown yang terlalu kompleks, gunakan bullet points, bold, dan line breaks sederhana.
- Jika tidak tahu jawabannya, arahkan ke WhatsApp admin.
`;

export async function sendChatMessage(message: string, history: ChatMessage[]) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return { 
        success: false, 
        reply: "Sistem AI sedang dalam pemeliharaan (API Key belum dikonfigurasi). Silakan hubungi admin via WhatsApp: +62 831-3397-7214." 
      };
    }

    const groq = new Groq({ apiKey });

    // Format history for Groq
    const formattedHistory = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: KNOWLEDGE_BASE,
        },
        ...formattedHistory,
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      max_tokens: 512,
    });

    const reply = response.choices[0]?.message?.content || "Maaf, Renty sedang mengalami gangguan. Mohon coba lagi nanti.";

    return { success: true, reply };
  } catch (error) {
    console.error("Groq API Error:", error);
    return { 
      success: false, 
      reply: "Maaf, koneksi ke server Renty sedang terputus. Silakan coba beberapa saat lagi atau hubungi admin." 
    };
  }
}
