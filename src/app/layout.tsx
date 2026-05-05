import type { Metadata } from "next";
export const dynamic = 'force-dynamic';
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Navbar from "@/frontend/components/public/Navbar";
import Footer from "@/frontend/components/public/Footer";
import { ThemeProvider } from "@/frontend/components/providers/ThemeProvider";
import prisma from "@/backend/db/prisma";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let settingsMap: Record<string, string> = {};
  try {
    const settings = await prisma.siteSettings.findMany();
    settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Failed to fetch site settings for metadata:", error);
  }

  const name = settingsMap.name || "Keshav Ghai";
  const title = settingsMap.site_title || `${name} | Professional Portfolio`;
  const description = settingsMap.site_description || "Full-Stack Engineer with AI Integration";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://keshavghai.com",
      siteName: `${name} Portfolio`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settingsMap: Record<string, string> = {};
  try {
    const settings = await prisma.siteSettings.findMany();
    settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Failed to fetch site settings for layout:", error);
  }

  const name = settingsMap.name || "Keshav Ghai";
  const logoSetting = settingsMap.logo_text;
  
  // Use logo_text setting if available, otherwise derive initials
  const initials = logoSetting || (name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() + '.');

  return (
    <html lang="en" className={`${inter.variable} scroll-smooth antialiased`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground selection:bg-accent/20">
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <Navbar logoText={initials} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer settings={settingsMap} />
          <Analytics />
          <GoogleAnalytics gaId="G-XXXXXXXXXX" />
        </ThemeProvider>
      </body>
    </html>
  );
}
