import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import Header from "@/components/layout/Header";
import FacebookPixel from "@/components/analytics/FacebookPixel";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import JsonLd, { organizationSchema, websiteSchema } from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.screatorsai.com'),
  title: {
    default: 'Sinsajo Creators - Agentes de IA que Trabajan Mientras Duermes',
    template: '%s | Sinsajo Creators',
  },
  description: 'Automatiza atención al cliente, califica leads y cierra ventas 24/7 con agentes de IA personalizados. Reduce costos 80%, escala sin límites. Workshops y herramientas de IA para empresarias.',
  keywords: [
    'agentes de IA', 'automatización negocios', 'inteligencia artificial empresas',
    'chatbot IA', 'atención al cliente IA', 'automatizar ventas',
    'AI agents', 'business automation', 'Sinsajo Creators',
    'IA para empresarias', 'workshop inteligencia artificial',
  ],
  authors: [{ name: 'Sinsajo Creators' }],
  creator: 'Sinsajo Creators',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Sinsajo Creators - Agentes de IA para Tu Negocio',
    description: 'Automatiza atención al cliente, califica leads y cierra ventas 24/7 con agentes de IA. Reduce costos 80%.',
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_US',
    siteName: 'Sinsajo Creators',
    images: ['/images/sinsajo-logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sinsajo Creators - Agentes de IA para Tu Negocio',
    description: 'Automatiza tu negocio con IA. Agentes personalizados que trabajan 24/7.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <GoogleAnalytics />
        <FacebookPixel />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            <div id="main-content">
              {children}
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
