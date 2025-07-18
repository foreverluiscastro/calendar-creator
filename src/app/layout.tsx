import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

import { PT_Serif } from 'next/font/google';

const ptSerif = PT_Serif({
  subsets: ['latin'],
  variable: '--font-ptserif',
  weight: ['400', '700'],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ptSerif.variable}>
      <body
        className="font-ptserif"
      >
        {children}
      </body>
    </html>
  );
}
