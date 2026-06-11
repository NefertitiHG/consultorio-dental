import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Users, CircleDollarSign, BookOpen, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getFinancialMetrics, getRecentTransactions } from "@/features/finanzas/actions";
import { getAppointments } from "@/features/citas/actions";
import { FinancialDashboard } from "@/features/finanzas/components/FinancialDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Obtener el rol actualizado desde la base de datos
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
    select: { role: true, id: true }
  });
  const isSuperAdmin = dbUser?.role === "SUPERADMIN";
  const userId = dbUser?.id;

  // Fechas para hoy
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [appointmentsCount, patientsCount, metricsResult, transactionsResult, appointmentsResult] = await Promise.all([
    prisma.appointment.count({
      where: {
        date: { gte: startOfDay },
        isActive: true,
        patient: { is: { isActive: true } }
      }
    }),
    prisma.patient.count({
      where: { isActive: true }
    }),
    getFinancialMetrics(),
    getRecentTransactions(),
    getAppointments(startOfDay, endOfDay, isSuperAdmin ? undefined : userId)
  ]);

  const todaysAppointments = appointmentsResult.success ? appointmentsResult.data : [];

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Hola, Dr(a). <span className="text-gold">{session.user?.name || "Doctor"}</span>
        </h1>
        <p className="text-muted-foreground mt-2">Bienvenido a tu panel de control. Aquí tienes el resumen de tu clínica.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-12">
        <Link href="/citas" className="bg-secondary border border-border p-6 rounded-xl hover:border-gold transition-colors group relative overflow-hidden">
          <div className="absolute top-6 right-6 text-4xl font-bold text-gold opacity-20 group-hover:opacity-100 transition-opacity">
            {appointmentsCount}
          </div>
          <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/10">
            <CalendarDays className="text-gold" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Citas Próximas</h2>
          <p className="text-muted-foreground text-sm mt-1">Revisa tu agenda de hoy y mañana.</p>
        </Link>

        <Link href="/pacientes" className="bg-secondary border border-border p-6 rounded-xl hover:border-gold transition-colors group relative overflow-hidden">
          <div className="absolute top-6 right-6 text-4xl font-bold text-gold opacity-20 group-hover:opacity-100 transition-opacity">
            {patientsCount}
          </div>
          <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/10">
            <Users className="text-gold" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Pacientes Totales</h2>
          <p className="text-muted-foreground text-sm mt-1">Directorio y fichas clínicas.</p>
        </Link>

        <Link href="/tratamientos" className="bg-secondary border border-border p-6 rounded-xl hover:border-gold transition-colors group relative overflow-hidden">
          <div className="absolute top-6 right-6 text-4xl font-bold text-gold opacity-20 group-hover:opacity-100 transition-opacity">
            ★
          </div>
          <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/10">
            <BookOpen className="text-gold" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Tratamientos</h2>
          <p className="text-muted-foreground text-sm mt-1">Catálogo de precios y servicios.</p>
        </Link>
      </div>

      {/* Citas de Hoy */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Clock className="text-gold" /> Citas de Hoy
          </h2>
          <Link href="/citas" className="text-gold hover:underline text-sm font-semibold">Ver agenda completa →</Link>
        </div>
        
        <div className="bg-secondary/20 border border-border rounded-2xl p-6">
          {(!todaysAppointments || todaysAppointments.length === 0) ? (
            <p className="text-muted-foreground text-center py-6">No tienes citas programadas para hoy.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todaysAppointments.map((cita: any) => {
                const isPast = new Date(cita.date).getTime() < new Date().getTime();
                return (
                  <Link href={`/pacientes/${cita.patientId}`} key={cita.id} className="block">
                    <div className={`p-4 rounded-xl border transition-all ${isPast ? 'bg-secondary/40 border-border opacity-70' : 'bg-background border-gold/30 hover:border-gold hover:shadow-md'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gold text-lg">
                          {new Date(cita.date).toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold ${cita.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' : cita.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                          {cita.status}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground truncate">{cita.patient.firstName} {cita.patient.lastName}</h3>
                      <p className="text-xs text-muted-foreground truncate">{cita.notes || "Cita de control"}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {metricsResult.success && transactionsResult.success && (
        <div className="border-t border-border pt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Resumen Financiero</h2>
          <FinancialDashboard 
            metrics={metricsResult.data!} 
            recentTransactions={transactionsResult.data!} 
          />
        </div>
      )}
    </div>
  );
}
