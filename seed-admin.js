const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@portfolio.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@portfolio.com',
      password: hashedPassword,
    },
  });
  
  console.log('✅ Admin user ready!');
  console.log('Email:', admin.email);
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
