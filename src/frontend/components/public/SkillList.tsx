'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const SkillGlobe = dynamic(() => import('@/frontend/components/3d/SkillGlobe'), { ssr: false });

type Skill = {
  id: number;
  name: string;
  icon: string;
  proficiency: number;
  category: string;
};

export default function SkillList({ skills }: { skills: Skill[] }) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categories = Array.from(new Set(skills.map(s => s.category)));

  if (skills.length === 0) {
    return (
      <div className="text-sm text-muted py-12 border border-border rounded-xl px-6">
        No skills found. Please add some via the Admin Dashboard.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center">
      {/* Skill Categories Grid */}
      <div className="w-full lg:w-[45%]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category, idx) => (
            <motion.div 
              key={category} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-5 text-muted/60">{category}</h3>
              <div className="flex flex-wrap gap-3">
                {skills.filter(s => s.category === category).map((skill, index) => (
                  <motion.div 
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative group"
                  >
                    <div className="w-12 h-12 overflow-hidden bg-foreground/5 rounded-xl border border-border group-hover:border-muted/30 transition-all cursor-default flex items-center justify-center">
                      {skill.icon.startsWith('http') ? (
                        <img 
                          src={skill.icon} 
                          alt={skill.name} 
                          className="w-full h-full object-cover p-2" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-xl flex items-center justify-center">💻</span>';
                          }}
                        />
                      ) : (
                        <span className="text-xl flex items-center justify-center">{skill.icon}</span>
                      )}
                    </div>
                    
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-[9px] font-black rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 uppercase tracking-tighter shadow-lg shadow-black/10">
                      {skill.name}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* 3D Globe Section */}
      {!isMobile && (
        <div className="hidden lg:flex lg:w-[55%] h-[550px] items-center justify-center relative">
          <SkillGlobe skills={skills} />
        </div>
      )}
    </div>
  );
}
