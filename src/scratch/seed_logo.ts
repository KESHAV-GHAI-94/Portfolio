
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const existingLogo = await prisma.siteSettings.findUnique({
    where: { key: 'logo_text' }
  })

  if (!existingLogo) {
    await prisma.siteSettings.create({
      data: {
        key: 'logo_text',
        value: 'KG.'
      }
    })
    console.log('Created logo_text setting with default value "KG."')
  } else {
    console.log('logo_text setting already exists.')
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
