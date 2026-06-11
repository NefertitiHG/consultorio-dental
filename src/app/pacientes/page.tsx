import { getPatients } from "@/features/pacientes/actions";
import Link from "next/link";
import { Plus, Home } from "lucide-react";
import { PatientListClient } from "@/features/pacientes/components/PatientListClient";

export const dynamic = "force-dynamic";

export default async function PacientesPage() {
  const result = await getPatients();
  const pacientes = (result.success && result.data) ? result.data : [];

  return (
    <div className="p-6 md:p-10">
      <div className="mb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground bg-secondary px-4 py-2 rounded-md shadow-sm border border-border transition-colors text-sm font-semibold"
        >
          <Home size={18} /> Volver al Inicio
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gold">Pacientes</h1>
          <p className="text-muted-foreground mt-1">
            Gestión e historial clínico de pacientes
          </p>
        </div>
        
        <Link 
          href="/pacientes/nuevo" 
          className="flex items-center gap-2 bg-gold text-primary-foreground px-4 py-2 rounded-md font-semibold hover:bg-accent transition-colors w-full md:w-auto justify-center"
        >
          <Plus size={20} />
          Nuevo Paciente
        </Link>
      </div>

      <PatientListClient initialPatients={pacientes} />
    </div>
  );
}
