import type { Metadata } from 'next';
import './globals.css';
import { LangProvider } from '@/contexts/LangContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Amine Parfumes – Créations d\'Exception',
  description: 'Découvrez notre collection exclusive de parfums de luxe. Livraison à domicile au Maroc.',
  keywords: 'parfums, fragrances, luxe, Maroc, Agadir, Amine Parfumes',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: { title: 'Amine Parfumes', description: 'Créations d\'Exception', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        {/* Step 1: preconnect to Google Fonts servers — establishes TCP early */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/*
          Step 2: load fonts with rel="stylesheet" in <head> (NOT @import in CSS).
          @import in CSS is render-blocking AND delays font discovery.
          This way the browser finds fonts in the first HTML response.
          display=swap ensures text is visible immediately with fallback font.
        */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <LangProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: { background: '#0f1628', color: '#fdf8ee', border: '1px solid rgba(201,162,39,0.3)', fontFamily: 'Jost, sans-serif' },
                success: { iconTheme: { primary: '#c9a227', secondary: '#0f1628' } },
              }}
            />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
