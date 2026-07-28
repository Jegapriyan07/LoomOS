import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
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
  applicationName: "LoomOS",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "LoomOS",
    statusBarStyle: "default",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon-192.png", sizes: "192x192" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a5f",
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
      <body className="min-h-full font-sans text-loom-ink">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
