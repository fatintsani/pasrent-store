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
    if (!scanResult) {
      const scanner = new Html5QrcodeScanner(
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
          // Found a QR Code
          setScanResult(decodedText);
          scanner.clear(); // Stop scanning once we got a result
        },
        (error) => {
          // ignore scan errors, they happen continuously until a QR is found
        }
      );

      return () => {
        scanner.clear().catch(e => console.error("Failed to clear scanner", e));
      };
    }
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
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Scanner</h1>
        <p className="text-muted-foreground mt-2">
          Gunakan kamera untuk memindai tiket pelanggan dan secara otomatis memulai masa sewa (Check-in).
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-sm overflow-hidden p-6 flex flex-col items-center">
        
        {!scanResult ? (
          <div className="w-full max-w-sm">
            {/* The QR Scanner Container */}
            <div id="qr-reader" className="w-full rounded-2xl overflow-hidden [&_video]:rounded-2xl [&_video]:object-cover" />
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
