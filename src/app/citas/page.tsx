import { getAppointments } from "@/features/citas/actions";
import { WeeklyCalendar } from "@/features/citas/components/WeeklyCalendar";
import { startOfWeek, endOfWeek, subWeeks, addWeeks } from "date-fns";

export const dynamic = "force-dynamic";

export default async function CitasPage() {
  // Por ahora cargamos un rango amplio para la demo
  const today = new Date();
  const start = subWeeks(startOfWeek(today), 2);
  const end = addWeeks(endOfWeek(today), 2);

  const res = await getAppointments(start, end);
  const appointments = res.success ? res.data : [];

  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gold">Agenda</h1>
        <p className="text-muted-foreground mt-1">
          Control de citas e integración con Google Calendar
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <WeeklyCalendar initialAppointments={appointments || []} />
      </div>
    </div>
  );
}
