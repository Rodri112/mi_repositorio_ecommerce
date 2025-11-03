import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script'; // 1. IMPORTAMOS EL COMPONENTE SCRIPT

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ferretería - Herramientas y Equipos",
  description: "Tu proveedor de confianza en repuestos, consumibles y herramientas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* El CSS sí va en el head, esto está bien */}
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
      </head>
      
      <body className={inter.className}>
        {children}

        {/* 2. MOVIMOS LOS SCRIPTS AL FINAL DEL BODY Y USAMOS <Script> */}
        <Script src="https://unpkg.com/aos@2.3.1/dist/aos.js" />
        <Script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js" />
        <Script src="https://unpkg.com/feather-icons" />
      </body>
    </html>
  );
}