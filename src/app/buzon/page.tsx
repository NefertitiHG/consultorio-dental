import { getSuggestions } from "@/features/feedback/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { InboxClient } from "@/features/feedback/components/InboxClient";

export const dynamic = "force-dynamic";

export default async function BuzonPage() {
  const session = await getServerSession(authOptions);

  if (!session || ((session.user as any).role !== "SUPERADMIN" && (session.user as any).role !== "ADMIN")) {
    redirect("/acceso-denegado");
  }

  const result = await getSuggestions();
  const suggestions = result.success ? result.data : [];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Buzón de Sugerencias</h1>
        <p className="text-muted-foreground mt-2">
          Revisa y responde los mensajes, reportes y sugerencias enviados por los usuarios.
        </p>
      </div>

      <InboxClient suggestions={suggestions || []} />
    </div>
  );
}
