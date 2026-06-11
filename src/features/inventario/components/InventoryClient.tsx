"use client";

import { useState } from "react";
import { Plus, Search, AlertTriangle, PackagePlus, Edit2, Trash2, X, Save } from "lucide-react";
import { createInventoryItem, adjustStock, updateInventoryItem, softDeleteInventoryItem } from "../actions";

export function InventoryClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("TODOS");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "TODOS" || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleCreateOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      unit: formData.get("unit") as string,
      minStock: Number(formData.get("minStock")),
      cost: Number(formData.get("cost")),
      initialStock: Number(formData.get("initialStock") || 0)
    };

    if (editingId) {
      const res = await updateInventoryItem(editingId, data);
      if (res.success) {
        setItems(items.map(i => i.id === editingId ? res.data : i));
        setEditingId(null);
      }
    } else {
      const res = await createInventoryItem(data);
      if (res.success) {
        setItems([...items, res.data]);
        setIsFormOpen(false);
      }
    }
    setLoading(false);
  };

  const handleAdjustStock = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));
    if (adjustingId && amount !== 0) {
      const res = await adjustStock(adjustingId, amount);
      if (res.success) {
        setItems(items.map(i => i.id === adjustingId ? res.data : i));
        setAdjustingId(null);
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este ítem del inventario?")) {
      const res = await softDeleteInventoryItem(id);
      if (res.success) {
        setItems(items.filter(i => i.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-secondary/30 p-4 rounded-xl border border-border">
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-secondary border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-gold"
          >
            <option value="TODOS">Todas las Categorías</option>
            <option value="MEDICAMENTO">Medicamentos</option>
            <option value="INSUMO">Insumos Clínicos</option>
            <option value="HERRAMIENTA">Herramientas</option>
          </select>
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Buscar ítem..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-md text-sm outline-none focus:border-gold"
            />
          </div>
        </div>
        <button 
          onClick={() => { setIsFormOpen(true); setEditingId(null); }}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-gold text-primary-foreground px-4 py-2 rounded-md font-semibold hover:bg-accent transition-colors"
        >
          <Plus size={18} /> Nuevo Ítem
        </button>
      </div>

      {(isFormOpen || editingId) && (
        <form onSubmit={handleCreateOrUpdate} className="bg-secondary p-6 rounded-xl border border-border relative animate-in fade-in zoom-in-95">
          <button type="button" onClick={() => { setIsFormOpen(false); setEditingId(null); }} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
          <h3 className="text-xl font-bold text-foreground mb-4">
            {editingId ? "Editar Ítem" : "Añadir al Inventario"}
          </h3>
          
          {(() => {
            const editItem = items.find(i => i.id === editingId);
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Nombre</label>
                  <input required name="name" defaultValue={editItem?.name} type="text" className="w-full bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-gold" placeholder="Ej. Resina A2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Categoría</label>
                  <select required name="category" defaultValue={editItem?.category || "INSUMO"} className="w-full bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-gold">
                    <option value="MEDICAMENTO">Medicamento</option>
                    <option value="INSUMO">Insumo Clínico</option>
                    <option value="HERRAMIENTA">Herramienta / Equipo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Unidad de Medida</label>
                  <select required name="unit" defaultValue={editItem?.unit || "UNIDADES"} className="w-full bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-gold">
                    <option value="UNIDADES">Unidades</option>
                    <option value="CAJAS">Cajas</option>
                    <option value="MILILITROS">Mililitros (ml)</option>
                    <option value="GRAMOS">Gramos (g)</option>
                  </select>
                </div>
                {!editingId && (
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Stock Inicial</label>
                    <input required name="initialStock" type="number" step="0.01" min="0" defaultValue={0} className="w-full bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-gold" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Stock Mínimo (Alerta)</label>
                  <input required name="minStock" defaultValue={editItem?.minStock ?? 5} type="number" step="0.01" min="0" className="w-full bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Costo Unitario (S/)</label>
                  <input required name="cost" defaultValue={editItem?.cost ?? 0} type="number" step="0.01" min="0" className="w-full bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-gold" />
                </div>
                <div className="lg:col-span-3 flex justify-end mt-2">
                  <button type="submit" disabled={loading} className="bg-gold text-primary-foreground px-6 py-2 rounded-md font-bold hover:bg-accent transition-colors flex items-center gap-2">
                    <Save size={18} /> {loading ? "Guardando..." : "Guardar Ítem"}
                  </button>
                </div>
              </div>
            );
          })()}
        </form>
      )}

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Ítem</th>
                <th className="px-4 py-3 font-semibold">Categoría</th>
                <th className="px-4 py-3 font-semibold">Costo (S/)</th>
                <th className="px-4 py-3 font-semibold text-center">Stock Actual</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground">
                    No se encontraron ítems en el inventario.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const isCritical = item.stock <= item.minStock;
                  return (
                    <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground flex items-center gap-2">
                        {isCritical && <AlertTriangle size={16} className="text-red-500" title="Stock Crítico" />}
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <span className="bg-secondary px-2 py-1 rounded text-[10px] uppercase font-bold border border-border">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground font-medium">S/ {item.cost.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {adjustingId === item.id ? (
                          <form onSubmit={handleAdjustStock} className="flex items-center justify-center gap-2">
                            <input autoFocus name="amount" type="number" step="0.01" placeholder="+/- Cant." className="w-20 px-2 py-1 bg-background border border-border rounded text-center text-xs outline-none" required />
                            <button type="submit" className="text-gold hover:text-green-500 p-1"><Save size={14}/></button>
                            <button type="button" onClick={() => setAdjustingId(null)} className="text-muted-foreground hover:text-red-500 p-1"><X size={14}/></button>
                          </form>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <span className={`font-black text-lg ${isCritical ? 'text-red-500' : 'text-green-500'}`}>
                              {item.stock}
                            </span>
                            <span className="text-xs text-muted-foreground">{item.unit}</span>
                            <button onClick={() => setAdjustingId(item.id)} title="Ajustar Stock" className="p-1.5 bg-secondary hover:bg-gold/20 hover:text-gold text-muted-foreground rounded transition-colors ml-2">
                              <PackagePlus size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => { setEditingId(item.id); setIsFormOpen(false); setAdjustingId(null); }} className="p-1.5 text-muted-foreground hover:text-gold transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
