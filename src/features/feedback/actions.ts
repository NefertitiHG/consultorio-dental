"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSuggestion(userId: string, message: string) {
  try {
    const suggestion = await prisma.suggestion.create({
      data: {
        userId,
        message,
        status: "PENDING",
      },
    });
    
    // Si queremos que se actualice la bandeja de entrada del admin
    revalidatePath("/buzon");
    
    return { success: true, data: suggestion };
  } catch (error: any) {
    console.error("Error creating suggestion:", error);
    return { success: false, error: "No se pudo enviar el mensaje. Intente nuevamente." };
  }
}

export async function getSuggestions() {
  try {
    const suggestions = await prisma.suggestion.findMany({
      include: {
        user: { select: { name: true, email: true, role: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: suggestions };
  } catch (error) {
    return { success: false, error: "Error al obtener las sugerencias." };
  }
}

export async function resolveSuggestion(id: string, response: string) {
  try {
    const suggestion = await prisma.suggestion.update({
      where: { id },
      data: {
        response,
        status: "RESOLVED"
      }
    });
    
    revalidatePath("/buzon");
    return { success: true, data: suggestion };
  } catch (error) {
    return { success: false, error: "Error al responder la sugerencia." };
  }
}
