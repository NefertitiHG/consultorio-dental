import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AccesoDenegadoPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-secondary/30 border border-border rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="text-destructive w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Acceso Denegado</h1>
          <p className="text-muted-foreground text-sm">
            Tu cuenta de Google no está autorizada para acceder a esta clínica. 
            Contacta al administrador (Dueño) para que registre tu correo en el sistema antes de iniciar sesión.
          </p>
        </div>

        <div className="pt-4 border-t border-border">
          <Link href="/login" className="text-gold hover:underline font-semibold transition-colors">
            &larr; Volver al Login
          </Link>
        </div>
      </div>
    </div>
  );
}
