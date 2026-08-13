import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Pasrent Store",
  description: "Pasrent Store Admin Dashboard",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0d0e11] font-sans">
      {children}
    </div>
  );
}
