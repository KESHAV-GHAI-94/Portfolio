const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDuplicateSkills() {
  const skills = await prisma.skill.findMany();
  const seen = new Set();
  const toDelete = [];

  for (const skill of skills) {
    if (seen.has(skill.name)) {
      toDelete.push(skill.id);
    } else {
      seen.add(skill.name);
    }
  }

  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} duplicate skills...`);
    await prisma.skill.deleteMany({
      where: {
        id: { in: toDelete }
      }
    });
    console.log('Done.');
  } else {
    console.log('No duplicates found.');
  }
}

cleanDuplicateSkills()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
