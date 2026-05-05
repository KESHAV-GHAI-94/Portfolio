'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
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

export default function BlogList({ posts, email }: { posts: BlogPost[], email?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-card-bg border border-border rounded-2xl overflow-hidden hover:border-muted/30 transition-all duration-300 flex flex-col shadow-xl shadow-foreground/[0.02]"
          >
            {post.imageUrl && (
              <Link href={`/blog/${post.slug}`} className="block aspect-[16/9] overflow-hidden bg-muted/5 border-b border-border">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </Link>
            )}
            <div className="p-8 flex flex-col flex-1">
              <div className="flex items-center space-x-4 text-xs text-muted mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-4 group-hover:opacity-80 transition-opacity line-clamp-2 leading-tight">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              <p className="text-muted text-sm font-light leading-relaxed mb-6 line-clamp-3">
                {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
              </p>

              <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest text-muted bg-muted/10 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-foreground hover:translate-x-1 transition-transform"
                >
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Contact CTA Section */}
      <section className="mt-32 pt-20 border-t border-border text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading text-gradient inline-block">Ready to discuss a project?</h2>
          <p className="text-muted mb-10 font-light leading-relaxed">
            I'm currently available for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
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
