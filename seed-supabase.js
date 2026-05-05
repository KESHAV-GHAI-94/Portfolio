const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding Supabase database...');

  // 1. Create Admin User
  const email = 'keshavghai94@gmail.com';
  const password = 'Keshav@94';
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: { email, password: hashedPassword },
  });
  console.log('Admin user created/updated.');

  // 2. Create Site Settings
  const settings = [
    { key: 'name', value: 'Keshav Ghai' },
    { key: 'site_title', value: 'Keshav Ghai | Full-Stack Developer & AI Specialist' },
    { key: 'site_description', value: 'Professional portfolio of Keshav Ghai, a Full-Stack Engineer specializing in modern web technologies and AI integration.' },
    { key: 'email_address', value: 'keshavghai94@gmail.com' },
    { key: 'github_link', value: 'https://github.com/keshavghai' },
    { key: 'linkedin_link', value: 'https://linkedin.com/in/keshavghai' },
    { key: 'twitter_link', value: 'https://twitter.com/keshavghai' },
    { key: 'logo_text', value: 'KG.' },
    { key: 'hero_title', value: 'Building Digital Experiences with Precision' },
    { key: 'hero_subtitle', value: 'Full-Stack Developer focused on performance, accessibility, and clean code.' },
  ];

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value },
    });
  }
  console.log('Site settings seeded.');

  // 3. Create initial Skills
  const skills = [
    { name: 'React', icon: 'https://skillicons.dev/icons?i=react', proficiency: 100, category: 'Frontend', sortOrder: 1 },
    { name: 'Next.js', icon: 'https://skillicons.dev/icons?i=nextjs', proficiency: 100, category: 'Frontend', sortOrder: 2 },
    { name: 'Node.js', icon: 'https://skillicons.dev/icons?i=nodejs', proficiency: 100, category: 'Backend', sortOrder: 3 },
    { name: 'PostgreSQL', icon: 'https://skillicons.dev/icons?i=postgres', proficiency: 100, category: 'Databases', sortOrder: 4 },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: { ...skill },
      create: { ...skill },
    });
  }
  console.log('Initial skills seeded.');

  console.log('Seeding completed successfully.');
}

seed()
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
