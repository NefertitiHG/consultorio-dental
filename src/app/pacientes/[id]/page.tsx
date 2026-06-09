import { getPatientById } from "@/features/pacientes/actions";
import { getLatestOdontogram, saveOdontogram } from "@/features/odontograma/actions";
import { ArrowLeft, Edit, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Odontogram } from "@/features/odontograma/components/Odontogram";

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const result = await getPatientById(resolvedParams.id);
  const odontogramResult = await getLatestOdontogram(resolvedParams.id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const patient = result.data;
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
        
        <button className="flex items-center gap-2 border border-border bg-secondary hover:border-gold px-4 py-2 rounded-md transition-colors">
          <Edit size={18} />
          Editar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna Izquierda: Datos y Contacto */}
        <div className="space-y-6">
          <div className="bg-secondary border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gold border-b border-border pb-2">Información de Contacto</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground">
                <Phone size={18} className="text-muted-foreground" />
                <span>{patient.phone || "No registrado"}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Mail size={18} className="text-muted-foreground" />
                <span>{patient.email || "No registrado"}</span>
              </div>
            </div>
          </div>

          <div className="bg-secondary border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gold border-b border-border pb-2">Antecedentes Médicos</h2>
            <div className="space-y-4">
              <div>
                <span className="block text-sm text-muted-foreground mb-1">Alergias</span>
                <p className="text-foreground">{patient.allergies || "Ninguna registrada"}</p>
              </div>
              <div>
                <span className="block text-sm text-muted-foreground mb-1">Enfermedades / Notas médicas</span>
                <p className="text-foreground">{patient.medicalHistory || "Sin historial médico previo"}</p>
              </div>
            </div>
          </div>
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
        </div>
      </div>
    </div>
  );
}
