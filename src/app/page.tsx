import Hero from "@/frontend/components/public/Hero";
import Skills from "@/frontend/components/public/Skills";
import Projects from "@/frontend/components/public/Projects";
import About from "@/frontend/components/public/About";
import ContactForm from "@/frontend/components/public/ContactForm";
import ScrollScene from "@/frontend/components/3d/ScrollScene";
import Link from "next/link";
import prisma from "@/backend/db/prisma";
import { Globe } from 'lucide-react';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

export const revalidate = 60;

export default async function Home() {
  const settings = await prisma.siteSettings.findMany();
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <>
      <Hero
        name={settingsMap.name}
        badgeText={settingsMap.hero_badge_text}
        occupationTitle={settingsMap.occupation_title}
        bio={settingsMap.bio}
      />
      <ScrollScene>
        <About
          aboutHeading={settingsMap.about_heading}
          aboutText={settingsMap.about_text}
          resumeUrl={settingsMap.resume_url}
          stat1Title={settingsMap.stat_1_title}
          stat1Subtitle={settingsMap.stat_1_subtitle}
          stat2Title={settingsMap.stat_2_title}
          stat2Subtitle={settingsMap.stat_2_subtitle}
          stat3Title={settingsMap.stat_3_title}
          stat3Subtitle={settingsMap.stat_3_subtitle}
        />
        <Skills />
        <Projects />
        <ContactForm email={settingsMap.email_address} />

        <footer className="py-20 relative z-10 bg-background transition-colors duration-500 overflow-hidden">
          <div className="section-divider absolute top-0 left-0" />

          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex flex-col items-center space-y-12">
              <Link href="/" className="text-2xl font-black tracking-tighter text-gradient">
                {settingsMap.logo_text || (settingsMap.name ? settingsMap.name.split(' ').map(n => n[0]).join('').toUpperCase() + '.' : 'KG.')}
              </Link>

              <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                {settingsMap.github_link && (
                  <a href={settingsMap.github_link} target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-2 text-sm font-medium text-muted hover:text-foreground transition-all">
                    <GithubIcon />
                    <span>GitHub</span>
                  </a>
                )}
                {settingsMap.linkedin_link && (
                  <a href={settingsMap.linkedin_link} target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-2 text-sm font-medium text-muted hover:text-foreground transition-all">
                    <LinkedinIcon />
                    <span>LinkedIn</span>
                  </a>
                )}
                {settingsMap.twitter_link && (
                  <a href={settingsMap.twitter_link} target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-2 text-sm font-medium text-muted hover:text-foreground transition-all">
                    <TwitterIcon />
                    <span>Twitter</span>
                  </a>
                )}
                <Link href="/blog" className="group flex items-center space-x-2 text-sm font-medium text-muted hover:text-foreground transition-all">
                  <Globe className="w-4 h-4" />
                  <span>Blog</span>
                </Link>
              </div>

              <div className="flex flex-col items-center space-y-4 pt-8">
                <div className="w-12 h-[1px] bg-border" />
                <p className="text-muted/60 text-[10px] uppercase tracking-[0.3em] font-bold">
                  © {new Date().getFullYear()} Keshav Ghai
                </p>
              </div>
            </div>
          </div>
        </footer>
      </ScrollScene>
    </>
  );
}
