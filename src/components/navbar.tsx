"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCart } from "@/components/cart-provider";
import { ShoppingCart, Menu, X, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/actions/auth";
import { User } from "@supabase/supabase-js";
import { useSettings } from "@/components/settings-provider";

export function Navbar() {
  const { cart } = useCart();
  const cartItemCount = cart.length;
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { setIsSettingsOpen } = useSettings();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

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

  // Tutup menu saat halaman di-scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/konsol", label: "Konsol" },
    { href: "/games", label: "Game" },
    { href: "/booking", label: "Booking" },
    { href: "/cek-pesanan", label: "Lacak Tiket" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <header className="px-4 md:px-8 py-4 bg-white dark:bg-[#0d0e11] border-b border-gray-200 dark:border-gray-800 fixed top-0 w-full z-50 transition-colors duration-300">
      <div className="flex items-center justify-between mx-auto w-full max-w-7xl relative">
        <Link
          href="/"
          className="flex items-center text-gray-900 dark:text-white shrink-0"
        >
          <Image
            src="/imgs/nav-logo.png"
            alt="Pasrent Store Logo"
            width={160}
            height={32}
            className="h-8 md:h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex text-sm gap-6 xl:gap-8 font-medium text-gray-700 dark:text-gray-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${isActive(link.href) ? "text-[#5000ef] dark:text-[#00c3cb] font-bold" : "hover:text-[#5000ef] dark:hover:text-[#00c3cb]"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/checkout"
            className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] sm:text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors focus:outline-none"
            aria-label="Pengaturan"
          >
            <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Desktop Auth */}
          <div className="hidden lg:block">
            {user ? (
              <button
                onClick={() => logout()}
                className="text-sm py-2 px-6 border border-[#5000ef] text-[#5000ef] dark:border-[#00c3cb] dark:text-[#00c3cb] font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="text-sm py-2 px-6 bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -mr-2 text-gray-700 dark:text-gray-300 hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#0d0e11] border-b border-gray-200 dark:border-gray-800 flex flex-col py-4 px-6 gap-4 shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-70px)] overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-base transition-colors py-2 ${isActive(link.href) ? "text-[#5000ef] dark:text-[#00c3cb] font-bold" : "font-medium text-gray-700 dark:text-gray-300 hover:text-[#5000ef] dark:hover:text-[#00c3cb]"}`}
            >
              {link.label}
            </Link>
          ))}

          <div className="w-full h-px bg-gray-100 dark:bg-gray-800 my-2"></div>

          {user ? (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                logout();
              }}
              className="text-left text-base font-bold text-red-600 dark:text-red-400 py-2 w-full hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg px-2 -ml-2 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center text-base py-3 px-6 bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white font-bold rounded-xl hover:opacity-90 transition-opacity w-full mt-2"
            >
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
