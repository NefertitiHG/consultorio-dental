import { getPatients } from "@/features/pacientes/actions";
import Link from "next/link";
import { Plus, Search, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PacientesPage() {
  const result = await getPatients();
  const pacientes = result.success ? result.data : [];

  return (
    <div className="p-6 md:p-10">
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

      {/* Buscador Visual (solo UI base) */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-muted-foreground" />
        </div>
        <input 
          type="text" 
          placeholder="Buscar por nombre o DNI..." 
          className="block w-full pl-10 pr-3 py-3 border border-border rounded-md bg-secondary text-foreground focus:ring-gold focus:border-gold outline-none transition-all"
        />
      </div>

      <div className="grid gap-4">
        {pacientes?.length === 0 ? (
          <div className="text-center py-16 bg-secondary/50 rounded-lg border border-border border-dashed">
            <User size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg text-foreground">No hay pacientes registrados.</p>
            <p className="text-sm text-muted-foreground">Comienza agregando el primero.</p>
          </div>
        ) : (
          pacientes?.map((paciente) => (
            <Link 
              key={paciente.id} 
              href={`/pacientes/${paciente.id}`}
              className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border hover:border-gold transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-gold font-bold text-lg">
                  {paciente.firstName.charAt(0)}{paciente.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{paciente.firstName} {paciente.lastName}</h3>
                  <p className="text-sm text-muted-foreground">DNI: {paciente.dni} | {paciente.phone || "Sin teléfono"}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
