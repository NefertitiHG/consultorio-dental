"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function inviteUser(email: string, role: any) {
  try {
    // Verificar si ya existe
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Este correo ya está registrado en el sistema." };
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        role,
        name: email.split("@")[0], // Placeholder hasta que inicien sesión
      }
    });

    revalidatePath("/configuracion/personal");
    return { success: true, data: newUser };
  } catch (error) {
    console.error("Error inviting user:", error);
    return { success: false, error: "Error al registrar el usuario." };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/configuracion/personal");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Error al eliminar el usuario." };
  }
}
