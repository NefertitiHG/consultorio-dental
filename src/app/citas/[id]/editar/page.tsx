import { getAppointmentById, updateAppointment, softDeleteAppointment } from "@/features/citas/actions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, User, AlignLeft, Trash2, Save, Activity } from "lucide-react";
import { format } from "date-fns";

export default async function EditAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const appointmentId = resolvedParams.id;
  const result = await getAppointmentById(appointmentId);

  if (!result.success || !result.data) {
    notFound();
  }

  const app = result.data;
  const initialDate = format(new Date(app.date), "yyyy-MM-dd");
  const initialTime = format(new Date(app.date), "HH:mm");

  async function handleUpdate(formData: FormData) {
    "use server";
    const dateStr = formData.get("date") as string;
    const timeStr = formData.get("time") as string;
    const notes = formData.get("notes") as string;
    const status = formData.get("status") as "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    
    const date = new Date(`${dateStr}T${timeStr}:00`);

    await updateAppointment(appointmentId, { date, notes, status });
    redirect("/citas");
  }

  async function handleDelete() {
    "use server";
    await softDeleteAppointment(appointmentId);
    redirect("/citas");
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/citas" className="text-gold hover:underline text-sm mb-2 inline-block">&larr; Volver a la Agenda</Link>
        <h1 className="text-3xl font-bold text-foreground">Detalle de la Cita</h1>
      </div>

      <div className="bg-background border border-border p-6 rounded-xl shadow-lg space-y-6">
        
        <form action={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2"><User size={16} className="text-gold"/> Paciente</label>
            <div className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground font-medium">
              {app.patient.firstName} {app.patient.lastName}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Calendar size={16} className="text-gold"/> Fecha</label>
              <input type="date" name="date" defaultValue={initialDate} required className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-gold" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Clock size={16} className="text-gold"/> Hora</label>
              <input type="time" name="time" defaultValue={initialTime} required className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-gold" />
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-sm font-semibold flex items-center gap-2"><Activity size={16} className="text-gold"/> Estado</label>
              <select name="status" defaultValue={app.status} className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-gold">
                <option value="SCHEDULED">Programada</option>
                <option value="COMPLETED">Completada</option>
                <option value="NO_SHOW">No Asistió</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2"><AlignLeft size={16} className="text-gold"/> Motivo o Notas</label>
            <textarea name="notes" defaultValue={app.notes || ""} rows={3} placeholder="Ej. Revisión general, dolor en molar..." className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-gold"></textarea>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-4">
            <Link href="/citas" className="px-6 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
              Cancelar
            </Link>
            <button type="submit" className="bg-gold flex items-center gap-2 text-primary-foreground font-bold px-6 py-2 rounded-lg hover:bg-accent transition-colors shadow-md hover:shadow-lg">
              <Save size={18} />
              Guardar Cambios
            </button>
          </div>
        </form>

        <div className="pt-8 border-t border-red-500/20 mt-8">
          <form action={handleDelete}>
            <button type="submit" className="flex items-center gap-2 text-red-500 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-md transition-colors w-full justify-center md:w-auto">
              <Trash2 size={18} />
              Cancelar y Eliminar Cita
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
