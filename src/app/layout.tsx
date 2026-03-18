import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GameProvider } from '@/lib/game-context';

export const metadata: Metadata = {
  title: 'Buffett Battle - Aprende a Invertir Jugando',
  description: 'Juego educativo de inversión inspirado en Warren Buffett. Compite con tus amigos para construir el mejor portafolio.',
  icons: { icon: '💰' }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans text-white antialiased">
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
