"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit, Trash2, Tag as TagIcon, Loader2, X } from "lucide-react";
import { Tag } from "@/lib/supabase/types";

interface TagsManagerProps {
  tags: Tag[];
}

export default function TagsManager({ tags }: TagsManagerProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setSlug("");
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

  const startEdit = (tag: Tag) => {
    setEditing(tag);
    setName(tag.name);
    setSlug(tag.slug);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    
    setSaving(true);
    const supabase = createClient();

    const data = {
      name: name.trim(),
      slug: slug.trim() || generateSlug(name),
    };

    if (editing) {
      await supabase.from("tags").update(data).eq("id", editing.id);
    } else {
      await supabase.from("tags").insert(data);
    }

    resetForm();
    setSaving(false);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tag?")) return;
    
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("post_tags").delete().eq("tag_id", id);
    await supabase.from("tags").delete().eq("id", id);
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
          Add Tag
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-gold/20 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">
              {editing ? "Edit Tag" : "New Tag"}
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
                placeholder="e.g., First-Time Buyer"
                className="w-full rounded-lg border border-gold/20 bg-white/5 py-2.5 px-3 text-white placeholder-gray-600 focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                placeholder="first-time-buyer"
                className="w-full rounded-lg border border-gold/20 bg-white/5 py-2.5 px-3 text-white placeholder-gray-600 focus:border-gold focus:outline-none"
              />
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

      {/* Tags Grid */}
      <div className="rounded-xl border border-gold/20 bg-white/5 p-6">
        {tags.length === 0 ? (
          <div className="text-center py-12">
            <TagIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No tags yet</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="group flex items-center gap-2 rounded-full border border-gold/20 bg-white/5 pl-4 pr-2 py-2 hover:border-gold/40 transition-colors"
              >
                <span className="text-white font-medium">{tag.name}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(tag)}
                    className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    disabled={deleting === tag.id}
                    className="rounded-full p-1 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
