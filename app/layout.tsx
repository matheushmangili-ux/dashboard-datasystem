import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  Manrope
} from "next/font/google";
import type { ReactNode } from "react";

import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

const headingFont = Manrope({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-heading"
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body"
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "Pulse ERP Dashboard",
  description:
    "Painel em tempo real para colaboradores acompanharem os resultados do ERP Data System."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
