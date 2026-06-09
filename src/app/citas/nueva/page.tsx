import { prisma } from "@/lib/prisma";
import { createAppointment } from "@/features/citas/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, User, AlignLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NuevaCitaPage({ searchParams }: { searchParams: Promise<{ date?: string, time?: string }> }) {
  const patients = await prisma.patient.findMany({
    orderBy: { firstName: "asc" }
  });

  const params = await searchParams;
  const defaultDate = params.date || "";
  const defaultTime = params.time || "";

  async function handleCreate(formData: FormData) {
    "use server";
    const patientId = formData.get("patientId") as string;
    const dateStr = formData.get("date") as string;
    const timeStr = formData.get("time") as string;
    const notes = formData.get("notes") as string;

    const date = new Date(`${dateStr}T${timeStr}:00`);

    await createAppointment({ patientId, date, notes });
    redirect("/citas");
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/citas" className="text-gold hover:underline text-sm mb-2 inline-block">&larr; Volver a la Agenda</Link>
        <h1 className="text-3xl font-bold text-foreground">Agendar Cita</h1>
      </div>

      <form action={handleCreate} className="bg-background border border-border p-6 rounded-xl shadow-lg space-y-6">
        
        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2"><User size={16} className="text-gold"/> Paciente</label>
          <select name="patientId" required className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-gold">
            <option value="">Seleccione un paciente...</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
            ))}
          </select>
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
