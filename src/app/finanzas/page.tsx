import { Navigation } from "@/components/layout/Navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getFinancialMetrics, getRecentTransactions } from "@/features/finanzas/actions";
import { FinancialDashboard } from "@/features/finanzas/components/FinancialDashboard";

export default async function FinanzasPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/");
  }

  const [metricsResult, transactionsResult] = await Promise.all([
    getFinancialMetrics(),
    getRecentTransactions()
  ]);

  if (!metricsResult.success || !transactionsResult.success) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        <Navigation role={session.user.role} />
        <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
          <div className="max-w-7xl mx-auto mt-20 md:mt-0 text-center">
            <h1 className="text-2xl font-bold text-red-500">Error al cargar datos financieros</h1>
            <p className="text-muted-foreground mt-4">Por favor, intente recargar la página.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Navigation role={session.user.role} />
      
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 overflow-x-hidden">
        <div className="max-w-7xl mx-auto mt-20 md:mt-0">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-foreground mb-2">
              Reportes y <span className="text-gold">Finanzas Globales</span>
            </h1>
            <p className="text-muted-foreground">
              Monitor de rendimiento y flujo de caja de la clínica
            </p>
          </div>

          <FinancialDashboard 
            metrics={metricsResult.data} 
            recentTransactions={transactionsResult.data} 
          />
        </div>
      </main>
    </div>
  );
}
