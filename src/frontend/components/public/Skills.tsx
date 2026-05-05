import prisma from "@/backend/db/prisma";
import SkillList from "./SkillList";

export const revalidate = 60; // ISR

export default async function Skills() {
  let skills: any[] = [];
  try {
    skills = await prisma.skill.findMany({
      orderBy: { sortOrder: 'asc' }
    });
  } catch (error) {
    console.error("Database connection failed, using fallback skills");
  }

  if (skills.length === 0) {
    skills = [
      { id: 1, name: 'React', icon: '⚛️', proficiency: 95, category: 'Frontend', sortOrder: 1 },
      { id: 2, name: 'Next.js', icon: '▲', proficiency: 90, category: 'Frontend', sortOrder: 2 },
      { id: 3, name: 'Three.js', icon: '🧊', proficiency: 80, category: 'Frontend', sortOrder: 3 },
      { id: 4, name: 'TypeScript', icon: '📘', proficiency: 90, category: 'Frontend', sortOrder: 4 },
      { id: 5, name: 'Node.js', icon: '🟩', proficiency: 85, category: 'Backend', sortOrder: 5 },
      { id: 6, name: 'PostgreSQL', icon: '🐘', proficiency: 80, category: 'Backend', sortOrder: 6 },
    ];
  }

  return (
    <section id="skills" className="py-40 relative bg-background scroll-mt-24 transition-colors duration-500">
      <div className="section-divider absolute top-0 left-0" />
      <div className="container mx-auto px-8 md:px-12 max-w-6xl relative z-10">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-2 text-gradient inline-block">Skills</h2>
          <p className="text-muted">Technical proficiencies and tools.</p>
        </div>
        
        <SkillList skills={skills} />
      </div>
    </section>
  );
}
