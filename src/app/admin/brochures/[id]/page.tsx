import { createServerSupabaseClient } from "@/lib/supabase/server";
import BrochureForm from "@/components/admin/brochures/BrochureForm";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBrochurePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  
  const { data: brochure } = await supabase
    .from("brochures")
    .select("*")
    .eq("id", id)
    .single();

  if (!brochure) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-gold-light">Edit Brochure</h1>
        <p className="mt-1 text-gray-500">Update property brochure details</p>
      </div>

      <BrochureForm brochure={brochure} />
    </div>
  );
}
