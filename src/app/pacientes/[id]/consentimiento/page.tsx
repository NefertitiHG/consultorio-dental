import { getPatientById } from "@/features/pacientes/actions";
import { notFound } from "next/navigation";
import { PrintConsentClient } from "./PrintConsentClient";

export default async function ConsentimientoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const result = await getPatientById(resolvedParams.id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const patient = result.data;
  const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-3xl mx-auto p-8 bg-white" style={{ minHeight: '1056px' }}>
        
        {/* Header */}
        <div className="text-center mb-10 border-b-2 border-black pb-6">
          <h1 className="text-2xl font-bold uppercase tracking-widest text-gray-800">Consentimiento Informado Odontológico</h1>
          <p className="text-sm font-semibold tracking-wide text-gray-600 mt-2">Dra. Joyce Valencia - CIRUJANA DENTISTA</p>
        </div>

        {/* Declaración del Paciente */}
        <div className="text-justify space-y-6 text-sm leading-relaxed">
          <p>
            Yo, <strong>{patient.firstName} {patient.lastName}</strong>, identificado(a) con DNI N° <strong>{patient.dni}</strong>, 
            declaro que se me ha explicado de manera clara, comprensible y suficiente la naturaleza y propósito del tratamiento odontológico que se me va a realizar.
          </p>

          <p>
            Entiendo que la odontología no es una ciencia exacta, por lo que no se me puede garantizar un resultado absoluto y perfecto. He sido informado(a) sobre las posibles complicaciones y riesgos asociados al tratamiento, que aunque son poco frecuentes, incluyen pero no se limitan a: dolor, inflamación, sangrado, infección, alteraciones nerviosas temporales o permanentes, y la posibilidad de requerir tratamientos adicionales no previstos inicialmente.
          </p>

          <p>
            Se me ha dado la oportunidad de hacer todas las preguntas pertinentes sobre el diagnóstico, las alternativas de tratamiento, los riesgos y los costos, y todas mis dudas han sido resueltas a mi entera satisfacción por la <strong>Dra. Joyce Valencia</strong>.
          </p>

          <p>
            Asimismo, me comprometo a seguir rigurosamente las indicaciones pre y post operatorias, y a asistir a las citas de control programadas, asumiendo la responsabilidad sobre las consecuencias que pudieran derivarse del incumplimiento de las mismas.
          </p>

          <p>
            Por lo tanto, en pleno uso de mis facultades mentales y de manera libre y voluntaria:
          </p>

          <div className="text-center font-bold text-lg border p-4 my-6">
            OTORGO MI CONSENTIMIENTO PARA LA REALIZACIÓN DEL TRATAMIENTO ODONTOLÓGICO.
          </div>
          
          <p>
            Firmado en la ciudad de _______________, a los {new Date().getDate()} días del mes de {new Date().toLocaleDateString('es-ES', { month: 'long' })} de {new Date().getFullYear()}.
          </p>
        </div>

        {/* Firmas */}
        <div className="mt-32 flex justify-between items-end px-10">
          <div className="text-center w-64">
            <div className="border-b border-black mb-2 h-16"></div>
            <p className="font-bold text-sm">Firma del Paciente / Apoderado</p>
            <p className="text-xs">DNI: {patient.dni}</p>
          </div>
          
          <div className="text-center w-64">
            <div className="border-b border-black mb-2 h-16"></div>
            <p className="font-bold text-sm">Firma y Sello del Odontólogo</p>
            <p className="text-xs">Dra. Joyce Valencia</p>
          </div>
        </div>

      </div>
      
      {/* Script del cliente para ocultar UI y llamar window.print */}
      <PrintConsentClient />
    </div>
  );
}
