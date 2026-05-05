'use client';

import { motion } from 'framer-motion';
import { Download, Terminal, Briefcase, GraduationCap } from 'lucide-react';

type AboutProps = {
  aboutHeading?: string;
  aboutText?: string;
  resumeUrl?: string;
  stat1Title?: string; stat1Subtitle?: string;
  stat2Title?: string; stat2Subtitle?: string;
  stat3Title?: string; stat3Subtitle?: string;
};

export default function About(props: AboutProps) {
  const heading = props.aboutHeading || "Building the future, one line of code at a time.";
  const text = props.aboutText || "I am a passionate Full-Stack Engineer who specializes in building highly performant, scalable, and visually stunning web applications. With a deep understanding of both server-side architecture and modern front-end frameworks, I bridge the gap between design and robust engineering.\n\nWhether it's designing a complex PostgreSQL schema with Prisma or writing custom WebGL shaders using Three.js, I approach every problem with curiosity and a drive for excellence.";
  const resume = props.resumeUrl || "/resume.pdf";
  
  const achievements = [
    { icon: <Terminal className="w-5 h-5 text-foreground" />, title: props.stat1Title || "10+ Tech Stacks", subtitle: props.stat1Subtitle || "Frontend & backend" },
    { icon: <Briefcase className="w-5 h-5 text-foreground" />, title: props.stat2Title || "5+ Years", subtitle: props.stat2Subtitle || "Engineering experience" },
    { icon: <GraduationCap className="w-5 h-5 text-foreground" />, title: props.stat3Title || "B.S. Comp Sci", subtitle: props.stat3Subtitle || "University of Technology" },
  ];

  return (
    <section id="about" className="py-40 relative bg-background scroll-mt-24 transition-colors duration-500">
      <div className="section-divider absolute top-0 left-0" />
      
      <div className="container mx-auto px-8 md:px-12 max-w-6xl relative z-10">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-2 text-gradient inline-block">About</h2>
          <p className="text-muted">The journey so far.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-medium text-foreground mb-4 leading-snug">
              {heading}
            </h3>
            <div className="space-y-4 text-muted font-light leading-relaxed whitespace-pre-line">
              {text}
            </div>
            
            <div className="pt-6">
              <a
                href={resume}
                target="_blank"
                className="inline-flex items-center space-x-3 bg-foreground text-background px-10 py-4 rounded-full font-bold transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] shadow-2xl shadow-foreground/20"
              >
                <span className="text-sm uppercase tracking-widest">Download Resume</span>
                <Download className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {achievements.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl glass-panel flex flex-col space-y-4"
              >
                <div className="w-10 h-10 rounded-xl border border-border bg-foreground/5 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted">{item.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
