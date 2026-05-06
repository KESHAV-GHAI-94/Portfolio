'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D canvas so it doesn't break SSR
const HeroCanvas = dynamic(() => import('@/frontend/components/3d/HeroCanvas'), { ssr: false });

type HeroProps = {
  name?: string;
  badgeText?: string;
  occupationTitle?: string;
  bio?: string;
};

export default function Hero({ name, badgeText, occupationTitle, bio }: HeroProps) {
  const displayName = name || "Keshav Ghai";
  const subtitle = occupationTitle || "Software Engineer & AI Integration Specialist";
  const displayBadge = badgeText || "Available for AI & Full-Stack Projects";
  const displayBio = bio || "Building high-performance digital experiences that bridge the gap between robust Software Engineering and cutting-edge Artificial Intelligence integration.";
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background transition-colors duration-500">
      {/* 3D Particle Background */}
      <HeroCanvas />

      <div className="container relative z-10 mx-auto px-6 max-w-5xl">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium text-muted border border-border bg-card-bg"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-500"></span>
            </span>
            <span>{displayBadge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold font-heading tracking-tight"
          >
            <span className="text-gradient">{displayName}</span>
            <br />
            <span className="text-3xl md:text-5xl mt-4 block text-muted font-normal">
              {subtitle.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.05, delay: index * 0.03 + 0.5 }}
                >
                  {char}
                </motion.span>
              ))}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="inline-block w-[3px] h-[0.9em] bg-foreground ml-1 align-middle"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.5 }}
            className="max-w-2xl text-lg text-muted font-light whitespace-pre-line"
          >
            {displayBio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.7 }}
            className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4"
          >
            <a
              href="#projects"
              className="group flex items-center space-x-2 bg-foreground text-background px-6 py-3 rounded-md font-medium transition-all duration-200 hover:opacity-90"
            >
              <span>View Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="#contact"
              className="group flex items-center space-x-2 bg-transparent text-foreground border border-border hover:border-muted px-6 py-3 rounded-md font-medium transition-all duration-200 hover:bg-muted/5"
            >
              <span>Resume</span>
              <Download className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
