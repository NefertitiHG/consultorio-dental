import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getLoginLogs } from "@/features/configuracion/actions";
import { Activity, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function AccesosPage() {
  const session = await getServerSession(authOptions);
  
  // Protección estricta: Solo SUPERADMIN
  if (!session || (session.user as any).role !== "SUPERADMIN") {
    redirect("/dashboard");
  }

  const result = await getLoginLogs();
  const logs = result.success && result.data ? result.data.logs : [];
  const totalLogs = result.success && result.data ? result.data.totalLogs : 0;

  return (
    <div className="p-4 md:p-6 w-full max-w-5xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard" className="p-2 bg-secondary text-muted-foreground hover:text-gold hover:bg-gold/10 rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gold flex items-center gap-2">
            <ShieldAlert size={28} />
            Registro de Accesos
          </h1>
          <p className="text-muted-foreground mt-1">
            Auditoría de inicios de sesión en el sistema
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-secondary/20 p-6 rounded-xl border border-border flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 text-blue-500 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Histórico</p>
            <p className="text-2xl font-bold text-foreground">{totalLogs} Inicios</p>
          </div>
        </div>
      </div>

      <div className="bg-background border border-border rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary font-bold text-foreground">
          Últimos 50 Accesos
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-muted-foreground">
            <thead className="text-xs text-foreground uppercase bg-secondary/50 border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-3">Fecha y Hora</th>
                <th scope="col" className="px-6 py-3">Usuario</th>
                <th scope="col" className="px-6 py-3">Rol</th>
                <th scope="col" className="px-6 py-3">Evento</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="bg-background border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">
                    {format(new Date(log.createdAt), "dd 'de' MMMM, yyyy - HH:mm", { locale: es })}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {log.user.name} <span className="text-xs font-normal text-muted-foreground ml-1">({log.user.email})</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${log.user.role === 'SUPERADMIN' ? 'bg-purple-500/20 text-purple-500' : 'bg-green-500/20 text-green-500'}`}>
                      {log.user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-500 font-medium">Login Exitoso</span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No hay registros disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
