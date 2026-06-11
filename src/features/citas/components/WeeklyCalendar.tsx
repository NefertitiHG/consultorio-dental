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
                          <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-gold truncate flex-1">
                              {appDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute:'2-digit' })}
                            </p>
                            
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (app.patient.phone) {
                                  const formattedDate = appDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
                                  const formattedTime = appDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute:'2-digit' });
                                  const msg = encodeURIComponent(`Hola ${app.patient.firstName}, te recordamos tu cita odontológica para el día ${formattedDate} a las ${formattedTime}. ¡Te esperamos!`);
                                  window.open(`https://wa.me/${app.patient.phone.replace(/\\D/g, '')}?text=${msg}`, '_blank');
                                } else {
                                  import('sweetalert2').then(Swal => {
                                    Swal.default.fire('Sin teléfono', 'Este paciente no tiene un número registrado.', 'warning');
                                  });
                                }
                              }}
                              className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-sm ml-1 opacity-80 hover:opacity-100"
                              title="Enviar recordatorio por WhatsApp"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            </button>
                          </div>
                          
                          <p className="text-sm font-semibold text-foreground truncate mt-1">
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
