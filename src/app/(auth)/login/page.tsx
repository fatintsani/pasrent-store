import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, loginWithGoogle } from "@/app/actions/auth";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string; error: string };
}) {
  return (
    <section className="bg-gray-50 dark:bg-[#0d0e11] min-h-screen flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-sm flex flex-col items-center gap-y-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-8 py-10 shadow-lg">
        <div className="flex flex-col items-center gap-y-4">
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Masuk ke Akun Anda
          </h1>
        </div>

        {searchParams?.message && (
          <div className="w-full p-3 text-sm text-center text-green-700 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-400">
            {searchParams.message}
          </div>
        )}

        {searchParams?.error && (
          <div className="w-full p-3 text-sm text-center text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
            Gagal masuk. Periksa kembali email dan password Anda.
          </div>
        )}

        <form className="flex w-full flex-col gap-6" action={login}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
                className="rounded-xl bg-gray-50 dark:bg-gray-800/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                className="rounded-xl bg-gray-50 dark:bg-gray-800/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white font-bold hover:opacity-90 transition-opacity h-12"
            >
              Login
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                  Atau
                </span>
              </div>
            </div>

            <Button
              formAction={loginWithGoogle}
              variant="outline"
              className="w-full rounded-xl border-gray-200 dark:border-gray-700 h-12 text-gray-700 dark:text-gray-300"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Masuk dengan Google
            </Button>
          </div>
        </form>

        <div className="flex flex-col items-center gap-2 text-sm">
          <Link
            href="/forgot-password"
            className="text-gray-500 hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
          >
            Lupa password?
          </Link>
          <div className="text-gray-500 flex gap-1">
            Belum punya akun?
            <Link
              href="/register"
              className="text-[#5000ef] dark:text-[#00c3cb] font-semibold hover:underline"
            >
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
