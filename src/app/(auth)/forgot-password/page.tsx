import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/app/actions/auth";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { message: string; error: string };
}) {
  return (
    <section className="bg-gray-50 dark:bg-[#0d0e11] min-h-screen flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-sm flex flex-col items-center gap-y-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-8 py-10 shadow-lg">
        
        <div className="flex flex-col items-center gap-y-4 text-center">
          <Link href="/">
            <Image
              src="/imgs/nav-logo.png"
              alt="Pasrent Store Logo"
              width={200}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Lupa Password</h1>
          <p className="text-sm text-gray-500">
            Masukkan email Anda dan kami akan mengirimkan link untuk mereset password.
          </p>
        </div>

        {searchParams?.message && (
          <div className="w-full p-3 text-sm text-center text-green-700 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-400">
            {searchParams.message}
          </div>
        )}

        {searchParams?.error && (
          <div className="w-full p-3 text-sm text-center text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
            Terjadi kesalahan. Pastikan email yang Anda masukkan benar.
          </div>
        )}

        <form className="flex w-full flex-col gap-6" action={forgotPassword}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Input id="email" name="email" type="email" placeholder="Email" required className="rounded-xl bg-gray-50 dark:bg-gray-800/50" />
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full rounded-xl bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white font-bold hover:opacity-90 transition-opacity h-12">
              Kirim Link Reset
            </Button>
          </div>
        </form>

        <div className="flex flex-col items-center gap-2 text-sm">
          <Link
            href="/login"
            className="text-gray-500 hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors flex items-center gap-1"
          >
            &larr; Kembali ke Login
          </Link>
        </div>
      </div>
    </section>
  );
}
