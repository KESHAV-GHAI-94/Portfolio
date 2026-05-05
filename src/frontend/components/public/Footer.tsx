'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, User, Share2, ExternalLink } from 'lucide-react';

type FooterProps = {
  settings?: Record<string, string>;
};

export default function Footer({ settings = {} }: FooterProps) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide footer on admin pages
  if (pathname.startsWith('/admin')) return null;

  const name = settings.name || "Keshav Ghai";
  const logoText = settings.logo_text || (name.split(' ').map(n => n[0]).join('').toUpperCase() + '.');

  return (
    <footer className="py-20 relative z-10 bg-background transition-colors duration-500 overflow-hidden border-t border-border">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col items-center space-y-12">
          <Link href="/" className="text-2xl font-black tracking-tighter text-gradient">
            {logoText}
          </Link>
          
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {settings.github_link && (
              <a href={settings.github_link} target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-2 text-sm font-medium text-muted hover:text-foreground transition-all">
                <ExternalLink size={16} />
                <span>GitHub</span>
              </a>
            )}
            {settings.linkedin_link && (
              <a href={settings.linkedin_link} target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-2 text-sm font-medium text-muted hover:text-foreground transition-all">
                <User size={16} />
                <span>LinkedIn</span>
              </a>
            )}
            {settings.twitter_link && (
              <a href={settings.twitter_link} target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-2 text-sm font-medium text-muted hover:text-foreground transition-all">
                <Share2 size={16} />
                <span>Twitter</span>
              </a>
            )}
            <Link href="/blog" className="group flex items-center space-x-2 text-sm font-medium text-muted hover:text-foreground transition-all">
              <Globe size={16} />
              <span>Blog</span>
            </Link>
          </div>

          <div className="flex flex-col items-center space-y-4 pt-8">
            <div className="w-12 h-[1px] bg-border" />
            <p className="text-muted/60 text-[10px] uppercase tracking-[0.3em] font-bold text-center">
              © {currentYear} {name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
