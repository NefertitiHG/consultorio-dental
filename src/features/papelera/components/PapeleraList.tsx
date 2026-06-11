"use client";

import { useState } from "react";
import { User, Calendar, RotateCcw } from "lucide-react";
import { restorePatient, restoreAppointment } from "@/features/papelera/actions";

export function PapeleraList({ deletedPatients, deletedAppointments }: { deletedPatients: any[], deletedAppointments: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRestorePatient = async (id: string) => {
    setLoadingId(id);
    await restorePatient(id);
    setLoadingId(null);
  };

  const handleRestoreAppointment = async (id: string) => {
    setLoadingId(id);
    await restoreAppointment(id);
    setLoadingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Pacientes Eliminados */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2">
          <User className="text-muted-foreground" size={20} />
          Pacientes Eliminados
        </h2>
        {deletedPatients.length === 0 ? (
          <p className="text-muted-foreground bg-secondary/50 p-4 rounded-lg border border-border">No hay pacientes en la papelera.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deletedPatients.map((p) => (
              <div key={p.id} className="bg-secondary border border-border p-4 rounded-lg flex justify-between items-center hover:border-gold transition-colors">
                <div>
                  <h3 className="font-semibold text-foreground">{p.firstName} {p.lastName}</h3>
                  <p className="text-sm text-muted-foreground">DNI: {p.dni}</p>
                  <p className="text-xs text-red-400 mt-1">Eliminado: {new Date(p.updatedAt).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => handleRestorePatient(p.id)}
                  disabled={loadingId === p.id}
                  className="flex items-center gap-2 bg-background border border-border hover:border-gold px-3 py-2 rounded text-sm text-foreground transition-colors disabled:opacity-50"
                >
                  <RotateCcw size={16} className="text-gold" />
                  {loadingId === p.id ? "Restaurando..." : "Restaurar"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Citas Eliminadas */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2">
          <Calendar className="text-muted-foreground" size={20} />
          Citas Canceladas/Eliminadas
        </h2>
        {deletedAppointments.length === 0 ? (
          <p className="text-muted-foreground bg-secondary/50 p-4 rounded-lg border border-border">No hay citas en la papelera.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deletedAppointments.map((app) => (
              <div key={app.id} className="bg-secondary border border-border p-4 rounded-lg flex justify-between items-center hover:border-gold transition-colors">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {app.patient?.firstName} {app.patient?.lastName}
                  </h3>
                  <p className="text-sm text-gold font-medium">
                    {new Date(app.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                  <p className="text-xs text-red-400 mt-1">Eliminada: {new Date(app.updatedAt).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => handleRestoreAppointment(app.id)}
                  disabled={loadingId === app.id}
                  className="flex items-center gap-2 bg-background border border-border hover:border-gold px-3 py-2 rounded text-sm text-foreground transition-colors disabled:opacity-50"
                >
                  <RotateCcw size={16} className="text-gold" />
                  {loadingId === app.id ? "Restaurando..." : "Restaurar"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
