"use client";

import React, { useState } from "react";
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

export function WeeklyCalendar({ initialAppointments }: { initialAppointments: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Lunes
  const weekDays = Array.from({ length: 6 }).map((_, i) => addDays(startDate, i)); // Lunes a Sábado

  // Mostrar desde las 8 AM hasta las 9 PM (14 horas)
  const hours = Array.from({ length: 14 }).map((_, i) => i + 8);

  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));

  return (
    <div className="bg-background border border-border rounded-xl shadow-lg overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-border bg-secondary flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={prevWeek} className="p-2 hover:bg-muted rounded-full transition-colors text-foreground">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-gold capitalize w-48 text-center">
            {format(currentDate, "MMMM yyyy", { locale: es })}
          </h2>
          <button onClick={nextWeek} className="p-2 hover:bg-muted rounded-full transition-colors text-foreground">
            <ChevronRight size={20} />
          </button>
        </div>
        <Link href="/citas/nueva" className="flex items-center gap-2 bg-gold text-primary-foreground px-4 py-2 rounded-md font-bold hover:bg-accent transition-colors">
          <Plus size={18} />
          <span className="hidden md:inline">Nueva Cita</span>
        </Link>
      </div>

      {/* Grid del Calendario */}
      <div className="flex-1 overflow-x-auto custom-scrollbar flex">
        
        {/* Columna de Horas */}
        <div className="w-16 md:w-20 border-r border-border bg-secondary/30 flex-shrink-0">
          <div className="h-14 border-b border-border"></div> {/* Espacio para cabecera de días */}
          {hours.map(hour => (
            <div key={hour} className="h-20 border-b border-border text-center pt-2 text-xs text-muted-foreground font-medium">
              {hour}:00
            </div>
          ))}
        </div>

        {/* Columnas de Días */}
        <div className="flex flex-1 min-w-[600px]">
          {weekDays.map((day, i) => {
            const isToday = isSameDay(day, new Date());
            
            return (
              <div key={i} className="flex-1 border-r border-border border-dashed min-w-[120px]">
                {/* Cabecera del Día */}
                <div className={`h-14 border-b border-border flex flex-col items-center justify-center sticky top-0 bg-background z-10 ${isToday ? "border-b-gold" : ""}`}>
                  <span className="text-xs uppercase text-muted-foreground font-semibold">
                    {format(day, "EEEE", { locale: es })}
                  </span>
                  <span className={`text-lg font-bold ${isToday ? "text-gold" : "text-foreground"}`}>
                    {format(day, "d")}
                  </span>
                </div>

                {/* Slots de Horas */}
                <div className="relative">
                  {hours.map(hour => {
                    const slotDate = format(day, "yyyy-MM-dd");
                    const slotTime = `${hour.toString().padStart(2, '0')}:00`;
                    return (
                      <Link 
                        key={hour} 
                        href={`/citas/nueva?date=${slotDate}&time=${slotTime}`}
                        className="block h-20 border-b border-border border-dashed hover:bg-gold/10 hover:border-gold transition-colors cursor-pointer"
                      >
                        <span className="sr-only">Agendar a las {hour}:00</span>
                      </Link>
                    );
                  })}

                  {/* Renderizado de Citas */}
                  {initialAppointments
                    .filter(app => isSameDay(new Date(app.date), day))
                    .map(app => {
                      const appDate = new Date(app.date);
                      const top = (appDate.getHours() - 8) * 80 + (appDate.getMinutes() / 60) * 80;
                      // 80px equivalen a 60 minutos (1 hora)
                      const height = ((app.durationMins || 30) / 60) * 80;

                      return (
                        <Link 
                          key={app.id}
                          href={`/citas/${app.id}/editar`}
                          className="absolute left-1 right-1 bg-gold/10 border border-gold rounded p-2 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer z-20 group"
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <p className="text-xs font-bold text-gold truncate">
                            {appDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute:'2-digit' })}
                          </p>
                          <p className="text-sm font-semibold text-foreground truncate">
                            {app.patient.firstName} {app.patient.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{app.notes || "Sin notas"}</p>
                        </Link>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
