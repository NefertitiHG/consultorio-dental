"use client";

import { useState } from "react";
import { Plus, Paperclip, FileText, UserCircle, Edit2, Trash2, X, Save } from "lucide-react";
import { createEvolution, updateEvolution, softDeleteEvolution } from "@/features/pacientes/actions";

interface Evolution {
  id: string;
  date: Date;
  treatment: string;
  notes: string;
  doctor: {
    name: string | null;
  };
}

export function EvolutionList({ patientId, evolutions, userId }: { patientId: string, evolutions: Evolution[], userId: string }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmitNew = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("patientId", patientId);
    formData.append("userId", userId);
    
    await createEvolution(formData);
    
    setLoading(false);
    setIsFormOpen(false);
  };

  const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>, evolutionId: string) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("patientId", patientId);
    
    await updateEvolution(evolutionId, formData);
    
    setLoading(false);
    setEditingId(null);
  };

  const handleDelete = async (evolutionId: string) => {
    if (confirm("¿Estás seguro de eliminar esta atención?")) {
      await softDeleteEvolution(evolutionId, patientId);
    }
  };

  return (
    <div className="bg-secondary/20 border border-border rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foreground">Historia Clínica / Evoluciones</h2>
        {!isFormOpen && (
          <button 
            onClick={() => {
              setIsFormOpen(true);
              setEditingId(null);
            }} 
            className="flex items-center gap-2 bg-gold/20 text-gold px-3 py-1.5 rounded-md hover:bg-gold/30 transition-colors text-sm font-semibold"
          >
            <Plus size={16} /> Nueva Atención
          </button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmitNew} className="bg-background border border-border p-4 rounded-lg mb-6 space-y-4">
          <input required name="treatment" type="text" placeholder="Tratamiento realizado (ej. Endodoncia Pieza 14)" className="w-full bg-secondary border border-border rounded p-2 focus:border-gold outline-none" />
          <textarea required name="notes" rows={3} placeholder="Notas clínicas, procedimientos..." className="w-full bg-secondary border border-border rounded p-2 focus:border-gold outline-none"></textarea>
          <div className="flex justify-between items-center">
            <div className="relative overflow-hidden inline-block">
              <button type="button" className="text-muted-foreground flex items-center gap-1 hover:text-gold text-sm bg-secondary px-3 py-1.5 rounded border border-border">
                <Paperclip size={16} /> Adjuntar Radiografía / Foto
              </button>
              <input 
                type="file" 
                name="file" 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-border rounded-md text-sm hover:bg-secondary">Cancelar</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-gold text-primary-foreground font-bold rounded-md text-sm">{loading ? "Guardando..." : "Guardar"}</button>
            </div>
          </div>
        </form>
      )}
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {evolutions.length === 0 && !isFormOpen && (
          <div className="text-center py-10 text-muted-foreground">
            No hay atenciones registradas.
          </div>
        )}

        {evolutions.map((evo) => (
          <div key={evo.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-gold text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <FileText size={16} />
            </div>

            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-background p-4 rounded-lg border border-border shadow-sm group-hover:border-gold/50 transition-colors">
              {editingId === evo.id ? (
                <form onSubmit={(e) => handleSubmitEdit(e, evo.id)} className="space-y-3">
                  <input required name="treatment" defaultValue={evo.treatment} type="text" className="w-full bg-secondary border border-border rounded p-2 focus:border-gold outline-none text-sm" />
                  <textarea required name="notes" defaultValue={evo.notes} rows={3} className="w-full bg-secondary border border-border rounded p-2 focus:border-gold outline-none text-sm"></textarea>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setEditingId(null)} className="p-1.5 border border-border rounded-md text-muted-foreground hover:bg-secondary"><X size={16}/></button>
                    <button type="submit" disabled={loading} className="p-1.5 bg-gold text-primary-foreground rounded-md"><Save size={16}/></button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <h3 className="font-bold text-foreground text-lg">{evo.treatment}</h3>
                    <div className="flex items-center gap-3">
                      <time className="text-xs font-semibold text-gold bg-gold/10 px-2 py-1 rounded-full">
                        {new Date(evo.date).toLocaleDateString("es-ES")}
                      </time>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingId(evo.id)} className="p-1 text-muted-foreground hover:text-gold"><Edit2 size={14}/></button>
                        <button onClick={() => handleDelete(evo.id)} className="p-1 text-muted-foreground hover:text-red-500"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 whitespace-pre-wrap">{evo.notes}</p>
                  
                  {/* Visualización de Imágenes Adjuntas */}
                  {(evo as any).attachments && (evo as any).attachments.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {(evo as any).attachments.map((file: any, i: number) => (
                        <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" className="relative block w-20 h-20 rounded-lg border border-border overflow-hidden hover:opacity-80 transition-opacity">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <UserCircle size={16} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Dr(a). {evo.doctor.name || "Especialista"}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
