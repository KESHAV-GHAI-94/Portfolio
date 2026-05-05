const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function aggressiveClean() {
  const skills = await prisma.skill.findMany();
  const nameToKeep = new Map();
  const idsToDelete = [];
  
  for (const skill of skills) {
    const cleanName = skill.name.trim();
    if (!nameToKeep.has(cleanName)) {
      nameToKeep.set(cleanName, skill.id);
    } else {
      idsToDelete.push(skill.id);
    }
  }

  if (idsToDelete.length > 0) {
    console.log(`Deleting IDs: ${idsToDelete.join(', ')}`);
    await prisma.skill.deleteMany({
      where: {
        id: { in: idsToDelete }
      }
    });
    console.log('Done.');
  } else {
    console.log('No duplicates found.');
  }
}

aggressiveClean()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
