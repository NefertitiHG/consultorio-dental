"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Home, Users, CalendarDays, CircleDollarSign, Settings, BookOpen, BarChart3, Shield, LogOut, Package, LayoutDashboard, Inbox } from "lucide-react";
import { useEffect, useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (status === "unauthenticated" || !session) {
    return null;
  }

  const isSuperAdminOrAdmin = isMounted && ((session?.user as any)?.role === "SUPERADMIN" || (session?.user as any)?.role === "ADMIN");

  const allNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Agenda', href: '/citas', icon: CalendarDays },
    { name: 'Pacientes', href: '/pacientes', icon: Users },
    { name: 'Inventario', href: '/inventario', icon: Package },
    { name: 'Tratamientos', href: '/tratamientos', icon: BookOpen },
    { name: 'Finanzas', href: '/finanzas', icon: CircleDollarSign },
    { name: "Buzón", href: "/buzon", icon: Inbox, adminOnly: true },
    { name: "Personal", href: "/configuracion/personal", icon: Shield, adminOnly: true },
  ];

  const navItems = allNavItems.filter(item => !item.adminOnly || isSuperAdminOrAdmin);

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
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive
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

          {/* User Info / Logout */}
          {session && (
            <div className="p-4 border-t border-border mt-auto">
              <div className="flex items-center gap-3 mb-4 px-2">
                {session.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-10 h-10 rounded-full border border-border" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-foreground truncate">{session.user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut size={16} /> Cerrar Sesión
              </button>
            </div>
          )}
        </aside>

        {/* Bottom Navigation para Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-secondary border-t border-border z-50 pb-safe">
          <ul className="flex overflow-x-auto custom-scrollbar items-center h-16 px-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href} className="flex-shrink-0 min-w-[72px]">
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
            <li className="flex-shrink-0 min-w-[72px]">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex flex-col items-center justify-center h-full w-full gap-1 pt-1"
              >
                <LogOut size={24} className="text-red-500" />
                <span className="text-[10px] text-red-500 font-semibold">Salir</span>
              </button>
            </li>
          </ul>
        </nav>
      </>
    );
  }
