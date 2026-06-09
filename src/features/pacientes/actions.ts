"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getPatients() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: patients };
  } catch (error) {
    console.error("Error fetching patients:", error);
    return { success: false, error: "No se pudieron cargar los pacientes." };
  }
}

export async function getPatientById(id: string) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
    });
    return { success: true, data: patient };
  } catch (error) {
    console.error("Error fetching patient:", error);
    return { success: false, error: "No se encontró el paciente." };
  }
}

export async function createPatient(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const dni = formData.get("dni") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const allergies = formData.get("allergies") as string;
    const medicalHistory = formData.get("medicalHistory") as string;

    const newPatient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        dni,
        phone,
        email,
        allergies,
        medicalHistory,
      },
    });

    revalidatePath("/pacientes");
    return { success: true, data: newPatient };
  } catch (error) {
    console.error("Error creating patient:", error);
    return { success: false, error: "Error al registrar el paciente. Verifique el DNI." };
  }
}
