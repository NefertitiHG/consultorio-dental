"use client";

import React, { useState, useEffect } from "react";
import { MessageSquarePlus, X, Send, History, CheckCircle2, Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { createSuggestion, getUserSuggestions, markAsRead } from "@/features/feedback/actions";

export function FeedbackWidget() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // Cargar historial y chequear notificaciones no leídas
  const loadData = async () => {
    if (!session?.user?.id) return;
    const result = await getUserSuggestions(session.user.id as string);
    if (result.success && result.data) {
      setHistory(result.data);

      // Buscar si hay alguna resuelta no leída
      const unread = result.data.filter(s => s.status === "RESOLVED" && !s.isRead);
      for (const item of unread) {
        await Swal.fire({
          icon: 'info',
          title: 'Respuesta del Administrador',
          text: item.response || 'Tu sugerencia ha sido atendida.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#D4AF37',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
        });
        await markAsRead(item.id);
      }
      
      // Si hubo alguna no leída, recargamos el historial en background para actualizar el estado isRead
      if (unread.length > 0) {
        const updated = await getUserSuggestions(session.user.id as string);
        if (updated.success && updated.data) setHistory(updated.data);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [session?.user?.id]);

  if (!session?.user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);

    const result = await createSuggestion(session.user.id as string, message);
    if (result.success) {
      setMessage("");
      loadData(); // Recargar historial
      Swal.fire({
        icon: "success",
        title: "¡Mensaje Enviado!",
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.error || "Hubo un problema al enviar tu mensaje.",
        confirmButtonColor: '#D4AF37',
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
      });
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-4 md:right-8 bg-gold hover:bg-yellow-600 text-primary-foreground p-4 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:-translate-y-1 transition-all z-40 flex items-center justify-center group"
      >
        <MessageSquarePlus size={28} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b border-border bg-secondary/50">
              <h3 className="font-bold text-lg flex items-center gap-2"><MessageSquarePlus size={20} className="text-gold"/> Buzón de Sugerencias</h3>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-background transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
              
              {/* Formulario */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">¿Tienes alguna idea o problema? Escríbenos y el administrador lo revisará a la brevedad.</p>
                <form onSubmit={handleSubmit}>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3} 
                    required
                    placeholder="Escribe tu mensaje aquí..." 
                    className="w-full bg-secondary border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-gold mb-2"
                  ></textarea>
                  <button disabled={loading} type="submit" className="w-full flex items-center justify-center gap-2 bg-gold text-primary-foreground font-semibold py-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50">
                    <Send size={16} /> {loading ? "Enviando..." : "Enviar Mensaje"}
                  </button>
                </form>
              </div>

              {/* Historial */}
              {history.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-4"><History size={16} className="text-muted-foreground"/> Historial de Mensajes</h4>
                  <div className="space-y-3">
                    {history.map(item => (
                      <div key={item.id} className="bg-secondary/30 border border-border rounded-lg p-3 text-sm">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-foreground line-clamp-2 pr-2">{item.message}</p>
                          {item.status === "RESOLVED" ? (
                            <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                          ) : (
                            <Clock size={16} className="text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        {item.status === "RESOLVED" && item.response && (
                          <div className="bg-gold/10 border border-gold/20 p-2 rounded text-xs mt-2">
                            <span className="font-bold text-gold block mb-1">Respuesta:</span>
                            <p className="text-foreground">{item.response}</p>
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-2 text-right">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      )}
    </>
  );
}
