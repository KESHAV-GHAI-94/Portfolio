const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const projects = [
    {
      title: '3D UI Portfolio',
      description: 'A modern portfolio with interactive 3D elements using Three.js and React Fiber.',
      tags: ['React', 'Three.js', 'GSAP'],
      featured: true,
    },
    {
      title: 'AI Image Generator',
      description: 'Full-stack application integrating DALL-E and Midjourney APIs for image generation.',
      tags: ['Next.js', 'OpenAI', 'Tailwind'],
      featured: true,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({
      data: project,
    });
  }

  const skills = [
    { name: 'React', icon: 'react', proficiency: 95, category: 'Frontend' },
    { name: 'Node.js', icon: 'node', proficiency: 90, category: 'Backend' },
    { name: 'PostgreSQL', icon: 'postgres', proficiency: 85, category: 'Database' },
  ];

  for (const skill of skills) {
    await prisma.skill.create({
      data: skill,
    });
  }

  console.log('✅ Projects and Skills seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
