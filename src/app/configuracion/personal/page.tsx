import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserList } from "@/features/usuarios/components/UserList";
import { Navigation } from "@/components/layout/Navigation";

export const dynamic = "force-dynamic";

export default async function PersonalPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({ where: { email: session.user?.email || "" }});
  
  if (dbUser?.role !== "SUPERADMIN" && dbUser?.role !== "ADMIN") {
    redirect("/"); // Solo admin/superadmin pueden ver esto
  }

  const users = await prisma.user.findMany({
    orderBy: { role: "asc" }
  });

  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Personal</h1>
            <p className="text-muted-foreground mt-2">
              Registra los correos autorizados para que tu equipo pueda iniciar sesión en la clínica.
            </p>
          </header>
          
          <UserList initialUsers={users} />
        </div>
      </main>
    </div>
  );
}
