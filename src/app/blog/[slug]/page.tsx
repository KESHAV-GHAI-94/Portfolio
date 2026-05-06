import prisma from "@/backend/db/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import BlogPostContent from "@/frontend/components/public/BlogPostContent";
import type { Metadata } from "next";

export const revalidate = 3600;

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true }
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, ""),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, ""),
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: ["Keshav Ghai"],
      images: post.coverImage ? [post.coverImage] : ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, ""),
      images: post.coverImage ? [post.coverImage] : ["/og-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true }
  });

  if (!post) {
    notFound();
  }

  const settings = await prisma.siteSettings.findMany();
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <main className="min-h-screen bg-background pt-40 pb-20 transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link 
          href="/blog" 
          className="text-muted hover:text-foreground transition-colors mb-16 inline-flex items-center text-sm group"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to blog
        </Link>

        <BlogPostContent post={post} email={settingsMap.email_address} />
      </div>
    </main>
  );
}
