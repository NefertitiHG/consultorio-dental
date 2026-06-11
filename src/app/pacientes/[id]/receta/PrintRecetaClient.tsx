"use client";

import { useEffect } from "react";

export function PrintRecetaClient() {
  useEffect(() => {
    // Escondemos barras de scroll temporalmente para la impresión
    document.body.style.overflow = 'auto';
    document.body.style.backgroundColor = 'white';
    
    // Disparamos la impresión automáticamente después de renderizar
    setTimeout(() => {
      window.print();
    }, 500);

    return () => {
      document.body.style.overflow = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  return null;
}
