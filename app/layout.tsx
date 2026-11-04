import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pathly — Your Career. Smarter.",
  description:
    "AI-powered lifelong career guidance connecting Jobs, Skills, Learning, Interview Preparation, and Career Growth.",
  keywords: [
    "AI career companion",
    "career roadmap",
    "skill gap analysis",
    "job preparation",
    "interview AI",
    "Pathly",
  ],
  authors: [{ name: "Pathly AI" }],
};

import { AuthProvider } from "@/lib/context/AuthContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#635BFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-[#F8FAFF] text-[#172033] antialiased selection:bg-[#635BFF] selection:text-white font-sans`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
