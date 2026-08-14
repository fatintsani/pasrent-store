import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Chatbot from "@/components/chatbot";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>
      {children}
      <div className="print:hidden">
        <Footer />
      </div>
      <div className="print:hidden">
        <Chatbot />
      </div>
    </>
  );
}
