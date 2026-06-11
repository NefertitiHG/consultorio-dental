"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTreatments() {
  try {
    const treatments = await prisma.treatment.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });
    return { success: true, data: treatments };
  } catch (error) {
    return { success: false, error: "Error al cargar el catálogo de tratamientos." };
  }
}

export async function createTreatment(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const defaultPriceStr = formData.get("defaultPrice") as string;
    const scope = formData.get("scope") as string;

    const defaultPrice = parseFloat(defaultPriceStr);

    if (isNaN(defaultPrice) || defaultPrice < 0) {
      return { success: false, error: "El precio debe ser un número válido mayor o igual a 0." };
    }

    const treatment = await prisma.treatment.create({
      data: {
        name,
        category,
        defaultPrice,
        scope, // e.g. "GLOBAL", "TOOTH", "FACE"
      }
    });

    revalidatePath("/tratamientos");
    return { success: true, data: treatment };
  } catch (error) {
    return { success: false, error: "Error al crear el tratamiento." };
  }
}

export async function updateTreatment(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const defaultPriceStr = formData.get("defaultPrice") as string;
    const scope = formData.get("scope") as string;

    const defaultPrice = parseFloat(defaultPriceStr);

    if (isNaN(defaultPrice) || defaultPrice < 0) {
      return { success: false, error: "El precio debe ser un número válido mayor o igual a 0." };
    }

    const treatment = await prisma.treatment.update({
      where: { id },
      data: {
        name,
        category,
        defaultPrice,
        scope,
      }
    });

    revalidatePath("/tratamientos");
    return { success: true, data: treatment };
  } catch (error) {
    return { success: false, error: "Error al actualizar el tratamiento." };
  }
}

export async function softDeleteTreatment(id: string) {
  try {
    await prisma.treatment.update({
      where: { id },
      data: { isActive: false }
    });
    revalidatePath("/tratamientos");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar el tratamiento." };
  }
}
