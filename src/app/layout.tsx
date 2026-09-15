import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Providers } from "@/frontend/providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Folgas",
  description: "Agenda pessoal de folgas, banco de horas e viagens.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} h-full`}>
      <body className="min-h-full bg-page font-sans text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
