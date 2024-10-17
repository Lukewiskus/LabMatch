// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { NavBar } from '@/components/navbar'; 
import NextAuthProvider from "@/components/nextAuthProvier";

export const metadata: Metadata = {
  title: "Labs Reputation",
  description: "Look up your PI and their lab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
            {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
