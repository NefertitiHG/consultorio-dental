import { prisma } from "@/lib/prisma";
import { createAppointment } from "@/features/citas/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, User, AlignLeft, ArrowLeft } from "lucide-react";

import { PatientSearch } from "@/features/citas/components/PatientSearch";

export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function NuevaCitaPage({ searchParams }: { searchParams: Promise<{ date?: string, time?: string, error?: string }> }) {
  const session = await getServerSession(authOptions);

  const patients = await prisma.patient.findMany({
    where: { isActive: true },
    orderBy: { firstName: "asc" }
  });

  const params = await searchParams;
  const defaultDate = params.date || "";
  const defaultTime = params.time || "";
  const errorMsg = params.error || "";

  async function handleCreate(formData: FormData) {
    "use server";
    const patientId = formData.get("patientId") as string;
    const dateStr = formData.get("date") as string;
    const timeStr = formData.get("time") as string;
    const notes = formData.get("notes") as string;
    
    // El doctor que agenda la cita es obligatoriamente el usuario logueado
    const userId = session?.user?.id || "";

    // Añadimos la zona horaria de Perú/Colombia (-05:00) para evitar desfase en Vercel (UTC)
    const date = new Date(`${dateStr}T${timeStr}:00-05:00`);

    const result = await createAppointment({ patientId, date, notes, userId });
    if (!result.success) {
      redirect(`/citas/nueva?error=${encodeURIComponent(result.error!)}&date=${dateStr}&time=${timeStr}`);
    }
    
    redirect("/citas");
  }

  return (
    <div className="p-4 md:p-8 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/citas" className="p-2 bg-secondary text-muted-foreground hover:text-gold hover:bg-gold/10 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agendar Cita</h1>
          <p className="text-muted-foreground mt-1">Ingresa los detalles para programar una nueva cita.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <span className="font-semibold">Error:</span> {errorMsg}
        </div>
      )}

      <form action={handleCreate} className="bg-background border border-border p-6 rounded-xl shadow-lg space-y-6">
        
        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2"><User size={16} className="text-gold"/> Paciente</label>
          <PatientSearch patients={patients} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2"><Calendar size={16} className="text-gold"/> Fecha</label>
            <input type="date" name="date" defaultValue={defaultDate} required className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-gold" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2"><Clock size={16} className="text-gold"/> Hora</label>
            <input type="time" name="time" defaultValue={defaultTime} required className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-gold" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2"><AlignLeft size={16} className="text-gold"/> Motivo o Notas</label>
          <textarea name="notes" rows={3} placeholder="Ej. Revisión general, dolor en molar..." className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-gold"></textarea>
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <button type="submit" className="bg-gold text-primary-foreground font-bold px-6 py-2 rounded-lg hover:bg-accent transition-colors shadow-md hover:shadow-lg">
            Agendar
          </button>
        </div>
      </form>
    </div>
  );
}
