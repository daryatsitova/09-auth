import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";

import Header from "@/components/Header/Header";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Footer from "@/components/Footer/Footer";

const roboto = Roboto({
  variable: '--font-roboto',
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Note HUB",
  description: "Application for creating, viewing and editing notes. Created in GoIT",

   openGraph: {
    title: 'Note HUB',
    description:
      'Application for creating, viewing and editing notes. Created in GoIT',
    url: 'https://08-zustand-nu-liard.vercel.app',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Note HUB app image',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <TanStackProvider>
        <Header />
          {children}
          {modal}
        <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
