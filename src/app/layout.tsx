import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
});

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Folgas",
  description:
    "Planejamento pessoal de folgas, banco de horas e viagens com o calendário oficial do  de 2026.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable} h-full`}>
      <body className="min-h-full bg-cream font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
