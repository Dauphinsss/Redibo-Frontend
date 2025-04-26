import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper"; 

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Redibo",
  description: "Ingenieria de software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <SessionProviderWrapper>

          <Toaster />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
