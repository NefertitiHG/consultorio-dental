"use client";

import { useState } from "react";
import { createTreatment, updateTreatment, softDeleteTreatment } from "@/features/tratamientos/actions";
import { Plus, Edit2, Trash2, X, Activity, Stethoscope, Smile, Pill, Sparkles, Syringe } from "lucide-react";

type Treatment = {
  id: string;
  name: string;
  category: string;
  defaultPrice: number;
  scope: string;
};

export function TreatmentCatalog({ initialTreatments }: { initialTreatments: Treatment[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(false);

  // Agrupamos los tratamientos por categoría
  const groupedTreatments = initialTreatments.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {} as Record<string, Treatment[]>);

  const categories = Object.keys(groupedTreatments).sort();

  const handleOpenNew = () => {
    setEditingTreatment(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Treatment) => {
    setEditingTreatment(t);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este tratamiento del catálogo? (No afectará presupuestos pasados)")) {
      await softDeleteTreatment(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    if (editingTreatment) {
      await updateTreatment(editingTreatment.id, formData);
    } else {
      await createTreatment(formData);
    }
    
    setLoading(false);
    setIsModalOpen(false);
  };

  // Helper para iconos según categoría
  const getCategoryIcon = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes("endodoncia") || c.includes("anestesia")) return <Syringe size={24} className="text-gold" />;
    if (c.includes("ortodoncia") || c.includes("estética")) return <Sparkles size={24} className="text-gold" />;
    if (c.includes("cirugía") || c.includes("implante")) return <Activity size={24} className="text-gold" />;
    if (c.includes("pediatría") || c.includes("infantil")) return <Smile size={24} className="text-gold" />;
    if (c.includes("farmacología") || c.includes("medicamento")) return <Pill size={24} className="text-gold" />;
    return <Stethoscope size={24} className="text-gold" />;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Catálogo de Tratamientos</h1>
          <p className="text-muted-foreground mt-1">Configura tus servicios, categorías y precios base.</p>
        </div>
        <button onClick={handleOpenNew} className="bg-gold text-primary-foreground px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-accent transition-colors shadow-md">
          <Plus size={20} />
          <span>Nuevo Tratamiento</span>
        </button>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20 bg-secondary/30 rounded-xl border border-border border-dashed">
          <Sparkles size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-bold text-foreground">Tu catálogo está vacío</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">Comienza agregando los servicios y procedimientos que ofreces en tu clínica para poder armar presupuestos.</p>
        </div>
      )}

      <div className="space-y-10">
        {categories.map(category => (
          <div key={category} className="bg-secondary/20 rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <div className="bg-background p-3 rounded-xl shadow-inner">
                {getCategoryIcon(category)}
              </div>
              <h2 className="text-2xl font-bold text-foreground uppercase tracking-wide">{category}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedTreatments[category].map(t => (
                <div key={t.id} className="bg-background border border-border p-5 rounded-xl hover:border-gold transition-colors group relative overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground pr-12 leading-tight">{t.name}</h3>
                    <div className="inline-block mt-2 px-2 py-1 bg-secondary text-xs rounded-md text-muted-foreground font-medium uppercase">
                      Alcance: {t.scope}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Precio Base</p>
                      <p className="text-2xl font-black text-gold">S/ {t.defaultPrice.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenEdit(t)} className="p-2 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Crear / Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gold">{editingTreatment ? "Editar Tratamiento" : "Nuevo Tratamiento"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground font-medium">Nombre del Tratamiento *</label>
                <input required name="name" defaultValue={editingTreatment?.name} type="text" placeholder="Ej. Resina Simple" className="w-full p-3 bg-secondary border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none text-foreground" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground font-medium">Categoría *</label>
                  <input required name="category" defaultValue={editingTreatment?.category} type="text" placeholder="Ej. Operatoria" className="w-full p-3 bg-secondary border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none text-foreground" list="categories-list" />
                  <datalist id="categories-list">
                    <option value="Operatoria" />
                    <option value="Endodoncia" />
                    <option value="Ortodoncia" />
                    <option value="Cirugía" />
                    <option value="Rehabilitación" />
                    <option value="Odontopediatría" />
                    <option value="Prevención" />
                  </datalist>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground font-medium">Precio Base (S/) *</label>
                  <input required name="defaultPrice" defaultValue={editingTreatment?.defaultPrice} type="number" step="0.01" min="0" placeholder="0.00" className="w-full p-3 bg-secondary border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none text-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground font-medium">Alcance del Tratamiento</label>
                <select name="scope" defaultValue={editingTreatment?.scope || "TOOTH"} className="w-full p-3 bg-secondary border border-border rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none text-foreground">
                  <option value="TOOTH">Por Diente</option>
                  <option value="FACE">Por Cara Dental</option>
                  <option value="GLOBAL">Global / Arcada Completa</option>
                </select>
                <p className="text-xs text-muted-foreground">Define cómo se aplica este tratamiento en el Odontograma y Presupuesto.</p>
              </div>

              <div className="pt-6">
                <button disabled={loading} type="submit" className="w-full bg-gold text-primary-foreground font-bold py-3 rounded-lg hover:bg-accent transition-colors shadow-md">
                  {loading ? "Guardando..." : "Guardar Tratamiento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
