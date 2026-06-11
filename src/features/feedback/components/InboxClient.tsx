"use client";

import React, { useState } from "react";
import { resolveSuggestion } from "@/features/feedback/actions";
import { Inbox, CheckCircle2, MessageSquare, Clock, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";

export function InboxClient({ suggestions }: { suggestions: any[] }) {
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "RESOLVED">("ALL");

  const filtered = suggestions.filter(s => filter === "ALL" || s.status === filter);

  const handleResolve = async (id: string) => {
    const { value: responseText } = await Swal.fire({
      title: 'Responder Mensaje',
      input: 'textarea',
      inputLabel: 'Escribe tu respuesta o resolución para el usuario.',
      inputPlaceholder: 'Tu respuesta...',
      showCancelButton: true,
      confirmButtonText: 'Marcar como Atendido',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#D4AF37',
      background: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
    });

    if (responseText !== undefined) {
      const result = await resolveSuggestion(id, responseText);
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Atendido",
          text: "El mensaje ha sido respondido y archivado.",
          confirmButtonColor: '#D4AF37',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el estado.",
          confirmButtonColor: '#D4AF37',
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex gap-2">
        <button 
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${filter === "ALL" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50"}`}
        >
          Todos
        </button>
        <button 
          onClick={() => setFilter("PENDING")}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 ${filter === "PENDING" ? "bg-yellow-500/20 text-yellow-500" : "text-muted-foreground hover:bg-secondary/50"}`}
        >
          <Clock size={16} /> Pendientes
        </button>
        <button 
          onClick={() => setFilter("RESOLVED")}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 ${filter === "RESOLVED" ? "bg-green-500/20 text-green-500" : "text-muted-foreground hover:bg-secondary/50"}`}
        >
          <CheckCircle2 size={16} /> Atendidos
        </button>
      </div>

      {/* Lista de Sugerencias */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="bg-secondary/30 border border-border rounded-xl p-12 text-center flex flex-col items-center">
            <Inbox size={48} className="text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground font-medium">No hay mensajes en esta bandeja.</p>
          </div>
        ) : (
          filtered.map((suggestion) => (
            <div key={suggestion.id} className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground">{suggestion.user.name}</span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{suggestion.user.role}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(suggestion.createdAt).toLocaleString('es-ES')}</p>
                </div>
                
                {suggestion.status === "PENDING" ? (
                  <span className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/20 flex items-center gap-1">
                    <Clock size={12} /> PENDIENTE
                  </span>
                ) : (
                  <span className="bg-green-500/10 text-green-500 text-xs font-bold px-3 py-1 rounded-full border border-green-500/20 flex items-center gap-1">
                    <CheckCircle2 size={12} /> ATENDIDO
                  </span>
                )}
              </div>

              <div className="bg-secondary/30 p-4 rounded-lg mb-4">
                <p className="text-foreground text-sm whitespace-pre-wrap">{suggestion.message}</p>
              </div>

              {suggestion.status === "RESOLVED" && suggestion.response && (
                <div className="bg-gold/5 border border-gold/20 p-4 rounded-lg mt-4 flex gap-3">
                  <ArrowRight size={20} className="text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gold uppercase mb-1">Tu Respuesta:</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{suggestion.response}</p>
                  </div>
                </div>
              )}

              {suggestion.status === "PENDING" && (
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => handleResolve(suggestion.id)}
                    className="flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                  >
                    <MessageSquare size={16} />
                    Responder y Archivar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
