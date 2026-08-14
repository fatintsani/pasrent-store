"use client";

import React, { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { submitBooking } from "@/app/actions/booking";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    formData.append("cart", JSON.stringify(cart));

    const res = await submitBooking(formData);
    
    if (res.success) {
      if (res.snapToken) {
        window.snap.pay(res.snapToken, {
          onSuccess: function(result: any){
            clearCart();
            window.location.href = `/ticket/${res.bookingCode}`;
          },
          onPending: function(result: any){
            clearCart();
            window.location.href = `/ticket/${res.bookingCode}`;
          },
          onError: function(result: any){
            setLoading(false);
            setErrorMsg("Pembayaran gagal! Silakan hubungi admin.");
          },
          onClose: function(){
            setLoading(false);
            // Meskipun ditutup, order sudah tercatat di database (Pending).
            // Kita arahkan ke halaman tiket agar user bisa melihat detail pesanan.
            clearCart();
            window.location.href = `/ticket/${res.bookingCode}`;
          }
        });
      } else {
        clearCart();
        window.location.href = `/ticket/${res.bookingCode}`;
      }
    } else {
      setErrorMsg(res.error || "Gagal memproses booking");
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl max-w-md shadow-sm border border-gray-200 dark:border-gray-700">
          <i className="bi bi-cart-x text-6xl text-gray-400 mb-6 inline-block"></i>
          <h2 className="text-2xl font-bold mb-4">Keranjang Kosong</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Anda belum memilih unit untuk disewa.</p>
          <Link href="/" className="px-6 py-3 bg-[#5000ef] text-white font-bold rounded-xl hover:bg-[#3d00b8] transition">
            Mulai Booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
      <section className="py-8 antialiased md:py-16">
        <form onSubmit={handleSubmit} className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          
          <div className="mb-8 flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout Pesanan</h1>
          </div>

          <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base mb-8">
            <li className="after:border-1 flex items-center text-[#5000ef] dark:text-[#00c3cb] after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
              <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                <svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Cart
              </span>
            </li>
            <li className="after:border-1 flex items-center text-[#5000ef] dark:text-[#00c3cb] after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
              <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                <svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Checkout
              </span>
            </li>
            <li className="flex shrink-0 items-center">
              <svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Payment
            </li>
          </ol>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
            
            {/* Left Column: Form */}
            <div className="min-w-0 flex-1 space-y-8">
              <div className="space-y-4 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Detail Pengiriman & Pelanggan</h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div>
                    <label htmlFor="nama" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Nama Lengkap </label>
                    <input type="text" id="nama" name="nama" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-[#5000ef] focus:ring-[#5000ef] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400" placeholder="Contoh: Budi Santoso" required />
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Nomor WhatsApp </label>
                    <input type="text" id="whatsapp" name="whatsapp" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-[#5000ef] focus:ring-[#5000ef] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400" placeholder="081234567890" required />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Email </label>
                    <input type="email" id="email" name="email" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-[#5000ef] focus:ring-[#5000ef] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400" placeholder="budi@example.com" required />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="alamat" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Alamat Lengkap (Untuk Pengiriman) </label>
                    <textarea id="alamat" name="alamat" rows={3} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-[#5000ef] focus:ring-[#5000ef] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400" placeholder="Jalan Mawar No 12, RT 01/RW 02..." required></textarea>
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Metode Pembayaran</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input id="transfer" type="radio" name="payment-method" value="transfer" className="h-4 w-4 border-gray-300 bg-white text-[#5000ef] focus:ring-2 focus:ring-[#5000ef] dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800" defaultChecked />
                      </div>
                      <div className="ms-4 text-sm">
                        <label htmlFor="transfer" className="font-medium leading-none text-gray-900 dark:text-white cursor-pointer"> Midtrans </label>
                        <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Bayar online via QRIS, E-Wallet, atau Transfer Bank</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input id="cod" type="radio" name="payment-method" value="cod" className="h-4 w-4 border-gray-300 bg-white text-[#5000ef] focus:ring-2 focus:ring-[#5000ef] dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800" />
                      </div>
                      <div className="ms-4 text-sm">
                        <label htmlFor="cod" className="font-medium leading-none text-gray-900 dark:text-white cursor-pointer"> Bayar di Tempat (COD) </label>
                        <p className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Bayar tunai langsung saat unit diantar/diambil</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm self-start">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
              
              <div className="flow-root">
                <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-700">
                  
                  {cart.map((item, index) => (
                    <div key={item.id} className="py-4 flex justify-between items-start gap-4">
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{item.consoleType} - {item.packageName}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.dateStr} {item.timeStr}</p>
                        {item.gameNames.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.gameNames.join(", ")}</p>
                        )}
                      </div>
                      <p className="font-medium text-sm whitespace-nowrap text-[#5000ef] dark:text-[#00c3cb]">Rp {item.subtotal.toLocaleString('id-ID')}</p>
                    </div>
                  ))}

                  <dl className="flex items-center justify-between gap-4 py-4 mt-2">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Subtotal</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">Rp {cartTotal.toLocaleString('id-ID')}</dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4 py-4">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">Total Akhir</dt>
                    <dd className="text-xl font-bold text-[#5000ef] dark:text-[#00c3cb]">Rp {cartTotal.toLocaleString('id-ID')}</dd>
                  </dl>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-xl bg-[#5000ef] px-5 py-4 text-sm font-bold text-white hover:bg-[#3d00b8] focus:outline-none focus:ring-4 focus:ring-[#5000ef]/30 disabled:opacity-50 transition"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <i className="bi bi-arrow-repeat animate-spin"></i> Memproses...
                    </span>
                  ) : "Selesaikan Booking & Pembayaran"}
                </button>

                <p className="text-xs font-normal text-gray-500 dark:text-gray-400 text-center">
                  Dengan melanjutkan, Anda menyetujui syarat & ketentuan sewa Pasrent Store.
                </p>
              </div>
            </div>

          </div>
        </form>
      </section>
    </div>
  );
}
