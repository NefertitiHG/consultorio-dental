"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getPatients() {
  try {
    const patients = await prisma.patient.findMany({
      where: { isActive: true },
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
      where: { id, isActive: true },
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

// Eliminación Lógica (Ocultar Paciente y todo lo relacionado)
export async function softDeletePatient(id: string) {
  try {
    await prisma.patient.update({
      where: { id },
      data: { isActive: false }
    });
    revalidatePath("/pacientes");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar el paciente." };
  }
}

export async function updatePatient(id: string, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const dni = formData.get("dni") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const allergies = formData.get("allergies") as string;
    const medicalHistory = formData.get("medicalHistory") as string;

    const updatedPatient = await prisma.patient.update({
      where: { id },
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
    revalidatePath(`/pacientes/${id}`);
    return { success: true, data: updatedPatient };
  } catch (error) {
    console.error("Error updating patient:", error);
    return { success: false, error: "Error al actualizar el paciente. Verifique el DNI." };
  }
}

// --- EVOLUTIONS (HISTORIA CLÍNICA) ---

export async function getEvolutions(patientId: string) {
  try {
    const evolutions = await prisma.clinicalEvolution.findMany({
      where: { patientId, isActive: true },
      orderBy: { date: "desc" },
      include: {
        doctor: { select: { name: true } },
        materials: {
          include: {
            inventoryItem: { select: { name: true, unit: true } }
          }
        }
      }
    });
    return { success: true, data: evolutions };
  } catch (error) {
    return { success: false, error: "Error al cargar las evoluciones." };
  }
}

import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary (se asume que las variables de entorno están cargadas)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

  export async function createEvolution(formData: FormData) {
  try {
    const patientId = formData.get("patientId") as string;
    const userId = formData.get("userId") as string;
    const treatment = formData.get("treatment") as string;
    const notes = formData.get("notes") as string;
    const materialsStr = formData.get("materials") as string;
    const materials = materialsStr ? JSON.parse(materialsStr) : [];
    const file = formData.get("file") as File | null;

    let attachments = [];

    // Si hay un archivo adjunto, subirlo a Cloudinary
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'consultorio_evoluciones' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      }) as any;

      attachments.push({
        url: uploadResult.secure_url,
        type: file.type,
        name: file.name
      });
    }

    const evolution = await prisma.$transaction(async (tx) => {
      const ev = await tx.clinicalEvolution.create({
        data: {
          patientId,
          userId,
          treatment,
          notes,
          attachments: attachments.length > 0 ? attachments : undefined,
          materials: {
            create: materials.map((m: any) => ({
              inventoryItemId: m.id,
              quantity: m.quantity
            }))
          }
        }
      });

      // Deducir stock
      for (const m of materials) {
        await tx.inventoryItem.update({
          where: { id: m.id },
          data: { stock: { decrement: m.quantity } }
        });
      }

      return ev;
    });

    revalidatePath(`/pacientes/${patientId}`);
    return { success: true, data: evolution };
  } catch (error) {
    console.error("Error creando evolución:", error);
    return { success: false, error: "Error al crear la evolución." };
  }
}

export async function updateEvolution(id: string, formData: FormData) {
  try {
    const treatment = formData.get("treatment") as string;
    const notes = formData.get("notes") as string;
    const patientId = formData.get("patientId") as string;

    const evolution = await prisma.clinicalEvolution.update({
      where: { id },
      data: {
        treatment,
        notes,
      }
    });

    revalidatePath(`/pacientes/${patientId}`);
    return { success: true, data: evolution };
  } catch (error) {
    return { success: false, error: "Error al actualizar la evolución." };
  }
}

export async function softDeleteEvolution(id: string, patientId: string) {
  try {
    await prisma.$transaction(async (tx) => {
      const ev = await tx.clinicalEvolution.findUnique({
        where: { id },
        include: { materials: true }
      });
      
      if (ev && ev.isActive) {
        await tx.clinicalEvolution.update({
          where: { id },
          data: { isActive: false }
        });
        
        // Retornar stock
        for (const m of ev.materials) {
          await tx.inventoryItem.update({
            where: { id: m.inventoryItemId },
            data: { stock: { increment: m.quantity } }
          });
        }
      }
    });
    revalidatePath(`/pacientes/${patientId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar la evolución." };
  }
}
