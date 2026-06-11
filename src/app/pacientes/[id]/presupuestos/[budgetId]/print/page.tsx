import { getBudgetById } from "@/features/presupuestos/actions";
import { notFound } from "next/navigation";
import { DownloadPDFButton } from "@/components/ui/DownloadPDFButton";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PrintBudgetPage({ params }: { params: Promise<{ id: string, budgetId: string }> }) {
  const resolvedParams = await params;
  const result = await getBudgetById(resolvedParams.budgetId);

  if (!result.success || !result.data) {
    notFound();
  }

  const budget = result.data as any;
  const patient = budget.patient;

  return (
    <div className="min-h-screen bg-secondary/30 p-4 md:p-8 font-sans">
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link
          href={`/pacientes/${resolvedParams.id}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground bg-background px-4 py-2 rounded-md shadow-sm"
        >
          <ChevronLeft size={20} /> Volver al Paciente
        </Link>
        <DownloadPDFButton
          targetId="budget-pdf-content"
          filename={`Presupuesto_${patient.firstName}_${patient.lastName}`}
        />
      </div>

      {/* A4 Container */}
      <div
        id="budget-pdf-content"
        className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white text-black p-[20mm] shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-200 pb-6 mb-8">
          <div>
            <div className="w-48 h-16 bg-gray-100 flex items-center justify-center border border-gray-300 text-gray-500 font-bold mb-2">
              [ LOGO DE LA CLÍNICA ]
            </div>
            <p className="text-sm text-gray-600">Av. José Martí 1052, La Esperanza</p>
            <p className="text-sm text-gray-600">Tel: 982909429</p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">PRESUPUESTO</h1>
            <p className="text-gray-500 font-medium mt-1">Nº {budget.id.substring(0, 8).toUpperCase()}</p>
            <p className="text-gray-500 mt-2">Fecha: {new Date(budget.createdAt).toLocaleDateString("es-ES")}</p>
          </div>
        </div>

        {/* Patient Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">Datos del Paciente</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Nombre Completo</p>
              <p className="font-semibold text-gray-800">{patient.firstName} {patient.lastName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Documento / DNI</p>
              <p className="font-semibold text-gray-800">{patient.dni}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Teléfono</p>
              <p className="font-semibold text-gray-800">{patient.phone || "No registrado"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Correo Electrónico</p>
              <p className="font-semibold text-gray-800">{patient.email || "No registrado"}</p>
            </div>
          </div>
        </div>

        {/* Treatments Table */}
        <h2 className="font-bold text-gray-800 mb-4">Detalle de Tratamientos</h2>
        <table className="w-full mb-8 text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="p-3 border border-gray-200 font-semibold">Tratamiento</th>
              <th className="p-3 border border-gray-200 font-semibold text-center">Pieza</th>
              <th className="p-3 border border-gray-200 font-semibold text-right">Precio</th>
            </tr>
          </thead>
          <tbody>
            {budget.items.map((item: any, i: number) => (
              <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3 border border-gray-200 text-gray-800 font-medium">
                  {item.treatment.name}
                  <span className="block text-xs text-gray-500 font-normal">{item.treatment.category}</span>
                </td>
                <td className="p-3 border border-gray-200 text-center text-gray-600">
                  {item.toothNumber ? `Pieza ${item.toothNumber}` : "-"}
                </td>
                <td className="p-3 border border-gray-200 text-right font-medium text-gray-800">
                  S/ {item.price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-64 bg-gray-50 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Total Cotizado:</span>
              <span className="font-black text-xl text-gray-800">S/ {budget.total.toFixed(2)}</span>
            </div>
            {budget.paidAmount > 0 && (
              <>
                <div className="flex justify-between items-center text-sm mb-2 text-green-600">
                  <span>Amortizado:</span>
                  <span className="font-bold">- S/ {budget.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-800">Saldo Pendiente:</span>
                  <span className="font-bold text-red-500">S/ {(budget.total - budget.paidAmount).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Notes */}
        {budget.notes && (
          <div className="mb-12">
            <h3 className="font-bold text-gray-800 mb-2">Observaciones</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-4 border border-gray-200 rounded-lg whitespace-pre-wrap">
              {budget.notes}
            </p>
          </div>
        )}

        {/* Signatures */}
        <div className="absolute bottom-[20mm] left-[20mm] right-[20mm] pt-8 border-t border-gray-200 grid grid-cols-2 gap-12 text-center">
          <div>
            <div className="h-20 mb-2 flex items-end justify-center">
              {/* Espacio para firma doctor */}
            </div>
            <div className="border-t border-gray-400 mx-8 pt-2">
              <p className="font-bold text-gray-800 text-sm">Firma del Doctor</p>
              <p className="text-xs text-gray-500">CMP / COP</p>
            </div>
          </div>
          <div>
            <div className="h-20 mb-2 flex items-end justify-center">
              {/* Espacio para firma paciente */}
            </div>
            <div className="border-t border-gray-400 mx-8 pt-2">
              <p className="font-bold text-gray-800 text-sm">Firma del Paciente</p>
              <p className="text-xs text-gray-500">DNI: {patient.dni}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
