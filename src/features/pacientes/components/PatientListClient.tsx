"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User } from "lucide-react";

export function PatientListClient({ initialPatients }: { initialPatients: any[] }) {
  const [search, setSearch] = useState("");

  const filteredPatients = initialPatients.filter((paciente) => {
    const term = search.toLowerCase();
    const fullName = `${paciente.firstName} ${paciente.lastName}`.toLowerCase();
    const dni = paciente.dni?.toLowerCase() || "";
    return fullName.includes(term) || dni.includes(term);
  });

  return (
    <>
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-muted-foreground" />
        </div>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o DNI..." 
          className="block w-full pl-10 pr-3 py-3 border border-border rounded-md bg-secondary text-foreground focus:ring-gold focus:border-gold outline-none transition-all"
        />
      </div>

      <div className="grid gap-4">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-16 bg-secondary/50 rounded-lg border border-border border-dashed">
            <User size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg text-foreground">No se encontraron pacientes.</p>
            {search === "" && (
              <p className="text-sm text-muted-foreground">Comienza agregando el primero.</p>
            )}
          </div>
        ) : (
          filteredPatients.map((paciente) => (
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
    </>
  );
}
