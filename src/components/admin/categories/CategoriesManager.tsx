"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit, Trash2, FolderOpen, Loader2, X } from "lucide-react";
import { Category } from "@/lib/supabase/types";

interface CategoriesManagerProps {
  categories: Category[];
}

const COLORS = [
  "#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", 
  "#06b6d4", "#ef4444", "#84cc16", "#f97316", "#6366f1"
];

export default function CategoriesManager({ categories }: CategoriesManagerProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setColor(COLORS[0]);
    setEditing(null);
    setShowForm(false);
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!editing) {
      setSlug(generateSlug(value));
    }
  };

  const startEdit = (category: Category) => {
    setEditing(category);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || "");
    setColor(category.color || COLORS[0]);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    
    setSaving(true);
    const supabase = createClient();

    const data = {
      name: name.trim(),
      slug: slug.trim() || generateSlug(name),
      description: description.trim() || null,
      color,
    };

    if (editing) {
      await supabase.from("categories").update(data).eq("id", editing.id);
    } else {
      await supabase.from("categories").insert(data);
    }

    resetForm();
    setSaving(false);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Posts in this category will be uncategorized.")) return;
    
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", id);
    setDeleting(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-light via-gold to-gold-dark px-4 py-2.5 font-semibold text-black hover:shadow-lg hover:shadow-gold/20 transition-all"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-gold/20 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">
              {editing ? "Edit Category" : "New Category"}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Buying Guide"
                className="w-full rounded-lg border border-gold/20 bg-white/5 py-2.5 px-3 text-white placeholder-gray-600 focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                placeholder="buying-guide"
                className="w-full rounded-lg border border-gold/20 bg-white/5 py-2.5 px-3 text-white placeholder-gray-600 focus:border-gold focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                className="w-full rounded-lg border border-gold/20 bg-white/5 py-2.5 px-3 text-white placeholder-gray-600 focus:border-gold focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full transition-transform ${
                      color === c ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full rounded-xl border border-gold/20 bg-white/5 p-12 text-center">
            <FolderOpen className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No categories yet</p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border border-gold/20 bg-white/5 p-5 hover:border-gold/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <FolderOpen className="h-5 w-5" style={{ color: category.color || "#d4af37" }} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{category.name}</h3>
                    <p className="text-xs text-gray-500">/{category.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(category)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={deleting === category.id}
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {category.description && (
                <p className="mt-3 text-sm text-gray-500 line-clamp-2">{category.description}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
