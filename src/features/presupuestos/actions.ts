"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBudget(patientId: string, items: Array<{
  treatmentId: string;
  price: number;
  toothNumber?: number;
  toothFace?: string;
}>, notes?: string) {
  try {
    const total = items.reduce((acc, item) => acc + item.price, 0);

    const budget = await prisma.budget.create({
      data: {
        patientId,
        total,
        paidAmount: 0,
        status: "PENDING",
        notes,
        items: {
          create: items.map(item => ({
            treatmentId: item.treatmentId,
            price: item.price,
            toothNumber: item.toothNumber,
            toothFace: item.toothFace
          }))
        }
      }
    });

    revalidatePath(`/pacientes/${patientId}`);
    return { success: true, data: budget };
  } catch (error) {
    console.error("Error creating budget:", error);
    return { success: false, error: "Error al crear el presupuesto." };
  }
}

export async function getBudgetsByPatient(patientId: string) {
  try {
    const budgets = await prisma.budget.findMany({
      where: { patientId, isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          where: { isActive: true },
          include: { treatment: true }
        },
        payments: {
          where: { isActive: true },
          orderBy: { date: 'desc' }
        }
      }
    });
    return { success: true, data: budgets };
  } catch (error) {
    return { success: false, error: "Error al obtener presupuestos." };
  }
}

export async function getBudgetById(budgetId: string) {
  try {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId, isActive: true },
      include: {
        patient: true,
        items: {
          where: { isActive: true },
          include: { treatment: true }
        },
        payments: {
          where: { isActive: true },
          orderBy: { date: 'desc' }
        }
      }
    });
    if (!budget) return { success: false, error: "Presupuesto no encontrado" };
    return { success: true, data: budget };
  } catch (error) {
    return { success: false, error: "Error al obtener el presupuesto." };
  }
}

export async function getPaymentById(paymentId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId, isActive: true },
      include: {
        budget: {
          include: {
            patient: true,
            items: { include: { treatment: true } }
          }
        }
      }
    });
    if (!payment) return { success: false, error: "Pago no encontrado" };
    return { success: true, data: payment };
  } catch (error) {
    return { success: false, error: "Error al obtener el pago." };
  }
}

export async function generateBudgetPreview(teethState: any[]) {
  try {
    let total = 0;
    const items: any[] = [];
    
    // We fetch a couple of basic treatments to map from odontogram states to actual prices
    const treatments = await prisma.treatment.findMany({
      where: { isActive: true }
    });
    
    // Simple mapping heuristics based on Odontogram states
    teethState.forEach(tooth => {
      Object.entries(tooth.faces).forEach(([face, condition]) => {
        if (condition !== "SANO" && condition !== "AUSENTE") {
          // Find matching treatment by name roughly
          const matchedTreatment = treatments.find(t => 
            t.name.toUpperCase().includes((condition as string).toUpperCase())
          );
          
          if (matchedTreatment) {
            items.push({
              tooth: tooth.id,
              face: face === "center" ? "Centro" : face === "root" ? "Raíz" : face,
              treatment: matchedTreatment.name,
              price: matchedTreatment.defaultPrice
            });
            total += matchedTreatment.defaultPrice;
          } else {
            // Fallback generic pricing if treatment not in catalog
            let mockPrice = 50;
            if (condition === "ENDODONCIA") mockPrice = 300;
            if (condition === "IMPLANTE") mockPrice = 1500;
            if (condition === "CORONA") mockPrice = 500;
            if (condition === "EXTRACCION") mockPrice = 100;
            if (condition === "RESINA") mockPrice = 80;
            
            items.push({
              tooth: tooth.id,
              face: face === "center" ? "Centro" : face === "root" ? "Raíz" : face,
              treatment: condition as string,
              price: mockPrice
            });
            total += mockPrice;
          }
        }
      });
    });
    
    return { success: true, data: { items, total } };
  } catch (error) {
    console.error("Error generating budget preview", error);
    return { success: false, error: "Error calculando presupuesto." };
  }
}

export async function addPayment(budgetId: string, patientId: string, amount: number, method: string) {
  try {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId }
    });

    if (!budget) return { success: false, error: "Presupuesto no encontrado" };

    // 1. Crear el Transaction Financiero
    const transaction = await prisma.transaction.create({
      data: {
        type: "INCOME",
        amount: amount,
        description: `Amortización de Presupuesto - Paciente ${patientId.substring(0, 4)}...`,
        patientId: patientId,
      }
    });

    // 2. Registrar el Payment vinculado al Budget
    await prisma.payment.create({
      data: {
        budgetId,
        amount,
        method,
        transactionId: transaction.id
      }
    });

    // 3. Actualizar monto pagado en el Budget y verificar estado
    const newPaidAmount = budget.paidAmount + amount;
    const isPaid = newPaidAmount >= budget.total;

    await prisma.budget.update({
      where: { id: budgetId },
      data: {
        paidAmount: newPaidAmount,
        status: isPaid ? "PAID" : "PARTIAL"
      }
    });

    revalidatePath(`/pacientes/${patientId}`);
    return { success: true };
  } catch (error) {
    console.error("Error amortizando:", error);
    return { success: false, error: "Error al registrar el pago." };
  }
}
