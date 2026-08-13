"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCart } from "@/components/cart-provider";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/actions/auth";
import { User } from "@supabase/supabase-js";

export function Navbar() {
  const { cart } = useCart();
  const cartItemCount = cart.length;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="px-8 py-4 bg-white dark:bg-[#0d0e11] border-b border-gray-200 dark:border-gray-800 fixed top-0 w-full z-50 transition-colors duration-300">
      <div className="flex items-center justify-between mx-auto w-full max-w-7xl">
        <Link
          href="/"
          className="flex items-center text-gray-900 dark:text-white"
        >
          <Image
            src="/imgs/nav-logo.png"
            alt="Pasrent Store Logo"
            width={200}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        <nav className="hidden md:flex text-sm gap-8 font-medium text-gray-700 dark:text-gray-300">
          <Link
            href="/"
            className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
          >
            Beranda
          </Link>
          <Link
            href="/konsol"
            className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
          >
            Konsol
          </Link>
          <Link
            href="/booking"
            className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
          >
            Booking
          </Link>
          <Link
            href="/cek-pesanan"
            className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
          >
            Lacak
          </Link>
          <Link
            href="/faq"
            className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
          >
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/checkout"
            className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => logout()}
                className="hidden sm:inline-block text-sm py-2 px-6 border border-[#5000ef] text-[#5000ef] dark:border-[#00c3cb] dark:text-[#00c3cb] font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-block text-sm py-2 px-6 bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
