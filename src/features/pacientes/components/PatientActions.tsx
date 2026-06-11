"use client";

import { Edit, Trash2, FileText, FileSignature } from "lucide-react";
import { softDeletePatient } from "@/features/pacientes/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export function PatientActions({ patientId }: { patientId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const Swal = (await import('sweetalert2')).default;
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Toda su historia clínica se ocultará (puedes restaurarlo desde la papelera).",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar paciente',
      cancelButtonText: 'Cancelar',
      background: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
    });

    if (result.isConfirmed) {
      setIsDeleting(true);
      const deleteResult = await softDeletePatient(patientId);
      if (deleteResult.success) {
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El paciente ha sido movido a la papelera.',
          icon: 'success',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
        });
        router.push("/pacientes");
      } else {
        Swal.fire({
          title: 'Error',
          text: deleteResult.error || 'Hubo un problema al eliminar.',
          icon: 'error',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
        });
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Link 
        href={`/pacientes/${patientId}/receta`}
        target="_blank"
        className="flex items-center gap-2 border border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-md transition-colors text-blue-500"
      >
        <FileText size={18} />
        <span className="hidden sm:inline">Receta</span>
      </Link>
      
      <Link 
        href={`/pacientes/${patientId}/consentimiento`}
        target="_blank"
        className="flex items-center gap-2 border border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 px-4 py-2 rounded-md transition-colors text-purple-500"
      >
        <FileSignature size={18} />
        <span className="hidden sm:inline">Consentimiento</span>
      </Link>

      <Link 
        href={`/pacientes/${patientId}/editar`}
        className="flex items-center gap-2 border border-border bg-secondary hover:border-gold px-4 py-2 rounded-md transition-colors text-foreground"
      >
        <Edit size={18} />
        <span className="hidden sm:inline">Editar</span>
      </Link>

      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center gap-2 border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-md transition-colors text-red-500"
      >
        <Trash2 size={18} />
        <span className="hidden sm:inline">{isDeleting ? "Eliminando..." : "Eliminar"}</span>
      </button>
    </div>
  );
}
