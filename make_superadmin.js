const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log("No users found.");
    return;
  }
  
  // Make the first user a SUPERADMIN
  const updatedUser = await prisma.user.update({
    where: { id: users[0].id },
    data: { role: 'SUPERADMIN' },
  });
  
  console.log(`Successfully updated ${updatedUser.name} to SUPERADMIN.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
