import { getPatientById, getEvolutions } from "@/features/pacientes/actions";
import { getBudgetsByPatient } from "@/features/presupuestos/actions";
import { getLatestOdontogram, saveOdontogram } from "@/features/odontograma/actions";
import { ArrowLeft, Edit, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Odontogram } from "@/features/odontograma/components/Odontogram";
import { EvolutionList } from "@/features/pacientes/components/EvolutionList";
import { BudgetList } from "@/features/presupuestos/components/BudgetList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { PatientActions } from "@/features/pacientes/components/PatientActions";

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  const [result, odontogramResult, evolutionsResult, budgetsResult] = await Promise.all([
    getPatientById(resolvedParams.id),
    getLatestOdontogram(resolvedParams.id),
    getEvolutions(resolvedParams.id),
    getBudgetsByPatient(resolvedParams.id)
  ]);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const patient = result.data;
  const evolutions = evolutionsResult.success && evolutionsResult.data ? (evolutionsResult.data as any) : [];
  const budgets = budgetsResult.success && budgetsResult.data ? (budgetsResult.data as any) : [];
  const initialOdontogramData = odontogramResult.success && odontogramResult.data ? (odontogramResult.data.data as any) : undefined;

  // Server Action wrapper para pasar al cliente
  const handleSaveOdontogram = async (data: any) => {
    "use server";
    await saveOdontogram(resolvedParams.id, data);
  };

  return (
    <div className="p-4 md:p-6 w-full mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/pacientes" 
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-gold"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary border border-gold flex items-center justify-center text-gold font-bold text-2xl">
              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {patient.firstName} {patient.lastName}
              </h1>
              <p className="text-muted-foreground mt-1">DNI: {patient.dni}</p>
            </div>
          </div>
        </div>
        
        <PatientActions patientId={patient.id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna Izquierda: Detalles del Paciente y Presupuestos */}
        <div className="space-y-6">
          <div className="bg-secondary/20 rounded-xl p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Información de Contacto</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone size={18} className="text-gold" />
                <span>{patient.phone || "No registrado"}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail size={18} className="text-gold" />
                <span>{patient.email || "No registrado"}</span>
              </div>
            </div>
          </div>

          <div className="bg-secondary/20 rounded-xl p-6 border border-border">
            <h2 className="text-xl font-bold text-gold mb-4">Antecedentes Médicos</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground block mb-1">Alergias</span>
                <p className="text-foreground">{patient.allergies || "Ninguna"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block mb-1">Enfermedades / Notas médicas</span>
                <p className="text-foreground">{patient.medicalHistory || "Ninguno"}</p>
              </div>
            </div>
          </div>
          
          <BudgetList 
            patientId={patient.id}
            budgets={budgets}
          />
        </div>

        {/* Columna Derecha: Historial y Odontograma */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-background rounded-lg border border-border overflow-hidden shadow-lg">
            <Odontogram 
              patientId={patient.id} 
              initialData={initialOdontogramData}
              onSave={handleSaveOdontogram} 
            />
          </div>

          <EvolutionList 
            patientId={patient.id} 
            evolutions={evolutions} 
            userId={session?.user?.id || ""}
          />
        </div>
      </div>
    </div>
  );
}
