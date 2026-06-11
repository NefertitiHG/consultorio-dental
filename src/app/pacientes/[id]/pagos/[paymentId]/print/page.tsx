import { getPaymentById } from "@/features/presupuestos/actions";
import { notFound } from "next/navigation";
import { DownloadPDFButton } from "@/components/ui/DownloadPDFButton";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PrintPaymentPage({ params }: { params: Promise<{ id: string, paymentId: string }> }) {
  const resolvedParams = await params;
  const result = await getPaymentById(resolvedParams.paymentId);

  if (!result.success || !result.data) {
    notFound();
  }

  const payment = result.data as any;
  const budget = payment.budget;
  const patient = budget.patient;

  return (
    <div className="min-h-screen bg-secondary/30 p-4 md:p-8 font-sans">
      <div className="max-w-[148mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link 
          href={`/pacientes/${resolvedParams.id}`} 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground bg-background px-4 py-2 rounded-md shadow-sm"
        >
          <ChevronLeft size={20} /> Volver al Paciente
        </Link>
        <DownloadPDFButton 
          targetId="payment-pdf-content" 
          filename={`Recibo_${patient.firstName}_${patient.lastName}`} 
        />
      </div>

      {/* A5 Container (Half A4 roughly) */}
      <div 
        id="payment-pdf-content" 
        className="w-full max-w-[148mm] min-h-[210mm] mx-auto bg-white text-black p-[15mm] shadow-2xl relative border border-gray-200"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-32 h-12 bg-gray-100 flex items-center justify-center border border-gray-300 text-gray-500 font-bold mx-auto mb-2 text-xs">
            [ LOGO ]
          </div>
          <h1 className="text-xl font-black text-gray-800 tracking-tight">COMPROBANTE DE PAGO</h1>
          <p className="text-gray-500 font-medium text-xs mt-1">RECIBO Nº {payment.id.substring(0, 8).toUpperCase()}</p>
        </div>

        {/* Info */}
        <div className="border border-gray-200 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-gray-500">Fecha de Emisión:</span>
            <span className="font-semibold text-right">{new Date(payment.date).toLocaleString("es-ES")}</span>
            
            <span className="text-gray-500">Paciente:</span>
            <span className="font-semibold text-right">{patient.firstName} {patient.lastName}</span>
            
            <span className="text-gray-500">DNI:</span>
            <span className="font-semibold text-right">{patient.dni}</span>

            <span className="text-gray-500 pt-2 border-t border-gray-100">Presupuesto Ref:</span>
            <span className="font-semibold text-right pt-2 border-t border-gray-100">{budget.id.substring(0, 8).toUpperCase()}</span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-100 text-center">
          <p className="text-xs text-gray-500 uppercase mb-1">Monto Abonado</p>
          <p className="text-4xl font-black text-gray-800 mb-2">S/ {payment.amount.toFixed(2)}</p>
          
          <div className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
            Método: {payment.method}
          </div>
        </div>

        {/* Signatures */}
        <div className="absolute bottom-[20mm] left-[15mm] right-[15mm] pt-8 border-t border-gray-200 text-center">
          <div className="h-16 mb-2 flex items-end justify-center">
            {/* Espacio para firma doctor o cajero */}
          </div>
          <div className="border-t border-gray-400 mx-12 pt-2">
            <p className="font-bold text-gray-800 text-sm">Firma Autorizada</p>
            <p className="text-xs text-gray-500">Centro Odontológico</p>
          </div>
          <p className="text-xs text-gray-400 mt-6 text-center">Este documento es un recibo interno de pago.</p>
        </div>
      </div>
    </div>
  );
}
