import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-sm border border-border p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="p-3 bg-primary/10 rounded-xl">
            <FileText className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Términos de Servicio</h1>
        </div>

        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground space-y-6">
          <p>Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar este software de gestión dental, usted acepta estar sujeto a estos Términos de Servicio y a todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido utilizar o acceder a este sitio.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">2. Uso de la Licencia</h2>
          <p>
            Se concede permiso para utilizar temporalmente esta aplicación web para el uso comercial interno de su clínica dental. Esta es la concesión de una licencia, no una transferencia de título, y bajo esta licencia usted no puede:
            <ul className="list-disc pl-5 mt-2">
              <li>modificar o copiar los materiales subyacentes;</li>
              <li>intentar descompilar o realizar ingeniería inversa de cualquier software contenido en la aplicación;</li>
              <li>eliminar cualquier derecho de autor u otras anotaciones de propiedad de los materiales; o</li>
              <li>transferir los materiales a otra persona o "reflejar" los materiales en cualquier otro servidor.</li>
            </ul>
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">3. Responsabilidad Médica</h2>
          <p>
            El software es una herramienta administrativa y de registro. El profesional de la salud es el único responsable de los diagnósticos, tratamientos, prescripciones médicas y cualquier decisión clínica derivada de la información almacenada en el sistema.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">4. Integración con Google</h2>
          <p>
            Nuestra plataforma se integra con los servicios de Google (Autenticación y Calendar). El uso de estos servicios está sujeto a los propios términos y condiciones de Google. Nos reservamos el derecho de suspender o cancelar la integración si viola las políticas de Google.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">5. Modificaciones</h2>
          <p>
            Podemos revisar estos términos de servicio en cualquier momento sin previo aviso. Al utilizar este sitio web, usted acepta estar sujeto a la versión actual de estos términos de servicio.
          </p>
        </div>
      </div>
    </div>
  );
}
