import prisma from "@/backend/db/prisma";
import BlogList from "@/frontend/components/public/BlogList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Insights on Engineering & 3D UI",
  description: "Read my latest thoughts on software engineering, creative development, and building high-performance digital products.",
};

export const revalidate = 3600;

export default async function BlogListPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });

  const settings = await prisma.siteSettings.findMany();
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <main className="min-h-screen bg-background pt-40 pb-20 transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-6xl">
        <header className="mb-20 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-foreground mb-6 tracking-tight">Blog</h1>
          <p className="text-muted text-lg md:text-xl font-light leading-relaxed">
            Thoughts on software engineering, creative development, and building high-performance digital products.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-32 border border-border rounded-3xl bg-card-bg">
            <p className="text-muted font-light">No posts published yet. Stay tuned!</p>
          </div>
        ) : (
          <BlogList posts={posts} email={settingsMap.email_address} />
        )}
      </div>
    </main>
  );
}
