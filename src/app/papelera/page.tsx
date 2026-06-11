import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getDeletedPatients, getDeletedAppointments } from "@/features/papelera/actions";
import { PapeleraList } from "@/features/papelera/components/PapeleraList";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PapeleraPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (role !== "SUPERADMIN" && role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [patientsResult, appointmentsResult] = await Promise.all([
    getDeletedPatients(),
    getDeletedAppointments()
  ]);

  const deletedPatients = patientsResult.success && patientsResult.data ? patientsResult.data : [];
  const deletedAppointments = appointmentsResult.success && appointmentsResult.data ? appointmentsResult.data : [];

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
      <header className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Papelera de Reciclaje</h1>
          <p className="text-muted-foreground mt-1">Zona de Seguridad (Exclusiva para Super Administradores)</p>
        </div>
      </header>

      <PapeleraList 
        deletedPatients={deletedPatients} 
        deletedAppointments={deletedAppointments} 
      />
    </div>
  );
}
