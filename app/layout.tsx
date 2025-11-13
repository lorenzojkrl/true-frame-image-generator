import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrueFrame",
  description:
    "TrueFrame is a platform for creating images for business content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      style={{ height: "100%" }}
    >
      <body
        className="font-sans antialiased flex flex-col h-full"
        style={{ overflow: "hidden" }}
      >
        <Header className="sticky top-0 z-50 bg-background" />
        <main className="flex-grow overflow-hidden">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
