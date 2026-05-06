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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://keshavghai.com";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | ${name}`,
    },
    description,
    keywords: [
      "Full-Stack Engineer",
      "React Developer",
      "Next.js",
      "TypeScript",
      "AI Integration",
      "Portfolio",
      "Portfolio",
      "Software Engineer",
      name,
    ],
    authors: [{ name: name, url: baseUrl }],
    creator: name,
    publisher: name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: `${name} Portfolio`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${name} Portfolio Preview`,
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
      creator: "@keshavghai", // Fallback, ideally from settings
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

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
          {gaId && <GoogleAnalytics gaId={gaId} />}
        </ThemeProvider>
      </body>
    </html>
  );
}
