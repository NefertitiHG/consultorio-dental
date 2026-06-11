"use client";

import { Edit, Trash2 } from "lucide-react";
import { softDeletePatient } from "@/features/pacientes/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export function PatientActions({ patientId }: { patientId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("¿Estás seguro que deseas eliminar este paciente? Toda su historia clínica se ocultará (puedes restaurarlo desde la papelera).")) {
      setIsDeleting(true);
      const result = await softDeletePatient(patientId);
      if (result.success) {
        router.push("/pacientes");
      } else {
        alert(result.error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex gap-3">
      <Link 
        href={`/pacientes/${patientId}/editar`}
        className="flex items-center gap-2 border border-border bg-secondary hover:border-gold px-4 py-2 rounded-md transition-colors text-foreground"
      >
        <Edit size={18} />
        Editar
      </Link>

      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center gap-2 border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-md transition-colors text-red-500"
      >
        <Trash2 size={18} />
        {isDeleting ? "Eliminando..." : "Eliminar"}
      </button>
    </div>
  );
}
