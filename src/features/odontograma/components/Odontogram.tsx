"use client";

import React, { useState } from "react";
import { Tooth, ToothFace, ToothCondition, ToothState } from "./Tooth";
import { Save } from "lucide-react";

const UPPER_ARCH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_ARCH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const UPPER_CHILD = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
const LOWER_CHILD = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

export function Odontogram({ patientId, initialData, onSave }: any) {
  const [selectedCondition, setSelectedCondition] = useState<ToothCondition>("CARIES");
  const [showChildTeeth, setShowChildTeeth] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [teethState, setTeethState] = useState<ToothState[]>(() => {
    const allTeethNums = [...UPPER_ARCH, ...LOWER_ARCH, ...UPPER_CHILD, ...LOWER_CHILD];
    const defaultTeeth = allTeethNums.map(id => ({
      id,
      faces: { top: "SANO", right: "SANO", bottom: "SANO", left: "SANO", center: "SANO", root: "SANO" }
    }));

    if (initialData && initialData.length > 0) {
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
        
        // Regla especial para la herramienta SANO o Desmarcar doble clic
        const isRemoving = selectedCondition === "SANO" || tooth.faces[face] === selectedCondition;
        
        if (isRemoving) {
          // Si es una condición que afecta a todo el diente, borramos todo
          if (["EXTRACCION", "AUSENTE", "CORONA"].includes(tooth.faces.center) || tooth.faces.root === "EXTRACCION") {
            return {
              ...tooth,
              faces: { top: "SANO", right: "SANO", bottom: "SANO", left: "SANO", center: "SANO", root: "SANO" }
            };
          }
          // Sino, borramos solo la cara afectada
          return {
            ...tooth,
            faces: { ...tooth.faces, [face]: "SANO" }
          };
        }

        // Reglas para aplicar condiciones
        if (["EXTRACCION", "AUSENTE", "CORONA", "BRACKET", "IMPLANTE", "PERNO", "ENDODONCIA"].includes(selectedCondition)) {
          if (["ENDODONCIA", "IMPLANTE", "PERNO"].includes(selectedCondition)) {
            return { ...tooth, faces: { ...tooth.faces, root: selectedCondition } };
          }
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

      <div className="bg-background border-t border-border p-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground hidden sm:block">
          * Doble clic con herramienta activa o herramienta "Borrar/Sano" = Borrar estado
        </div>
        <div className="flex gap-4 w-full sm:w-auto justify-end">
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

    </div>
  );
}
