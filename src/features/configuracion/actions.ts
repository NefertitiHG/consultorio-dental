"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getLoginLogs(limit = 50) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "SUPERADMIN") {
      return { success: false, error: "No autorizado" };
    }

    const logs = await prisma.loginLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true, role: true } }
      }
    });

    const totalLogs = await prisma.loginLog.count();

    return { success: true, data: { logs, totalLogs } };
  } catch (error) {
    console.error("Error fetching login logs:", error);
    return { success: false, error: "No se pudieron cargar los registros." };
  }
}
