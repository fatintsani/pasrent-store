import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins, Inter, Roboto, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { CartProvider } from "@/components/cart-provider";
import { SettingsProvider } from "@/components/settings-provider";
import { SettingsMenu } from "@/components/settings-menu";
import Script from "next/script";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Pasrent Store - Sewa PS3 & PS4 Majalengka",
  description: "Sewa PS3 & PS4 Mudah & Terjangkau di Majalengka.",
  icons: {
    icon: "/imgs/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${plusJakartaSans.variable} ${poppins.variable} ${inter.variable} ${roboto.variable} ${outfit.variable} font-plus-jakarta antialiased bg-white dark:bg-[#0d0e11] text-gray-800 dark:text-gray-200 transition-colors duration-300 min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SettingsProvider>
            <CartProvider>
              {children}
            </CartProvider>
            <SettingsMenu />
          </SettingsProvider>
        </ThemeProvider>
        
        <Script
          src={process.env.MIDTRANS_IS_PRODUCTION === 'true' ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js"}
          strategy="beforeInteractive"
          data-client-key={process.env.MIDTRANS_CLIENT_KEY}
        />
      </body>
    </html>
  );
}
