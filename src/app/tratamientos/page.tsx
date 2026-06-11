import { getTreatments } from "@/features/tratamientos/actions";
import { TreatmentCatalog } from "@/features/tratamientos/components/TreatmentCatalog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TratamientosPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const result = await getTreatments();
  const treatments = result.success ? result.data : [];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <TreatmentCatalog initialTreatments={treatments as any} />
    </div>
  );
}
