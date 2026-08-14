import nodemailer from "nodemailer";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { createClient } from "@/utils/supabase/server";

export async function sendBookingEmail(to: string, bookingData: any, cartItems: any[]) {
  const supabase = await createClient();
  
  // Ambil konfigurasi dari database
  const { data: settingsData } = await supabase.from("system_settings").select("*");
  
  let appMode = "development";
  let smtpConfig = { host: "", port: "465", user: "", pass: "", from: "" };
  
  if (settingsData) {
    const modeSetting = settingsData.find(s => s.key === "app_mode");
    const smtpSetting = settingsData.find(s => s.key === "smtp_config");
    
    if (modeSetting) appMode = modeSetting.value;
    if (smtpSetting) smtpConfig = smtpSetting.value;
  }

  const isDev = appMode === "development";

  // Hanya jalankan cek credential jika di production
  if (!isDev && (!smtpConfig.user || !smtpConfig.pass || !smtpConfig.host)) {
    console.warn("Email service is not configured. Missing SMTP Credentials in Settings.");
    return false;
  }

  // Gunakan Mailpit untuk development, SMTP DB untuk production
  const transporter = isDev 
    ? nodemailer.createTransport({
        host: "localhost",
        port: 1025,
        secure: false,
        ignoreTLS: true,
      })
    : nodemailer.createTransport({
        host: smtpConfig.host,
        port: parseInt(smtpConfig.port) || 465,
        secure: parseInt(smtpConfig.port) === 465,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.pass,
        },
      });

  const fromAddress = smtpConfig.from || '"Pasrent Store" <pasrentstore@gmail.com>';
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const ticketUrl = `${appUrl}/ticket/${bookingData.booking_code}`;

  let itemsHtml = "";
  cartItems.forEach(item => {
    const startDate = new Date(item.startTime);
    const dateFormatted = format(startDate, "dd MMMM yyyy", { locale: id });
    const timeFormatted = format(startDate, "HH:mm");
    
    itemsHtml += `
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <h4 style="margin: 0 0 10px 0; color: #333;">${item.consoleType} - ${item.packageName}</h4>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Jadwal:</strong> ${dateFormatted} Pukul ${timeFormatted}</p>
        ${item.gameNames && item.gameNames.length > 0 ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Games:</strong> ${item.gameNames.join(", ")}</p>` : ""}
        <p style="margin: 5px 0; font-size: 14px; color: #5000ef; font-weight: bold;">Subtotal: Rp ${item.subtotal.toLocaleString('id-ID')}</p>
      </div>
    `;
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #5000ef; text-align: center;">E-Ticket Booking Pasrent Store</h2>
      <p>Halo <strong>${bookingData.customer_name}</strong>,</p>
      <p>Terima kasih telah melakukan penyewaan di Pasrent Store. Berikut adalah detail pesanan Anda:</p>
      
      <div style="margin-top: 20px;">
        ${itemsHtml}
      </div>

      <div style="margin-top: 20px; text-align: right;">
        <h3 style="margin: 0; color: #333;">Total Pembayaran:</h3>
        <h2 style="margin: 5px 0; color: #00c3cb;">Rp ${bookingData.total_price.toLocaleString('id-ID')}</h2>
      </div>

      <div style="background-color: #5000ef10; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px dashed #5000ef;">
        <p style="margin: 0; font-size: 14px; color: #666;">Kode Booking Anda:</p>
        <h3 style="margin: 10px 0 20px 0; color: #5000ef; word-break: break-all; font-size: 24px;">${bookingData.booking_code}</h3>
        
        <a href="${ticketUrl}" style="background-color: #5000ef; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          Lihat E-Ticket & Cara Pembayaran
        </a>
      </div>
      
      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        Tunjukkan QR Code pada E-Ticket Anda saat pengantaran atau pengambilan konsol.<br/>
        Tim kami akan segera menghubungi Anda via WhatsApp untuk konfirmasi pengiriman.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: fromAddress,
      to,
      subject: `E-Ticket Pasrent Store - ${bookingData.booking_code}`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
