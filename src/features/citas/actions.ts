"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAppointments(startDate: Date, endDate: Date) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, phone: true },
        },
      },
      orderBy: { date: "asc" },
    });

    return { success: true, data: appointments };
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return { success: false, error: "No se pudieron cargar las citas." };
  }
}

export async function createAppointment(data: { patientId: string; date: Date; notes?: string }) {
  try {
    const appointment = await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        date: data.date,
        notes: data.notes || "",
        status: "SCHEDULED",
      },
    });

    revalidatePath("/citas");
    return { success: true, data: appointment };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { success: false, error: "No se pudo agendar la cita." };
  }
}

export async function updateAppointmentStatus(id: string, status: "SCHEDULED" | "COMPLETED" | "CANCELLED") {
  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/citas");
    return { success: true, data: appointment };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return { success: false, error: "No se pudo actualizar la cita." };
  }
}
