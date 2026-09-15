import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EstilosIA',
  description: 'Tu gestion para el armario',
};

// Follows the OS color scheme by toggling the `.dark` class before first paint (no flash).
const colorSchemeScript = `(function(){try{var m=window.matchMedia('(prefers-color-scheme: dark)');var a=function(){document.documentElement.classList.toggle('dark',m.matches)};a();m.addEventListener('change',a)}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
