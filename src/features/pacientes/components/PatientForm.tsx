"use client";

import { createPatient, updatePatient } from "@/features/pacientes/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function PatientForm({ patient }: { patient?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!patient;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    let result;
    if (isEditing) {
      result = await updatePatient(patient.id, formData);
    } else {
      result = await createPatient(formData);
    }

    if (result.success) {
      router.push(isEditing ? `/pacientes/${patient.id}` : "/pacientes");
    } else {
      setError(result.error || "Ocurrió un error inesperado.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href={isEditing ? `/pacientes/${patient.id}` : "/pacientes"} 
          className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-gold"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gold">{isEditing ? "Editar Paciente" : "Nuevo Paciente"}</h1>
          <p className="text-muted-foreground mt-1">{isEditing ? "Actualiza los datos de la ficha clínica" : "Registra los datos de la ficha clínica"}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-secondary border border-border rounded-lg p-6 space-y-6">
        
        {/* Datos Personales */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground border-b border-border pb-2">Datos Personales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Nombre(s) *</label>
              <input required name="firstName" defaultValue={patient?.firstName} type="text" className="w-full p-3 bg-background border border-border rounded-md focus:border-gold focus:ring-1 focus:ring-gold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Apellidos *</label>
              <input required name="lastName" defaultValue={patient?.lastName} type="text" className="w-full p-3 bg-background border border-border rounded-md focus:border-gold focus:ring-1 focus:ring-gold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">DNI / Documento *</label>
              <input required name="dni" defaultValue={patient?.dni} type="text" className="w-full p-3 bg-background border border-border rounded-md focus:border-gold focus:ring-1 focus:ring-gold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Teléfono</label>
              <input name="phone" defaultValue={patient?.phone} type="tel" className="w-full p-3 bg-background border border-border rounded-md focus:border-gold focus:ring-1 focus:ring-gold outline-none" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-muted-foreground">Correo Electrónico</label>
              <input name="email" defaultValue={patient?.email} type="email" className="w-full p-3 bg-background border border-border rounded-md focus:border-gold focus:ring-1 focus:ring-gold outline-none" />
            </div>
          </div>
        </div>

        {/* Antecedentes Médicos */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground border-b border-border pb-2">Antecedentes Médicos</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Alergias (Separadas por comas)</label>
              <textarea name="allergies" defaultValue={patient?.allergies} rows={2} className="w-full p-3 bg-background border border-border rounded-md focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none" placeholder="Ej. Penicilina, Látex..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Historial / Enfermedades crónicas</label>
              <textarea name="medicalHistory" defaultValue={patient?.medicalHistory} rows={3} className="w-full p-3 bg-background border border-border rounded-md focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none" placeholder="Ej. Hipertensión, Diabetes..." />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <Link href={isEditing ? `/pacientes/${patient.id}` : "/pacientes"} className="px-6 py-3 border border-border rounded-md text-foreground hover:bg-muted transition-colors font-semibold">
            Cancelar
          </Link>
          <button disabled={loading} type="submit" className="px-6 py-3 bg-gold text-primary-foreground rounded-md hover:bg-accent transition-colors font-semibold flex items-center gap-2">
            <Save size={20} />
            {loading ? "Guardando..." : (isEditing ? "Guardar Cambios" : "Guardar Paciente")}
          </button>
        </div>
      </form>
    </div>
  );
}
