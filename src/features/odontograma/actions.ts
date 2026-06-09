"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveOdontogram(patientId: string, data: any) {
  try {
    const record = await prisma.odontogram.create({
      data: {
        patientId,
        data, // JSON con el estado de las 32 piezas
      },
    });

    revalidatePath(`/pacientes/${patientId}`);
    return { success: true, data: record };
  } catch (error) {
    console.error("Error saving odontogram:", error);
    return { success: false, error: "No se pudo guardar el odontograma." };
  }
}

export async function getLatestOdontogram(patientId: string) {
  try {
    const record = await prisma.odontogram.findFirst({
      where: { patientId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: record };
  } catch (error) {
    console.error("Error fetching odontogram:", error);
    return { success: false, error: "No se pudo cargar el historial del odontograma." };
  }
}
