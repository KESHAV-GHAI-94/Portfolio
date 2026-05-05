const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function updateAdmin() {
  const email = 'keshavghai94@gmail.com';
  const password = 'Keshav@94';
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Try to find the existing admin
  const existingAdmin = await prisma.adminUser.findFirst();
  
  if (existingAdmin) {
    console.log(`Updating existing admin (ID: ${existingAdmin.id}) to ${email}`);
    await prisma.adminUser.update({
      where: { id: existingAdmin.id },
      data: {
        email,
        password: hashedPassword
      }
    });
  } else {
    console.log(`Creating new admin: ${email}`);
    await prisma.adminUser.create({
      data: {
        email,
        password: hashedPassword
      }
    });
  }
  
  console.log('Admin credentials updated successfully.');
}

updateAdmin()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
