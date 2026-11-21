import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali, Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/shared/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

// English Font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Bangla Font
const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bengali",
});

export const metadata: Metadata = {
  title: "MentorLagbe - Smart Tuition & Mentorship Platform",
  description: "Find your ideal tutor or mentorship batch today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${inter.variable} ${notoBengali.variable} font-sans antialiased bg-gray-50 text-gray-900`}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 600,
            },
          }}
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}