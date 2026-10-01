import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NON VEG 404 | // GOOD FOOD. NO BUGS. //',
  description:
    '404 = Not Found. But at NON VEG 404, hunger is never not found. A modern developer-inspired non-vegetarian restaurant serving dum biryani, smokey tandoor kebabs, gourmet burgers, and rich gravies.',
  keywords: [
    'NON VEG 404',
    'developer restaurant',
    'non veg restaurant',
    'dum biryani',
    'tandoori chicken',
    'mutton rogan josh',
    'gourmet burgers',
    'food delivery',
    'kebabs',
  ],
  authors: [{ name: 'NON VEG 404 Culinary Engineers' }],
  metadataBase: new URL('https://nonveg404.dev'),
  openGraph: {
    title: 'NON VEG 404 | // GOOD FOOD. NO BUGS. //',
    description:
      'Where hunger is never not found. Premium non-veg food crafted with developer precision.',
    url: 'https://nonveg404.dev',
    siteName: 'NON VEG 404',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'NON VEG 404 Official Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NON VEG 404 | // GOOD FOOD. NO BUGS. //',
    description:
      'Premium developer-inspired non-veg restaurant. Fast, hot, bug-free.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-screen flex flex-col bg-[#070709] text-zinc-100 selection:bg-amber-500 selection:text-black">
        <AuthProvider>
          <CartProvider>
            <JsonLd />
            <Navbar />
            <main className="flex-1 pt-20">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
