import { MetadataRoute } from 'next';
import prisma from '@/backend/db/prisma';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  let settingsMap: Record<string, string> = {};
  try {
    const settings = await prisma.siteSettings.findMany();
    settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Failed to fetch site settings for manifest:", error);
  }

  const name = settingsMap.name || "Keshav Ghai";
  const description = settingsMap.site_description || "Full-Stack Engineer with AI Integration";

  return {
    name: name,
    short_name: name,
    description: description,
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      // You should add more icon sizes here for better PWA support
      // e.g., 192x192 and 512x512
    ],
  };
}
