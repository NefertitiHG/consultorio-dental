"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getInventory() {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    return { success: true, data: items };
  } catch (error) {
    return { success: false, error: "Error al obtener el inventario." };
  }
}

export async function createInventoryItem(data: { name: string; category: string; unit: string; minStock: number; cost: number; initialStock: number }) {
  try {
    const item = await prisma.inventoryItem.create({
      data: {
        name: data.name,
        category: data.category,
        unit: data.unit,
        minStock: data.minStock,
        cost: data.cost,
        stock: data.initialStock
      }
    });
    revalidatePath("/inventario");
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: "Error al crear el insumo." };
  }
}

export async function adjustStock(id: string, amountToAdd: number) {
  try {
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: {
        stock: { increment: amountToAdd }
      }
    });
    revalidatePath("/inventario");
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: "Error al actualizar el stock." };
  }
}

export async function updateInventoryItem(id: string, data: { name: string; category: string; unit: string; minStock: number; cost: number }) {
  try {
    const item = await prisma.inventoryItem.update({
      where: { id },
      data
    });
    revalidatePath("/inventario");
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: "Error al editar el insumo." };
  }
}

export async function softDeleteInventoryItem(id: string) {
  try {
    await prisma.inventoryItem.update({
      where: { id },
      data: { isActive: false }
    });
    revalidatePath("/inventario");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar el insumo." };
  }
}
