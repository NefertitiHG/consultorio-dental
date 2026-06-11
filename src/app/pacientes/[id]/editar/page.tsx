import { getPatientById } from "@/features/pacientes/actions";
import { PatientForm } from "@/features/pacientes/components/PatientForm";
import { notFound } from "next/navigation";

export default async function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const result = await getPatientById(resolvedParams.id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6 w-full mx-auto">
      <PatientForm patient={result.data} />
    </div>
  );
}
