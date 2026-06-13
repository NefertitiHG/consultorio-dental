import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-sm border border-border p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="p-3 bg-primary/10 rounded-xl">
            <Shield className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Política de Privacidad</h1>
        </div>

        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground space-y-6">
          <p>Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

          <h2 className="text-xl font-semibold text-foreground mt-8">1. Información que recopilamos</h2>
          <p>
            Recopilamos información para brindar mejores servicios a todos nuestros usuarios. Cuando utiliza nuestro software de gestión para consultorios dentales, solicitamos acceso a su perfil básico de Google (nombre, correo electrónico) para la autenticación segura, y permisos para Google Calendar para sincronizar sus citas médicas.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">2. Uso de Google Calendar</h2>
          <p>
            Nuestra aplicación solicita acceso a su Google Calendar exclusivamente con el propósito de crear, actualizar o eliminar eventos relacionados con las citas de sus pacientes registradas en nuestro sistema. No leemos, modificamos ni eliminamos eventos personales que no hayan sido creados por nuestra aplicación.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">3. Protección de Datos</h2>
          <p>
            Los datos de sus pacientes (historias clínicas, odontogramas, evoluciones) están encriptados y almacenados en servidores seguros. El acceso a esta información está restringido únicamente a los profesionales de la salud autorizados mediante su cuenta de Google.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">4. Compartir información</h2>
          <p>
            No vendemos, intercambiamos ni transferimos a terceros su información personal ni la de sus pacientes. Esto no incluye a los terceros de confianza que nos asisten en la operación de nuestro sitio web o en la prestación de servicios, siempre que dichas partes acuerden mantener esta información confidencial.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8">5. Consentimiento</h2>
          <p>
            Al utilizar nuestro sitio y autenticarse mediante Google, usted acepta nuestra política de privacidad.
          </p>
        </div>
      </div>
    </div>
  );
}
