"use server";

import { prisma } from "@/lib/prisma";

// Precios base por defecto (Soles S/) si el catálogo está vacío
const DEFAULT_PRICES = {
  CARIES: 0, 
  RESINA: 80,
  AMALGAMA: 60,
  SELLANTE: 40,
  ENDODONCIA: 350,
  CORONA: 600,
  EXTRACCION: 100,
  AUSENTE: 0,
  BRACKET: 150,
  IMPLANTE: 2000,
  PERNO: 250,
};

export async function generateBudgetPreview(teethState: any[]) {
  try {
    let total = 0;
    const items: any[] = [];

    // Recorrer todos los dientes y sus caras
    for (const tooth of teethState) {
      const faces = tooth.faces;
      const addedToTooth = new Set<string>();

      for (const [face, condition] of Object.entries(faces)) {
        if (condition === "SANO" || condition === "AUSENTE" || condition === "CARIES") continue;

        // Reglas de negocio: Si el diente entero tiene extracción, endodoncia o corona, se cobra 1 vez
        const isGlobal = ["EXTRACCION", "ENDODONCIA", "CORONA"].includes(condition as string);
        
        if (isGlobal) {
          if (!addedToTooth.has(condition as string)) {
            const price = DEFAULT_PRICES[condition as keyof typeof DEFAULT_PRICES] || 0;
            total += price;
            items.push({
              tooth: tooth.id,
              face: "Completo",
              treatment: condition,
              price
            });
            addedToTooth.add(condition as string);
          }
        } else {
          // Cobro por cara (Ej. Resina vestibular)
          const price = DEFAULT_PRICES[condition as keyof typeof DEFAULT_PRICES] || 0;
          total += price;
          items.push({
            tooth: tooth.id,
            face: face.toUpperCase(),
            treatment: condition,
            price
          });
        }
      }
    }

    return { success: true, data: { total, items } };
  } catch (error) {
    console.error("Error generating budget:", error);
    return { success: false, error: "Error al calcular el presupuesto" };
  }
}
