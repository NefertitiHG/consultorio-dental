import { getPatientById } from "@/features/pacientes/actions";
import { notFound } from "next/navigation";
import { PrintRecetaClient } from "./PrintRecetaClient";

export default async function RecetaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const result = await getPatientById(resolvedParams.id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const patient = result.data;
  const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-2xl mx-auto p-8 bg-white" style={{ minHeight: '1056px' }}>
        {/* Header: Logotipo y Nombre del Consultorio */}
        <div className="flex justify-between items-center border-b-2 border-black pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-widest text-[#D4AF37]">Dra. Joyce Valencia</h1>
            <p className="text-sm font-semibold tracking-wide text-gray-600">CIRUJANA DENTISTA</p>
            <p className="text-xs text-gray-500 mt-1">C.O.P. _______</p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] text-2xl font-bold ml-auto">
              JV
            </div>
          </div>
        </div>

        {/* Datos del Paciente */}
        <div className="flex justify-between mb-8 text-sm">
          <div>
            <p><span className="font-bold">Paciente:</span> {patient.firstName} {patient.lastName}</p>
            <p><span className="font-bold">DNI:</span> {patient.dni}</p>
          </div>
          <div className="text-right">
            <p><span className="font-bold">Fecha:</span> {today}</p>
          </div>
        </div>

        {/* Símbolo Rx */}
        <div className="mb-4">
          <span className="text-4xl font-serif italic text-gray-800">Rx.</span>
        </div>

        {/* Cuerpo de la Receta (Líneas para escribir) */}
        <div className="space-y-8 mt-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border-b border-gray-300 w-full h-8"></div>
          ))}
        </div>

        {/* Footer y Firma */}
        <div className="mt-32 pt-8 flex justify-between items-end">
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Dirección:</strong> Av. Ejemplo 123, Ciudad</p>
            <p><strong>Teléfono:</strong> (01) 234-5678 / 987 654 321</p>
            <p><strong>Próxima Cita:</strong> __________________</p>
          </div>
          <div className="text-center w-64">
            <div className="border-b border-black mb-2 h-16"></div>
            <p className="font-bold text-sm">Firma y Sello</p>
            <p className="text-xs">Dra. Joyce Valencia</p>
          </div>
        </div>
      </div>
      
      {/* Script del cliente para ocultar UI y llamar window.print */}
      <PrintRecetaClient />
    </div>
  );
}
