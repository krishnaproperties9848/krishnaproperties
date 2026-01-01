import { createServerSupabaseClient } from "@/lib/supabase/server";
import BrochureList from "@/components/admin/brochures/BrochureList";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function BrochuresPage() {
  const supabase = await createServerSupabaseClient();
  const { data: brochures } = await supabase
    .from("brochures")
    .select("*")
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-gold-light">Brochures</h1>
          <p className="mt-1 text-gray-500">Manage property brochures and investment listings</p>
        </div>
        <Link
          href="/admin/brochures/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-dark px-4 py-2.5 text-sm font-semibold text-black hover:from-gold-light hover:to-gold transition-all shadow-lg shadow-gold/20"
        >
          <Plus className="h-4 w-4" />
          Add Brochure
        </Link>
      </div>

      <BrochureList brochures={brochures || []} />
    </div>
  );
}
