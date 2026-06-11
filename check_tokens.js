const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const accounts = await prisma.account.findMany({
    where: { provider: 'google' }
  });
  console.log("Accounts found:", accounts.length);
  accounts.forEach(acc => {
    console.log(`User ID: ${acc.userId}`);
    console.log(`Has access_token: ${!!acc.access_token}`);
    console.log(`Has refresh_token: ${!!acc.refresh_token}`);
    console.log(`Expires At: ${acc.expires_at}`);
  });
}
check();
