import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Users, CircleDollarSign, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getFinancialMetrics, getRecentTransactions } from "@/features/finanzas/actions";
import { FinancialDashboard } from "@/features/finanzas/components/FinancialDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Obtener el rol actualizado desde la base de datos (por si la sesión tiene un token viejo)
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
    select: { role: true }
  });
  const isSuperAdmin = dbUser?.role === "SUPERADMIN";

  // Obtener métricas reales para el MVP
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [appointmentsCount, patientsCount, metricsResult, transactionsResult] = await Promise.all([
    prisma.appointment.count({
      where: {
        date: { gte: today },
        isActive: true,
        patient: { is: { isActive: true } }
      }
    }),
    prisma.patient.count({
      where: { isActive: true }
    }),
    getFinancialMetrics(),
    getRecentTransactions()
  ]);

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Hola, Dr(a). <span className="text-gold">{session.user?.name || "Doctor"}</span>
        </h1>
        <p className="text-muted-foreground mt-2">Bienvenido a tu panel de control. Aquí tienes el resumen de tu clínica.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Quick Links / Metrics */}
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



        {/* Catálogo de Tratamientos */}
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

      {metricsResult.success && transactionsResult.success && (
        <div className="mt-12 border-t border-border pt-8">
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
