import { getInventory } from "@/features/inventario/actions";
import { InventoryClient } from "@/features/inventario/components/InventoryClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function InventarioPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // Verificar permisos (solo ADMIN o SUPERADMIN deberían gestionar inventario, o también DOCTOR, asumimos DOCTOR/SUPERADMIN tienen acceso)
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user?.email || "" }
  });
  
  if (dbUser?.role === "ASSISTANT") {
    // Si asistente no puede, redirigimos
    // Depende de la regla de negocio. Por ahora dejemos entrar a todos pero la UI podría bloquear.
  }

  const result = await getInventory();
  const inventoryItems = result.success && result.data ? result.data : [];

  return (
    <div className="p-6 md:p-10 w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gold">Control de Inventario</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona medicamentos, insumos, herramientas y alertas de bajo stock.
        </p>
      </div>

      <InventoryClient initialItems={inventoryItems} />
    </div>
  );
}
