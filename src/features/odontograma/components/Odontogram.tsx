"use client";

import React, { useState } from "react";
import { Tooth, ToothFace, ToothCondition, ToothState } from "./Tooth";
import { Save, Calculator, X } from "lucide-react";
import { generateBudgetPreview } from "@/features/presupuestos/actions";

const UPPER_ARCH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_ARCH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const UPPER_CHILD = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
const LOWER_CHILD = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

export function Odontogram({ patientId, initialData, onSave }: any) {
  const [selectedCondition, setSelectedCondition] = useState<ToothCondition>("CARIES");
  const [showChildTeeth, setShowChildTeeth] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estados del presupuesto
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [budgetItems, setBudgetItems] = useState<any[]>([]);
  const [budgetTotal, setBudgetTotal] = useState(0);
  const [isGeneratingBudget, setIsGeneratingBudget] = useState(false);
  
  const [teethState, setTeethState] = useState<ToothState[]>(() => {
    const allTeethNums = [...UPPER_ARCH, ...LOWER_ARCH, ...UPPER_CHILD, ...LOWER_CHILD];
    const defaultTeeth = allTeethNums.map(id => ({
      id,
      faces: { top: "SANO", right: "SANO", bottom: "SANO", left: "SANO", center: "SANO", root: "SANO" }
    }));

    if (initialData && initialData.length > 0) {
      // Fusionar datos de BD con la estructura por defecto para asegurar que no falte ningún diente ni cara
      return defaultTeeth.map(defTooth => {
        const found = initialData.find((t: any) => t.id === defTooth.id);
        if (found) {
          return {
            ...defTooth,
            ...found,
            faces: { ...defTooth.faces, ...found.faces }
          };
        }
        return defTooth;
      }) as ToothState[];
    }
    
    return defaultTeeth as ToothState[];
  });

  const handleFaceClick = (toothId: number, face: ToothFace) => {
    setTeethState(prev => prev.map(tooth => {
      if (tooth.id === toothId) {
        // Toggle (Desmarcar)
        if (selectedCondition !== "SANO" && tooth.faces[face] === selectedCondition) {
          const faces = { ...tooth.faces, [face]: "SANO" };
          return { ...tooth, faces };
        }

        // Reglas
        if (["EXTRACCION", "AUSENTE", "CORONA", "BRACKET", "IMPLANTE", "PERNO", "ENDODONCIA"].includes(selectedCondition)) {
          // Si es raíz (Endo, Implante, Perno)
          if (["ENDODONCIA", "IMPLANTE", "PERNO"].includes(selectedCondition)) {
            return { ...tooth, faces: { ...tooth.faces, root: selectedCondition } };
          }
          // Si es total
          return {
            ...tooth,
            faces: { top: "SANO", right: "SANO", bottom: "SANO", left: "SANO", center: selectedCondition, root: selectedCondition }
          };
        }
        
        return {
          ...tooth,
          faces: { ...tooth.faces, [face]: selectedCondition }
        };
      }
      return tooth;
    }));
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    await onSave(teethState);
    setIsSaving(false);
  };

  const handleGenerateBudget = async () => {
    setIsGeneratingBudget(true);
    const res = await generateBudgetPreview(teethState);
    if (res.success && res.data) {
      setBudgetTotal(res.data.total);
      setBudgetItems(res.data.items);
      setIsBudgetOpen(true);
    }
    setIsGeneratingBudget(false);
  };

  // Agrupación de Herramientas
  const toolGroups = [
    {
      title: "General",
      items: [
        { label: "Borrar/Sano", value: "SANO", color: "bg-white border" },
        { label: "Ausente", value: "AUSENTE", color: "bg-gray-300" },
      ]
    },
    {
      title: "Operativa",
      items: [
        { label: "Caries", value: "CARIES", color: "bg-red-500" },
        { label: "Resina", value: "RESINA", color: "bg-blue-500" },
        { label: "Amalgama", value: "AMALGAMA", color: "bg-slate-500" },
        { label: "Sellante", value: "SELLANTE", color: "bg-emerald-500" },
      ]
    },
    {
      title: "Cirugía y Prótesis",
      items: [
        { label: "Extracción", value: "EXTRACCION", color: "bg-black" },
        { label: "Endodoncia", value: "ENDODONCIA", color: "bg-red-500" },
        { label: "Corona", value: "CORONA", color: "bg-yellow-500" },
        { label: "Implante", value: "IMPLANTE", color: "bg-stone-500" },
        { label: "Perno", value: "PERNO", color: "bg-orange-500" },
        { label: "Bracket", value: "BRACKET", color: "bg-stone-400" },
      ]
    }
  ];

  return (
    <div className="w-full relative">
      
      {/* Panel Superior: Herramientas Agrupadas */}
      <div className="bg-background border-b border-border p-4">
        <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
          <h2 className="text-lg font-bold text-gold">Herramientas Clínicas</h2>
          <label className="flex items-center gap-2 text-sm cursor-pointer border border-border px-3 py-1.5 rounded hover:bg-secondary">
            <input type="checkbox" checked={showChildTeeth} onChange={(e) => setShowChildTeeth(e.target.checked)} className="accent-gold" />
            Mostrar Temporales
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {toolGroups.map(group => (
            <div key={group.title} className="bg-secondary/50 rounded-md p-3 border border-border/50">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map(cond => (
                  <button
                    key={cond.value}
                    onClick={() => setSelectedCondition(cond.value as ToothCondition)}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-xs border transition-all ${
                      selectedCondition === cond.value ? "border-gold bg-gold/10 text-gold shadow-[0_0_8px_rgba(212,175,55,0.2)]" : "border-border bg-background hover:border-gold/50"
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${cond.color}`}></span>
                    {cond.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área del Odontograma */}
      <div className="w-full overflow-x-auto bg-[#0a0a0a] p-4 lg:p-8 custom-scrollbar relative flex justify-center">
        <div className="flex flex-col gap-10 items-center">
          
          <div className="flex gap-1.5 flex-wrap justify-center">
            {UPPER_ARCH.map(num => (
              <Tooth key={num} number={num} isUpper={true} state={teethState.find(t => t.id === num)!} onFaceClick={handleFaceClick} />
            ))}
          </div>

          {showChildTeeth && (
            <div className="flex gap-1.5 mt-[-15px] opacity-90 scale-90 justify-center">
              {UPPER_CHILD.map(num => (
                <Tooth key={num} number={num} isUpper={true} state={teethState.find(t => t.id === num)!} onFaceClick={handleFaceClick} />
              ))}
            </div>
          )}

          <div className="w-full max-w-4xl h-px bg-border my-2 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-[10px] text-muted-foreground tracking-widest border border-border rounded-full">LÍNEA MEDIA</div>
          </div>

          {showChildTeeth && (
            <div className="flex gap-1.5 mb-[-15px] opacity-90 scale-90 justify-center">
              {LOWER_CHILD.map(num => (
                <Tooth key={num} number={num} isUpper={false} state={teethState.find(t => t.id === num)!} onFaceClick={handleFaceClick} />
              ))}
            </div>
          )}

          <div className="flex gap-1.5 flex-wrap justify-center">
            {LOWER_ARCH.map(num => (
              <Tooth key={num} number={num} isUpper={false} state={teethState.find(t => t.id === num)!} onFaceClick={handleFaceClick} />
            ))}
          </div>

        </div>
      </div>

      {/* Botones */}
      <div className="bg-background border-t border-border p-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground hidden sm:block">
          * Doble clic con herramienta activa = Borrar estado
        </div>
        <div className="flex gap-4 w-full sm:w-auto justify-end">
          <button 
            onClick={handleGenerateBudget}
            disabled={isGeneratingBudget}
            className="flex items-center gap-2 bg-secondary border border-border text-foreground px-4 py-2 rounded-md hover:border-gold transition-colors"
          >
            <Calculator size={18} />
            {isGeneratingBudget ? "Calculando..." : "Presupuesto"}
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving || !onSave}
            className="flex items-center gap-2 bg-gold text-primary-foreground px-6 py-2 rounded-md font-bold hover:bg-accent transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            Guardar
          </button>
        </div>
      </div>

      {/* MODAL DE PRESUPUESTO */}
      {isBudgetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-secondary border-b border-border p-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-gold">
                <Calculator size={20} />
                <h3 className="font-bold text-lg">Cotización Estimada</h3>
              </div>
              <button onClick={() => setIsBudgetOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="max-h-[300px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {budgetItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No hay tratamientos marcados que generen costo.</p>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase border-b border-border">
                      <tr>
                        <th className="py-2">Diente</th>
                        <th className="py-2">Tratamiento</th>
                        <th className="py-2 text-right">Costo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-border/50">
                          <td className="py-3 font-medium text-foreground">{item.tooth} ({item.face})</td>
                          <td className="py-3 text-muted-foreground">{item.treatment}</td>
                          <td className="py-3 text-right font-medium">S/ {item.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              
              <div className="bg-secondary rounded-lg p-4 flex justify-between items-center border border-border">
                <span className="text-lg font-medium text-foreground">Total Estimado</span>
                <span className="text-2xl font-bold text-gold">S/ {budgetTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-secondary/50 border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsBudgetOpen(false)} className="px-4 py-2 border border-border rounded text-sm hover:bg-secondary">
                Cerrar
              </button>
              <button className="px-4 py-2 bg-gold text-primary-foreground rounded text-sm font-bold shadow-md hover:bg-accent transition-colors">
                Crear Documento Formal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
