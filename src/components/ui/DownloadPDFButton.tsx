"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface DownloadPDFButtonProps {
  targetId: string;
  filename: string;
  buttonText?: string;
}

export function DownloadPDFButton({ targetId, filename, buttonText = "Descargar PDF" }: DownloadPDFButtonProps) {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    const element = document.getElementById(targetId);
    if (!element) {
      alert("No se encontró el contenido a imprimir.");
      return;
    }

    try {
      setLoading(true);
      // Ocultar elementos no deseados si existieran (opcional)
      
      const canvas = await html2canvas(element, {
        scale: 2, // Mejor calidad
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      
      // A4 format: 210 x 297 mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF", error);
      alert("Hubo un problema al generar el PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={generatePDF} 
      disabled={loading}
      className="flex items-center gap-2 bg-gold text-primary-foreground px-4 py-2 rounded-md hover:bg-accent transition-colors font-bold disabled:opacity-50"
    >
      <Download size={18} />
      {loading ? "Generando..." : buttonText}
    </button>
  );
}
