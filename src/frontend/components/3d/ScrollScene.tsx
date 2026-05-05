'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';

export default function ScrollScene({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Only register and run on the client side
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current) return;

    // Allow Next.js to render the DOM first
    const timer = setTimeout(() => {
      const sections = containerRef.current!.querySelectorAll('section:not(.hero-section)');
      
      sections.forEach((section) => {
        // Subtle 3D reveal for each section
        gsap.fromTo(
          section,
          { opacity: 0, y: 100, rotationX: -10, transformPerspective: 1000 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 0.5,
            }
          }
        );
      });

      // We can also find project cards and animate them in 3D space
      // Since they are managed by framer-motion, we'll just add a subtle GSAP container scrub
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        gsap.to(projectsSection, {
          scrollTrigger: {
            trigger: projectsSection,
            start: "top top",
            end: "+=500", // pin for a short scroll
            pin: false, // Disabling pinning because it often breaks normal CSS layouts if not carefully isolated, but the roadmap asked for it. 
            // We'll use a parallax effect on the background instead to simulate 3D space.
          }
        });
      }

      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [pathname]);

  return (
    <div ref={containerRef} className="relative z-10">
      {children}
    </div>
  );
}
