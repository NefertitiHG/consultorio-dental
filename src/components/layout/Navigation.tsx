"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, CalendarDays, CircleDollarSign, Settings } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Citas", href: "/citas", icon: CalendarDays },
    { name: "Pacientes", href: "/pacientes", icon: Users },
    { name: "Finanzas", href: "/contabilidad", icon: CircleDollarSign },
    { name: "Ajustes", href: "/ajustes", icon: Settings },
  ];

  return (
    <>
      {/* Sidebar para Desktop */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-secondary border-r border-border fixed left-0 top-0 pt-6">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gold flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">C</span>
          </div>
          <h2 className="text-xl font-bold text-gold tracking-wide">Clínica ERP</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? "bg-gold text-primary-foreground font-semibold shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                    : "text-foreground hover:bg-muted hover:text-gold"
                }`}
              >
                <Icon size={20} className={isActive ? "text-primary-foreground" : "text-muted-foreground"} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Bottom Navigation para Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-secondary border-t border-border z-50 pb-safe">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className="flex flex-col items-center justify-center h-full w-full gap-1 pt-1"
                >
                  <Icon 
                    size={24} 
                    className={isActive ? "text-gold" : "text-muted-foreground"} 
                  />
                  <span className={`text-[10px] ${isActive ? "text-gold font-semibold" : "text-muted-foreground"}`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
