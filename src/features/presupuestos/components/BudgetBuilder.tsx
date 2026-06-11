"use client";

import { useState } from "react";
import { Plus, X, Save, Search, ChevronLeft } from "lucide-react";
import { createBudget } from "@/features/presupuestos/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Treatment = {
  id: string;
  name: string;
  category: string;
  defaultPrice: number;
  scope: string; // TOOTH, FACE, GLOBAL
};

type BudgetItem = {
  id: string; // temp id for UI
  treatment: Treatment;
  price: number;
  toothNumber?: number;
  toothFace?: string;
};

export function BudgetBuilder({ patientId, patientName, treatments }: { patientId: string, patientName: string, treatments: Treatment[] }) {
  const router = useRouter();
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredTreatments = treatments.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = (treatment: Treatment) => {
    setItems([...items, {
      id: Math.random().toString(36).substr(2, 9),
      treatment,
      price: treatment.defaultPrice,
      // If scope is TOOTH or FACE, we default to tooth 11, but the user can change it
      toothNumber: treatment.scope !== "GLOBAL" ? 11 : undefined,
    }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    setItems(items.map(item => item.id === id ? { ...item, price: newPrice } : item));
  };

  const handleToothChange = (id: string, tooth: number) => {
    setItems(items.map(item => item.id === id ? { ...item, toothNumber: tooth } : item));
  };

  const total = items.reduce((acc, item) => acc + item.price, 0);

  const handleSave = async () => {
    if (items.length === 0) return alert("Agrega al menos un tratamiento.");
    
    setLoading(true);
    const result = await createBudget(patientId, items.map(item => ({
      treatmentId: item.treatment.id,
      price: item.price,
      toothNumber: item.toothNumber,
      toothFace: item.toothFace
    })), notes);

    setLoading(false);
    if (result.success) {
      router.push(`/pacientes/${patientId}`);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6 border-b border-border pb-4">
        <Link href={`/pacientes/${patientId}`} className="p-2 bg-secondary rounded-full text-muted-foreground hover:text-gold transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nuevo Presupuesto</h1>
          <p className="text-muted-foreground">Paciente: <span className="text-gold font-semibold">{patientName}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Catálogo Left Panel */}
        <div className="bg-secondary/20 border border-border rounded-xl p-6 h-[700px] flex flex-col">
          <h2 className="text-xl font-bold text-foreground mb-4">Catálogo de Tratamientos</h2>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Buscar tratamientos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:border-gold outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {filteredTreatments.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No se encontraron tratamientos.</p>
            ) : (
              filteredTreatments.map(t => (
                <div key={t.id} className="flex justify-between items-center bg-background border border-border p-3 rounded-lg hover:border-gold/50 transition-colors">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{t.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase">{t.category} • {t.scope}</p>
                    <p className="text-gold font-bold text-sm mt-1">S/ {t.defaultPrice.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => handleAddItem(t)}
                    className="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold hover:text-primary-foreground transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Builder Right Panel */}
        <div className="bg-secondary border border-border rounded-xl p-6 h-[700px] flex flex-col shadow-lg">
          <h2 className="text-xl font-bold text-gold mb-4">Detalle del Presupuesto</h2>
          
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <Plus size={48} className="mb-4" />
                <p>Agrega tratamientos desde el catálogo</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div key={item.id} className="bg-background border border-border p-4 rounded-lg relative group">
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                  
                  <div className="flex justify-between items-start mb-3 border-b border-border pb-2">
                    <div>
                      <span className="text-xs font-bold text-muted-foreground bg-secondary px-2 py-1 rounded mr-2">#{index + 1}</span>
                      <span className="font-bold text-foreground">{item.treatment.name}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    {item.treatment.scope !== "GLOBAL" && (
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground block mb-1">Pieza Dental</label>
                        <select 
                          value={item.toothNumber || 11}
                          onChange={(e) => handleToothChange(item.id, parseInt(e.target.value))}
                          className="w-full bg-secondary border border-border rounded p-2 text-sm focus:border-gold outline-none"
                        >
                          {/* Generar lista de piezas dentales básicas */}
                          {[18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28,48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38].map(n => (
                            <option key={n} value={n}>Pieza {n}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground block mb-1">Precio Acordado (S/)</label>
                      <input 
                        type="number" 
                        value={item.price}
                        onChange={(e) => handlePriceChange(item.id, parseFloat(e.target.value) || 0)}
                        className="w-full bg-secondary border border-border rounded p-2 text-sm font-bold text-gold focus:border-gold outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-6 border-t border-border mt-4">
            <textarea 
              placeholder="Notas u observaciones del presupuesto..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-gold outline-none resize-none mb-4"
            ></textarea>

            <div className="flex justify-between items-end mb-6">
              <span className="text-muted-foreground font-medium">Total Presupuestado:</span>
              <span className="text-4xl font-black text-gold">S/ {total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleSave}
              disabled={loading || items.length === 0}
              className="w-full bg-gold text-primary-foreground font-bold py-4 rounded-xl hover:bg-accent transition-colors shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2 text-lg"
            >
              <Save size={24} />
              {loading ? "Guardando Presupuesto..." : "Guardar Presupuesto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
