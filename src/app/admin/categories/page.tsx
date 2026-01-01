import { createServerSupabaseClient } from "@/lib/supabase/server";
import CategoriesManager from "@/components/admin/categories/CategoriesManager";

export default async function CategoriesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-gold-light">Categories</h1>
        <p className="mt-1 text-gray-500">Organize your blog posts into categories</p>
      </div>

      <CategoriesManager categories={categories || []} />
    </div>
  );
}
