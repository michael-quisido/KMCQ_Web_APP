"use client";

import { Geist, Geist_Mono, Ubuntu } from "next/font/google";
import "./globals.css";
import NetworkCanvas from "@/components/NetworkCanvas";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ubuntu = Ubuntu({
  weight: "400",
  variable: "--font-ubuntu",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/administrator");

  useEffect(() => {
    document.title = "KMCQ GmbH, headquartered in Cebu, Philippines. One of the trusted VPS, Data Web Hosting, WordPress Hosting, Email Hosting and etc.";
  }, []);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${ubuntu.variable} antialiased`}>
        {!isAdmin && <NetworkCanvas />}
        {children}
      </body>
    </html>
  );
}
