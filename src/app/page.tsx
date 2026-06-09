export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gold">
          Consultorio Dental
        </h1>
        <p className="text-lg text-foreground max-w-2xl">
          Sistema de gestión (ERP) premium. Esta es la vista inicial de prueba para verificar nuestra paleta de colores.
        </p>
        
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-md bg-gold text-primary-foreground font-semibold hover:bg-accent transition-colors">
            Iniciar Sesión
          </button>
          <button className="px-6 py-3 rounded-md border border-gold text-gold font-semibold hover:bg-secondary transition-colors">
            Contactar Soporte
          </button>
        </div>
      </main>

      <footer className="mt-20 text-sm text-muted-foreground">
        © 2026 Clínica Dental. Todos los derechos reservados.
      </footer>
    </div>
  );
}
