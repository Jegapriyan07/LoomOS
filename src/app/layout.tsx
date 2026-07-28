import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-loom-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-loom-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "LoomOS",
  description:
    "Voice-first business operating system for Indian handloom weavers — what to weave, when to start, when you get paid.",
  // PWA / offline caching arrives in later stages; keep metadata honest for Stage 0.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-palette="indigo-vat"
      className={`${nunito.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans text-loom-ink">{children}</body>
    </html>
  );
}
