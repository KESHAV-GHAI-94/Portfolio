'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ContactModal from './ContactModal';

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  tags: string[];
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function BlogPostContent({ post, email }: { post: BlogPost, email?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(post.createdAt));

  return (
    <>
      <header className="mb-12">
        <time className="text-sm text-muted mb-4 block font-medium">
          {formattedDate}
        </time>
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-foreground mb-8 tracking-tight leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <span key={tag} className="px-4 py-1.5 bg-muted/5 border border-border text-muted text-xs font-medium rounded-full uppercase tracking-widest">
              {tag}
            </span>
          ))}
        </div>

        {post.imageUrl && (
          <div className="mt-12 aspect-[21/9] rounded-3xl overflow-hidden border border-border bg-card-bg">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>

      <div 
        className="prose dark:prose-invert prose-neutral max-w-none prose-p:text-muted prose-p:text-lg prose-p:leading-relaxed prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight prose-a:text-foreground prose-strong:text-foreground prose-img:rounded-2xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <section className="mt-32 pt-20 border-t border-border text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">Have thoughts on this post?</h2>
          <p className="text-muted mb-10 font-light leading-relaxed">
            I'd love to hear your feedback or discuss the topic further. Feel free to reach out and let's connect!
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-foreground text-background px-10 py-4 rounded-full font-semibold transition-all hover:opacity-90 hover:scale-105 active:scale-95"
          >
            <span>Get in Touch</span>
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </section>

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        email={email}
      />
    </>
  );
}
