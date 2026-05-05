const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listSkills() {
  const skills = await prisma.skill.findMany();
  const info = skills.map(s => ({
    id: s.id,
    name: s.name,
    len: s.name.length,
    codes: Array.from(s.name).map(c => c.charCodeAt(0))
  }));
  console.log(JSON.stringify(info, null, 2));
}

listSkills()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
