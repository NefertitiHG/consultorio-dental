"use client";

import { useState } from "react";
import { FileText, Plus, CreditCard, CheckCircle, X } from "lucide-react";
import Link from "next/link";
import { addPayment } from "@/features/presupuestos/actions";

interface Budget {
  id: string;
  total: number;
  paidAmount: number;
  status: string;
  createdAt: Date;
  items: any[];
  payments?: any[];
}

export function BudgetList({ patientId, budgets }: { patientId: string, budgets: Budget[] }) {
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<string>("Efectivo");
  const [loading, setLoading] = useState(false);

  const maxAmount = selectedBudgetId ? budgets.find(b => b.id === selectedBudgetId)?.total! - budgets.find(b => b.id === selectedBudgetId)?.paidAmount! : 0;

  const handleAmortize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudgetId) return;
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return alert("Monto inválido");
    if (parsedAmount > maxAmount) return alert("El monto supera la deuda");

    setLoading(true);
    await addPayment(selectedBudgetId, patientId, parsedAmount, method);
    setLoading(false);
    setSelectedBudgetId(null);
    setAmount("");
  };

  return (
    <div className="bg-secondary/20 border border-border rounded-xl p-6 shadow-sm mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foreground">Presupuestos y Pagos</h2>
        <Link 
          href={`/pacientes/${patientId}/presupuestos/nuevo`}
          className="flex items-center gap-2 bg-gold text-primary-foreground px-4 py-2 rounded-md hover:bg-accent transition-colors font-semibold"
        >
          <Plus size={16} /> Nuevo Presupuesto
        </Link>
      </div>

      <div className="space-y-4">
        {budgets.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">No hay presupuestos registrados.</p>
        ) : (
          budgets.map((budget) => {
            const isPaid = budget.total - budget.paidAmount <= 0;
            return (
              <div key={budget.id} className="bg-background border border-border rounded-lg p-4 flex flex-col gap-4 hover:border-gold/50 transition-colors">
                <div className="flex justify-between items-start w-full border-b border-border pb-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isPaid ? "bg-green-500/20 text-green-500" : "bg-gold/20 text-gold"}`}>
                      {isPaid ? <CheckCircle size={20} /> : <FileText size={20} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">Presupuesto {new Date(budget.createdAt).toLocaleDateString("es-ES")}</h3>
                      <p className="text-xs text-muted-foreground">{budget.items.length} tratamientos</p>
                    </div>
                  </div>
                  <Link 
                    href={`/pacientes/${patientId}/presupuestos/${budget.id}/print`}
                    target="_blank"
                    className="p-1.5 text-muted-foreground hover:text-gold hover:bg-gold/10 rounded transition-colors text-xs font-semibold flex items-center gap-1"
                  >
                    PDF
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-2 w-full text-center">
                  <div className="px-1">
                    <p className="text-[10px] text-muted-foreground uppercase">Total</p>
                    <p className="font-bold text-foreground text-sm">S/ {budget.total.toFixed(2)}</p>
                  </div>
                  <div className="px-1 border-l border-border">
                    <p className="text-[10px] text-muted-foreground uppercase">Amortizado</p>
                    <p className="font-bold text-foreground text-sm">S/ {budget.paidAmount.toFixed(2)}</p>
                  </div>
                  <div className="px-1 border-l border-border">
                    <p className="text-[10px] text-muted-foreground uppercase">Deuda</p>
                    <p className={`font-bold text-sm ${isPaid ? "text-green-500" : "text-red-400"}`}>
                      S/ {Math.max(0, budget.total - budget.paidAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
                
                {/* Historial de Pagos */}
                {budget.payments && budget.payments.length > 0 && (
                  <div className="w-full mt-2 pt-3 border-t border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Historial de Amortizaciones:</p>
                    <div className="space-y-2">
                      {budget.payments.map((payment: any) => (
                        <div key={payment.id} className="flex justify-between items-center text-xs bg-secondary/30 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-gold font-semibold">{new Date(payment.date).toLocaleDateString("es-ES")}</span>
                            <span className="text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border">{payment.method}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-foreground">S/ {payment.amount.toFixed(2)}</span>
                            <Link 
                              href={`/pacientes/${patientId}/pagos/${payment.id}/print`}
                              target="_blank"
                              className="text-muted-foreground hover:text-gold"
                            >
                              [PDF]
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {!isPaid && (
                  <div className="pt-2 w-full">
                    <button 
                      onClick={() => setSelectedBudgetId(budget.id)}
                      className="w-full flex items-center justify-center gap-2 bg-secondary border border-border hover:border-gold text-foreground px-4 py-2 rounded-md transition-colors text-sm font-semibold"
                    >
                      <CreditCard size={16} /> Amortizar
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Amortización */}
      {selectedBudgetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={handleAmortize} className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-secondary border-b border-border p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gold flex items-center gap-2">
                <CreditCard size={20} /> Registrar Pago
              </h3>
              <button type="button" onClick={() => setSelectedBudgetId(null)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center bg-secondary/50 p-3 rounded-lg border border-border">
                <span className="text-sm text-muted-foreground">Deuda Actual:</span>
                <span className="font-bold text-red-400 text-lg">S/ {maxAmount.toFixed(2)}</span>
              </div>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Monto a pagar (S/)</label>
                <input 
                  type="number" 
                  step="0.01"
                  max={maxAmount}
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-secondary border border-border rounded p-3 text-2xl font-bold text-foreground focus:border-gold outline-none"
                  placeholder="0.00"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Método de Pago</label>
                <select 
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-secondary border border-border rounded p-3 text-foreground focus:border-gold outline-none"
                >
                  <option value="Efectivo">💵 Efectivo</option>
                  <option value="Yape/Plin">📱 Yape / Plin</option>
                  <option value="Transferencia">🏦 Transferencia Bancaria</option>
                  <option value="Tarjeta">💳 Tarjeta de Crédito/Débito</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-secondary/50 border-t border-border flex gap-3">
              <button type="button" onClick={() => setSelectedBudgetId(null)} className="flex-1 py-2 border border-border rounded hover:bg-secondary transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="flex-1 py-2 bg-gold text-primary-foreground font-bold rounded shadow-md hover:bg-accent transition-colors disabled:opacity-50">
                {loading ? "Procesando..." : "Confirmar Pago"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
