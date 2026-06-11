const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthlyTransactions = await prisma.transaction.findMany({
      where: {
        type: "INCOME",
        isActive: true,
        date: { gte: firstDayOfMonth }
      }
    });

    const monthlyIncome = monthlyTransactions.reduce((acc, t) => acc + Number(t.amount), 0);
    console.log("Monthly income:", monthlyIncome);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
