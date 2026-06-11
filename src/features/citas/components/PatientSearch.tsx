"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
};

export function PatientSearch({ patients }: { patients: Patient[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filtrar pacientes ignorando mayúsculas y minúsculas
  const filteredPatients = patients.filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      p.firstName.toLowerCase().includes(term) ||
      p.lastName.toLowerCase().includes(term) ||
      p.dni.includes(term)
    );
  });

  // Cerrar el desplegable si el usuario hace clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Si no seleccionó ninguno pero escribió algo, podríamos borrar el input
        // Pero si seleccionó uno y borró una letra, ya no coincide
        if (!selectedPatientId) {
          setSearchTerm("");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedPatientId]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Input oculto requerido para enviar el formulario con la Server Action */}
      <input type="hidden" name="patientId" value={selectedPatientId} required />
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Escriba el nombre, apellido o DNI del paciente..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedPatientId(""); // Reseteamos ID si el usuario empieza a escribir
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-foreground focus:outline-none focus:border-gold"
          required={!selectedPatientId} // Solo es obligatorio el input visual si no ha seleccionado ID
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
          {filteredPatients.length > 0 ? (
            <ul className="py-1">
              {filteredPatients.map(p => (
                <li
                  key={p.id}
                  className="px-4 py-2 hover:bg-gold/10 hover:text-gold cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedPatientId(p.id);
                    setSearchTerm(`${p.firstName} ${p.lastName} (${p.dni})`);
                    setIsOpen(false);
                  }}
                >
                  <div className="font-semibold">{p.firstName} {p.lastName}</div>
                  <div className="text-xs text-muted-foreground">DNI: {p.dni}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No se encontraron pacientes
            </div>
          )}
        </div>
      )}
    </div>
  );
}
