"use server";

import { prisma } from "@/lib/prisma";

export async function getFinancialMetrics() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // 1. Ingresos del Mes (Transacciones INCOME del mes)
    const monthlyTransactions = await prisma.transaction.findMany({
      where: {
        type: "INCOME",
        isActive: true,
        date: { gte: firstDayOfMonth }
      }
    });

    const monthlyIncome = monthlyTransactions.reduce((acc, t) => acc + Number(t.amount), 0);

    // 2. Ingresos del Día (Transacciones INCOME de hoy)
    const dailyIncome = monthlyTransactions
      .filter(t => new Date(t.date).getTime() >= today.getTime())
      .reduce((acc, t) => acc + Number(t.amount), 0);

    // 3. Cuentas por Cobrar (Deuda Total de todos los presupuestos activos no pagados)
    const activeBudgets = await prisma.budget.findMany({
      where: {
        isActive: true,
        status: { not: "PAID" }
      }
    });

    const accountsReceivable = activeBudgets.reduce((acc, b) => acc + Math.max(0, b.total - b.paidAmount), 0);

    // 4. Ingresos por Método de Pago (basado en los Payments de este mes)
    const monthlyPayments = await prisma.payment.findMany({
      where: {
        isActive: true,
        date: { gte: firstDayOfMonth }
      }
    });

    const incomeByMethod = monthlyPayments.reduce((acc: any, p) => {
      acc[p.method] = (acc[p.method] || 0) + p.amount;
      return acc;
    }, {});

    return {
      success: true,
      data: {
        monthlyIncome,
        dailyIncome,
        accountsReceivable,
        incomeByMethod
      }
    };
  } catch (error) {
    console.error("Error fetching financial metrics:", error);
    return { success: false, error: "Error obteniendo métricas." };
  }
}

export async function getRecentTransactions() {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { isActive: true },
      orderBy: { date: "desc" },
      take: 10,
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } }
      }
    });

    const formattedTransactions = transactions.map(tx => ({
      ...tx,
      amount: Number(tx.amount)
    }));

    return { success: true, data: formattedTransactions };
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    return { success: false, error: "Error obteniendo transacciones." };
  }
}
