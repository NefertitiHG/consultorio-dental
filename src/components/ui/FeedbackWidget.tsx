"use client";

import React from "react";
import { MessageSquarePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { createSuggestion } from "@/features/feedback/actions";

export function FeedbackWidget() {
  const { data: session } = useSession();

  // Si no hay sesión, no mostrar el widget
  if (!session?.user) return null;

  const handleClick = async () => {
    const { value: text } = await Swal.fire({
      title: 'Buzón de Sugerencias',
      input: 'textarea',
      inputLabel: '¿Tienes alguna idea o problema? Escríbenos tu mensaje y el administrador lo revisará a la brevedad.',
      inputPlaceholder: 'Escribe tu mensaje aquí...',
      inputAttributes: {
        'aria-label': 'Escribe tu mensaje aquí'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar Mensaje',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#D4AF37',
      cancelButtonColor: '#6B7280',
      background: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
    });

    if (text) {
      const result = await createSuggestion(session.user.id as string, text);
      
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "¡Mensaje Enviado!",
          text: "Tu sugerencia ha sido enviada exitosamente al administrador.",
          confirmButtonColor: '#D4AF37',
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
    }
  };

  return (
    <button
      onClick={handleClick}
      title="Enviar Sugerencia o Reporte"
      className="fixed bottom-20 md:bottom-8 right-4 md:right-8 bg-gold hover:bg-yellow-600 text-primary-foreground p-4 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:-translate-y-1 transition-all z-50 flex items-center justify-center group"
    >
      <MessageSquarePlus size={28} />
      
      {/* Tooltip on hover (only visible on desktop) */}
      <span className="absolute right-full mr-4 bg-secondary text-foreground text-sm font-semibold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block shadow-lg border border-border">
        ¿Tienes una sugerencia?
      </span>
    </button>
  );
}
