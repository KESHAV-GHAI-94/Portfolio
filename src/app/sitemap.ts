import { MetadataRoute } from 'next';
import prisma from '@/backend/db/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://keshavghai.com';

  const projects = await prisma.project.findMany();
  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: project.updatedAt || new Date(),
  }));

  const blogPosts = await prisma.blogPost.findMany({
    where: { published: true }
  });
  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...projectUrls,
    ...blogUrls,
  ];
}
