import { getPatientById } from "@/features/pacientes/actions";
import { getTreatments } from "@/features/tratamientos/actions";
import { BudgetBuilder } from "@/features/presupuestos/components/BudgetBuilder";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NuevoPresupuestoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const patientId = resolvedParams.id;
  
  const [patientResult, treatmentsResult] = await Promise.all([
    getPatientById(patientId),
    getTreatments()
  ]);

  if (!patientResult.success || !patientResult.data) {
    notFound();
  }

  const patient = patientResult.data;
  const treatments = treatmentsResult.success ? treatmentsResult.data : [];

  return (
    <BudgetBuilder 
      patientId={patient.id} 
      patientName={`${patient.firstName} ${patient.lastName}`} 
      treatments={treatments as any} 
    />
  );
}
