import { getAppointmentById, updateAppointment, softDeleteAppointment } from "@/features/citas/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, User, AlignLeft, Trash2, Save, Activity, ArrowLeft } from "lucide-react";

export default async function EditarCitaPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params;
  const { error: errorMsg } = await searchParams;

  const result = await getAppointmentById(id);
  const appointment = result.data;

  if (!appointment) {
    redirect("/citas");
  }

  // Ajustamos la fecha mostrada restando la zona horaria UTC para que el input type="date" y type="time" lo lean en hora local
  const localDate = new Date(appointment.date.getTime() - (5 * 60 * 60 * 1000));
  const defaultDate = localDate.toISOString().split("T")[0];
  const defaultTime = localDate.toISOString().split("T")[1].substring(0, 5);

  async function handleUpdate(formData: FormData) {
    "use server";
    const dateStr = formData.get("date") as string;
    const timeStr = formData.get("time") as string;
    const notes = formData.get("notes") as string;
    const status = formData.get("status") as "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    
    // Añadimos la zona horaria de Perú/Colombia (-05:00) para evitar desfase en Vercel (UTC)
    const date = new Date(`${dateStr}T${timeStr}:00-05:00`);

    const result = await updateAppointment(id, { date, notes, status });
    if (!result.success) {
      redirect(`/citas/${id}/editar?error=${encodeURIComponent(result.error!)}`);
    }

    redirect("/citas");
  }

  async function handleDelete() {
    "use server";
    await softDeleteAppointment(id);
    redirect("/citas");
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/citas" className="p-2 bg-secondary text-muted-foreground hover:text-gold hover:bg-gold/10 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Detalle de la Cita</h1>
          <p className="text-muted-foreground mt-1">Edita los detalles o el estado de la cita.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <span className="font-semibold">Error:</span> {errorMsg}
        </div>
      )}

      <div className="bg-background border border-border p-6 rounded-xl shadow-lg space-y-6">
        
        <form action={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2"><User size={16} className="text-gold"/> Paciente</label>
            <div className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground font-medium">
              {appointment.patient.firstName} {appointment.patient.lastName}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Calendar size={16} className="text-gold"/> Fecha</label>
              <input type="date" name="date" defaultValue={defaultDate} required className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-gold" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Clock size={16} className="text-gold"/> Hora</label>
              <input type="time" name="time" defaultValue={defaultTime} required className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-gold" />
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-sm font-semibold flex items-center gap-2"><Activity size={16} className="text-gold"/> Estado</label>
              <select name="status" defaultValue={appointment.status} className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-gold">
                <option value="SCHEDULED">Programada</option>
                <option value="COMPLETED">Completada</option>
                <option value="NO_SHOW">No Asistió</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2"><AlignLeft size={16} className="text-gold"/> Motivo o Notas</label>
            <textarea name="notes" defaultValue={appointment.notes || ""} rows={3} placeholder="Ej. Revisión general, dolor en molar..." className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-gold"></textarea>
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
