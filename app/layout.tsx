import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SINSAJO CREATORS - AI Agents that Work While You Sleep",
  description: "Automate customer service, qualify leads and close sales 24/7 with personalized AI agents. Reduce costs 80%, scale without limits. Free demo.",
  keywords: ["AI agents", "automation", "chatbot", "artificial intelligence", "customer service", "sales automation"],
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: "SINSAJO CREATORS - AI Agents for Your Business",
    description: "Automate customer service, qualify leads and close sales 24/7. Reduce costs 80%.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
