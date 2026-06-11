"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDeletedPatients() {
  try {
    const patients = await prisma.patient.findMany({
      where: { isActive: false },
      orderBy: { updatedAt: "desc" },
    });
    return { success: true, data: patients };
  } catch (error) {
    return { success: false, error: "Error al obtener pacientes eliminados." };
  }
}

export async function restorePatient(id: string) {
  try {
    await prisma.patient.update({
      where: { id },
      data: { isActive: true }
    });
    revalidatePath("/papelera");
    revalidatePath("/pacientes");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al restaurar paciente." };
  }
}

export async function getDeletedAppointments() {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { isActive: false },
      include: { patient: { select: { firstName: true, lastName: true } } },
      orderBy: { updatedAt: "desc" },
    });
    return { success: true, data: appointments };
  } catch (error) {
    return { success: false, error: "Error al obtener citas eliminadas." };
  }
}

export async function restoreAppointment(id: string) {
  try {
    await prisma.appointment.update({
      where: { id },
      data: { isActive: true }
    });
    revalidatePath("/papelera");
    revalidatePath("/citas");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al restaurar cita." };
  }
}
