"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAppointments(startDate: Date, endDate: Date, userId?: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        isActive: true,
        patient: { is: { isActive: true } }, // Sintaxis estricta de Prisma para relaciones
        ...(userId ? { userId } : {}) // Filtrar por doctor si se proporciona el ID
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

import { google } from "googleapis";

export async function createAppointment(data: { patientId: string; date: Date; notes?: string, userId: string }) {
  try {
    const appointment = await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        userId: data.userId,
        date: data.date,
        notes: data.notes || "",
        status: "SCHEDULED",
      },
      include: {
        patient: true
      }
    });

    // Sincronización con Google Calendar
    try {
      const account = await prisma.account.findFirst({
        where: { userId: data.userId, provider: "google" }
      });

      if (account && (account.refresh_token || account.access_token)) {
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET
        );
        
        oauth2Client.setCredentials({
          access_token: account.access_token,
          refresh_token: account.refresh_token,
        });

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        
        const startTime = data.date;
        const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 min por defecto
        
        const event = await calendar.events.insert({
          calendarId: "primary",
          requestBody: {
            summary: `🦷 Cita Dental: ${appointment.patient.firstName} ${appointment.patient.lastName}`,
            description: data.notes || "Cita programada desde el ERP",
            start: { dateTime: startTime.toISOString() },
            end: { dateTime: endTime.toISOString() },
            colorId: "5", // Color amarillo en Google Calendar
          }
        });

        if (event.data.id) {
          await prisma.appointment.update({
            where: { id: appointment.id },
            data: { googleEventId: event.data.id }
          });
        }
      }
    } catch (gcalError) {
      console.error("Error sincronizando con Google Calendar:", gcalError);
      // No bloqueamos la creación de la cita si falla Google
    }

    revalidatePath("/citas");
    return { success: true, data: appointment };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { success: false, error: "No se pudo agendar la cita." };
  }
}

export async function updateAppointmentStatus(id: string, status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW") {
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

export async function getAppointmentById(id: string) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id, isActive: true },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
    return { success: true, data: appointment };
  } catch (error) {
    return { success: false, error: "Error al cargar la cita." };
  }
}

export async function updateAppointment(
  id: string, 
  data: { date: Date; notes?: string; status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" }
) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        date: data.date,
        notes: data.notes || "",
        status: data.status,
      },
    });

    revalidatePath("/citas");
    return { success: true, data: appointment };
  } catch (error) {
    console.error("Error updating appointment details:", error);
    return { success: false, error: "No se pudo actualizar la cita." };
  }
}

export async function softDeleteAppointment(id: string) {
  try {
    await prisma.appointment.update({
      where: { id },
      data: { isActive: false }
    });
    revalidatePath("/citas");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar la cita." };
  }
}
