"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { processScannedTicket } from "@/app/actions/scanner";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AdminScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string; bookingId?: string } | null>(null);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    
    // Check if element exists before initializing
    const element = document.getElementById("qr-reader");
    if (!scanResult && element) {
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );
      
      scanner.render(
        (decodedText) => {
          setScanResult(decodedText);
          if (scanner) {
            scanner.clear().catch(console.error);
          }
        },
        (error) => {
          // ignore scan errors
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanResult]);

  useEffect(() => {
    if (scanResult) {
      const processCode = async () => {
        setLoading(true);
        setStatus(null);
        
        const res = await processScannedTicket(scanResult);
        
        setStatus({
          success: res.success,
          message: res.success ? res.message! : res.error!,
          bookingId: res.bookingId
        });
        
        setLoading(false);
      };
      
      processCode();
    }
  }, [scanResult]);

  const resetScanner = () => {
    setScanResult(null);
    setStatus(null);
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Scanner</h1>
        <p className="text-muted-foreground mt-2">
          Gunakan kamera untuk memindai tiket pelanggan dan secara otomatis memulai masa sewa (Check-in).
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 md:p-8 flex flex-col items-center animate-in fade-in duration-500">
        
        {!scanResult ? (
          <div className="w-full max-w-sm">
            {/* Styles override for html5-qrcode library default ugly UI */}
            <style jsx global>{`
              #qr-reader {
                border: none !important;
                box-shadow: none !important;
              }
              #qr-reader img {
                margin: 0 auto !important;
                display: block;
                margin-bottom: 15px !important;
              }
              #qr-reader__dashboard_section_csr span,
              #qr-reader__dashboard_section_csr div {
                text-align: center !important;
                display: block !important;
              }
              #qr-reader__dashboard_section_swaplink {
                text-decoration: none !important;
                color: #5000ef !important;
                font-weight: 600 !important;
                display: block !important;
                margin-top: 15px !important;
                text-align: center !important;
              }
              #qr-reader button {
                background-color: #5000ef !important;
                color: white !important;
                border: none !important;
                padding: 10px 20px !important;
                border-radius: 12px !important;
                font-weight: 700 !important;
                cursor: pointer !important;
                margin: 10px auto !important;
                display: block !important;
                transition: opacity 0.2s;
              }
              #qr-reader button:hover {
                opacity: 0.9;
              }
              #qr-reader__camera_permission_button {
                background-color: #00c3cb !important;
              }
            `}</style>
            
            {/* The QR Scanner Container */}
            <div id="qr-reader" className="w-full overflow-hidden [&_video]:rounded-2xl [&_video]:object-cover" />
            <p className="text-center text-sm text-gray-500 mt-4">Arahkan kamera ke QR Code pelanggan.</p>
          </div>
        ) : (
          <div className="w-full text-center py-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-[#5000ef] dark:text-[#00c3cb] animate-spin" />
                <p className="text-lg font-medium animate-pulse">Memproses tiket...</p>
              </div>
            ) : status ? (
              <div className="flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in-95">
                {status.success ? (
                  <CheckCircle className="w-20 h-20 text-green-500" />
                ) : (
                  <XCircle className="w-20 h-20 text-red-500" />
                )}
                
                <div className="max-w-md">
                  <h3 className={`text-2xl font-bold mb-2 ${status.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {status.success ? 'Check-in Berhasil!' : 'Gagal Memproses'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {status.message}
                  </p>
                </div>

                <div className="flex gap-4 mt-4">
                  <button 
                    onClick={resetScanner}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" /> Scan Lagi
                  </button>
                  
                  {status.success && status.bookingId && (
                    <Link 
                      href={`/admin/bookings/${status.bookingId}`}
                      className="px-6 py-3 bg-[#5000ef] text-white font-bold rounded-xl hover:bg-[#4000c0] transition"
                    >
                      Lihat Pesanan
                    </Link>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
}
