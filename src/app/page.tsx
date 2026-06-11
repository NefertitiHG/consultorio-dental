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
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute bottom-[0%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      <main className="relative z-10 w-full max-w-md p-10 bg-secondary/30 backdrop-blur-md border border-border rounded-3xl shadow-2xl flex flex-col items-center text-center mx-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center mb-6 shadow-lg shadow-gold/20">
          <span className="text-primary-foreground font-black text-5xl">C</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">
          Consultorio Dental
        </h1>
        <p className="text-muted-foreground mb-10 text-sm leading-relaxed">
          Plataforma de gestión clínica inteligente. <br/> Inicia sesión para continuar.
        </p>
        
        <div className="w-full">
          <LoginButton />
        </div>
      </main>

      <footer className="absolute bottom-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Clínica Dental. Todos los derechos reservados.
      </footer>
    </div>
  );
}
