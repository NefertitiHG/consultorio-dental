"use client";

import React from "react";

export type ToothFace = "top" | "bottom" | "left" | "right" | "center" | "root";
// Procedimientos por cara/diente
export type ToothCondition = "SANO" | "CARIES" | "RESINA" | "AMALGAMA" | "SELLANTE" | "ENDODONCIA" | "EXTRACCION" | "CORONA" | "AUSENTE" | "BRACKET" | "IMPLANTE" | "PERNO";

export interface ToothState {
  id: number;
  faces: Record<ToothFace, ToothCondition>;
}

interface ToothProps {
  number: number;
  state: ToothState;
  onFaceClick: (toothId: number, face: ToothFace) => void;
  isUpper: boolean;
}

const CONDITION_COLORS: Record<ToothCondition, string> = {
  SANO: "transparent",
  CARIES: "#ef4444",      // Rojo
  RESINA: "#3b82f6",      // Azul
  AMALGAMA: "#64748b",    // Gris pizarra
  SELLANTE: "#10b981",    // Verde
  ENDODONCIA: "#ef4444",  // Rojo
  EXTRACCION: "#000000",  // Negro (Cruz)
  CORONA: "#D4AF37",      // Dorado
  AUSENTE: "#d1d5db",     // Gris claro
  BRACKET: "#a8a29e",     // Gris piedra
  IMPLANTE: "#78716c",    // Gris oscuro
  PERNO: "#fb923c",       // Naranja
};

export function Tooth({ number, state, onFaceClick, isUpper }: ToothProps) {
  const renderFace = (face: ToothFace, d: string, type: "crown" | "root") => {
    const condition = state.faces[face] || "SANO";
    const color = CONDITION_COLORS[condition];
    const fill = color === "transparent" ? "#ffffff" : color;

    return (
      <path
        d={d}
        fill={fill}
        stroke="#1C1C1C"
        strokeWidth="1.5"
        className="cursor-pointer hover:opacity-70 transition-opacity"
        onClick={() => onFaceClick(number, face)}
      />
    );
  };

  const isExtracted = state.faces.center === "EXTRACCION" || state.faces.root === "EXTRACCION";
  const isAbsent = state.faces.center === "AUSENTE";
  const isCrown = state.faces.center === "CORONA";

  // Dientes anteriores (incisivos/caninos) tienen 1 raíz. Posteriores tienen 2 o 3.
  // Simplificaremos dibujando una raíz estilizada (polígono) y la corona (círculo FDI).
  
  // paths para el círculo FDI (Corona) centrado en (25, 25) con radio 15
  const crownPaths = {
    top: "M 14.39 14.39 A 15 15 0 0 1 35.61 14.39 L 30 20 A 7 7 0 0 0 20 20 Z",
    right: "M 35.61 14.39 A 15 15 0 0 1 35.61 35.61 L 30 30 A 7 7 0 0 0 30 20 Z",
    bottom: "M 14.39 35.61 A 15 15 0 0 0 35.61 35.61 L 30 30 A 7 7 0 0 1 20 30 Z",
    left: "M 14.39 14.39 A 15 15 0 0 0 14.39 35.61 L 20 30 A 7 7 0 0 1 20 20 Z",
    center: "M 25 18 A 7 7 0 1 0 25 32 A 7 7 0 1 0 25 18 Z", // Centro
  };

  // Raíz: hacia arriba si es isUpper, hacia abajo si no.
  const rootPath = isUpper 
    ? "M 18 10 C 18 -5, 32 -5, 32 10 Z" // Raíz arriba
    : "M 18 40 C 18 55, 32 55, 32 40 Z"; // Raíz abajo

  return (
    <div className="flex flex-col items-center gap-1 w-[46px]">
      <span className="text-xs font-bold text-foreground bg-secondary/80 px-1.5 py-0.5 rounded shadow-sm">{number}</span>
      <svg width="50" height="70" viewBox="0 -10 50 70" className={`relative ${isAbsent ? 'opacity-20' : ''}`}>
        
        {/* Raíz */}
        {!isExtracted && !isCrown && renderFace("root", rootPath, "root")}

        {/* Corona Completa si es CORONA */}
        {!isExtracted && isCrown && (
          <circle cx="25" cy="25" r="16" fill="#D4AF37" stroke="#1C1C1C" strokeWidth="1.5" onClick={() => onFaceClick(number, "center")} className="cursor-pointer" />
        )}

        {/* Implante */}
        {!isExtracted && state.faces.root === "IMPLANTE" && (
           <rect x="20" y={isUpper ? -5 : 55} width="10" height="20" fill="#78716c" stroke="#1C1C1C" />
        )}

        {/* Perno */}
        {!isExtracted && state.faces.root === "PERNO" && (
           <line x1="25" y1={isUpper ? 5 : 45} x2="25" y2={isUpper ? 20 : 30} stroke="#fb923c" strokeWidth="4" />
        )}

        {/* Caras FDI de la Corona */}
        {!isExtracted && !isCrown && (
          <>
            {renderFace("top", crownPaths.top, "crown")}
            {renderFace("right", crownPaths.right, "crown")}
            {renderFace("bottom", crownPaths.bottom, "crown")}
            {renderFace("left", crownPaths.left, "crown")}
            {renderFace("center", crownPaths.center, "crown")}
          </>
        )}

        {/* Extracción (X Roja grande) */}
        {isExtracted && (
          <>
            <line x1="10" y1="5" x2="40" y2="45" stroke="#ef4444" strokeWidth="4" />
            <line x1="40" y1="5" x2="10" y2="45" stroke="#ef4444" strokeWidth="4" />
          </>
        )}

        {/* Brackets */}
        {state.faces.center === "BRACKET" && (
          <rect x="19" y="19" width="12" height="12" rx="2" fill="none" stroke="#a8a29e" strokeWidth="3" className="pointer-events-none" />
        )}
      </svg>
    </div>
  );
}
