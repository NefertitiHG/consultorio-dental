"use client";

import { useState } from "react";
import { inviteUser, deleteUser } from "../actions";
import { Users, Shield, ShieldAlert, Trash2, Plus, Mail } from "lucide-react";

export function UserList({ initialUsers }: { initialUsers: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("DOCTOR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await inviteUser(email, role);
    if (res.success) {
      setIsModalOpen(false);
      setEmail("");
      setRole("DOCTOR");
    } else {
      setError(res.error || "Error al invitar.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este acceso? El usuario ya no podrá iniciar sesión.")) {
      await deleteUser(id);
    }
  };

  const RoleBadge = ({ role }: { role: string }) => {
    switch(role) {
      case "SUPERADMIN": return <span className="px-2 py-1 bg-gold/20 text-gold text-xs rounded-full font-bold">Dueño / Superadmin</span>;
      case "ADMIN": return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-bold">Administrador</span>;
      case "ASSISTANT": return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-bold">Asistente</span>;
      default: return <span className="px-2 py-1 bg-zinc-500/20 text-zinc-300 text-xs rounded-full font-bold">Doctor(a)</span>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Users size={20} className="text-gold" /> Personal Autorizado
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gold text-primary-foreground font-bold px-4 py-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Invitar Personal
        </button>
      </div>

      <div className="bg-secondary/20 rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/50 text-muted-foreground text-sm border-b border-border">
              <th className="p-4 font-semibold">Usuario</th>
              <th className="p-4 font-semibold">Correo de Acceso (Google)</th>
              <th className="p-4 font-semibold">Rol / Permisos</th>
              <th className="p-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {initialUsers.map((user) => (
              <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-semibold text-foreground">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{user.email}</td>
                <td className="p-4"><RoleBadge role={user.role} /></td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Revocar Acceso"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {initialUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-foreground mb-4">Pre-registrar Nuevo Personal</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Ingresa el correo electrónico de Google que la persona utilizará para iniciar sesión. Una vez registrado, podrá entrar automáticamente.
            </p>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-sm font-semibold flex items-center gap-2 mb-1"><Mail size={16} className="text-gold"/> Correo de Google</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@gmail.com"
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-gold" 
                />
              </div>

              <div>
                <label className="text-sm font-semibold flex items-center gap-2 mb-1"><Shield size={16} className="text-gold"/> Nivel de Acceso</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-gold"
                >
                  <option value="DOCTOR">Doctor(a) - Puede ver y atender pacientes</option>
                  <option value="ASSISTANT">Asistente - Puede agendar citas y cobrar</option>
                  <option value="ADMIN">Administrador - Acceso total excepto configuraciones</option>
                  <option value="SUPERADMIN">Dueño / Superadmin - Acceso Absoluto</option>
                </select>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-start gap-2">
                  <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gold text-primary-foreground font-bold px-4 py-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {loading ? "Registrando..." : "Autorizar Correo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
