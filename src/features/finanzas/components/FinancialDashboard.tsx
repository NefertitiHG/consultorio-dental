"use client";

import { 
  CircleDollarSign, 
  TrendingUp, 
  Wallet, 
  CreditCard,
  Banknote,
  Smartphone,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import Link from "next/link";

interface FinancialMetrics {
  monthlyIncome: number;
  dailyIncome: number;
  accountsReceivable: number;
  incomeByMethod: Record<string, number>;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: Date;
  patient?: { id: string; firstName: string; lastName: string } | null;
}

export function FinancialDashboard({
  metrics,
  recentTransactions
}: {
  metrics: FinancialMetrics;
  recentTransactions: Transaction[];
}) {
  const getMethodIcon = (method: string) => {
    switch(method) {
      case "Efectivo": return <Banknote size={16} className="text-green-500" />;
      case "Yape/Plin": return <Smartphone size={16} className="text-purple-500" />;
      case "Tarjeta": return <CreditCard size={16} className="text-blue-500" />;
      default: return <Wallet size={16} className="text-gold" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Recaudado Hoy */}
        <div className="bg-secondary/20 border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-gold/50 transition-colors">
          <div className="absolute -right-6 -top-6 text-gold/5 opacity-50 group-hover:scale-110 transition-transform">
            <CircleDollarSign size={150} />
          </div>
          <div className="relative z-10">
            <p className="text-muted-foreground font-semibold mb-1">Recaudado Hoy</p>
            <h2 className="text-4xl font-black text-foreground">
              <span className="text-gold">S/</span> {metrics.dailyIncome.toFixed(2)}
            </h2>
            <div className="flex items-center gap-2 mt-4 text-sm text-green-500">
              <TrendingUp size={16} />
              <span>Ingresos en tiempo real</span>
            </div>
          </div>
        </div>

        {/* Ingresos del Mes */}
        <div className="bg-secondary/20 border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-gold/50 transition-colors">
          <div className="absolute -right-6 -top-6 text-green-500/5 opacity-50 group-hover:scale-110 transition-transform">
            <TrendingUp size={150} />
          </div>
          <div className="relative z-10">
            <p className="text-muted-foreground font-semibold mb-1">Ingresos del Mes</p>
            <h2 className="text-4xl font-black text-foreground">
              <span className="text-green-500">S/</span> {metrics.monthlyIncome.toFixed(2)}
            </h2>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <span>Total mensual acumulado</span>
            </div>
          </div>
        </div>

        {/* Cuentas por Cobrar */}
        <div className="bg-secondary/20 border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-gold/50 transition-colors">
          <div className="absolute -right-6 -top-6 text-red-500/5 opacity-50 group-hover:scale-110 transition-transform">
            <Wallet size={150} />
          </div>
          <div className="relative z-10">
            <p className="text-muted-foreground font-semibold mb-1">Cuentas por Cobrar</p>
            <h2 className="text-4xl font-black text-foreground">
              <span className="text-red-400">S/</span> {metrics.accountsReceivable.toFixed(2)}
            </h2>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <span>Capital pendiente en presupuestos</span>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Distribución por Método de Pago */}
        <div className="lg:col-span-1 bg-secondary/20 border border-border rounded-2xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Wallet className="text-gold" /> Método de Pago (Mes)
          </h3>
          <div className="space-y-4">
            {Object.keys(metrics.incomeByMethod).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No hay pagos registrados este mes.</p>
            ) : (
              Object.entries(metrics.incomeByMethod).sort((a,b) => b[1] - a[1]).map(([method, amount]) => {
                const percentage = Math.round((amount / metrics.monthlyIncome) * 100) || 0;
                return (
                  <div key={method} className="bg-background border border-border p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2 font-semibold text-foreground">
                        {getMethodIcon(method)}
                        <span>{method}</span>
                      </div>
                      <span className="font-bold text-foreground">S/ {amount.toFixed(2)}</span>
                    </div>
                    {/* Barra de progreso visual */}
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gold h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-xs text-muted-foreground mt-1">{percentage}% del total</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Últimos Movimientos */}
        <div className="lg:col-span-2 bg-secondary/20 border border-border rounded-2xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <CircleDollarSign className="text-gold" /> Últimos Movimientos
          </h3>
          
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No hay movimientos recientes.</p>
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between bg-background border border-border p-4 rounded-xl hover:border-gold/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'INCOME' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {tx.type === 'INCOME' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        {tx.patient 
                          ? `${tx.patient.firstName} ${tx.patient.lastName}`
                          : "Ingreso General"}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px] md:max-w-md">
                        {tx.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-black ${tx.type === 'INCOME' ? 'text-green-500' : 'text-red-400'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'} S/ {tx.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString("es-ES", { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
