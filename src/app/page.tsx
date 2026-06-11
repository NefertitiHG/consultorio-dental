import { LoginButton } from "@/components/auth/LoginButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <div className="w-16 h-16 rounded-xl bg-gold flex items-center justify-center mb-4">
          <span className="text-primary-foreground font-bold text-4xl">C</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-gold">
          Consultorio Dental
        </h1>
        <p className="text-lg text-foreground max-w-2xl">
          Sistema de gestión (ERP) premium. Por favor, inicia sesión para acceder a tu agenda y pacientes.
        </p>
        
        <div className="flex gap-4 mt-8">
          <LoginButton />
        </div>
      </main>

      <footer className="mt-20 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Clínica Dental. Todos los derechos reservados.
      </footer>
    </div>
  );
}
