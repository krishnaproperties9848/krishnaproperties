"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  X, 
  ExternalLink,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
  Phone,
  Mail,
  MessageCircle
} from "lucide-react";
import { SocialLink } from "@/lib/supabase/types";

interface SocialLinksManagerProps {
  links: SocialLink[];
}

const PLATFORMS = [
  { value: "facebook", label: "Facebook", icon: Facebook, color: "#1877F2" },
  { value: "instagram", label: "Instagram", icon: Instagram, color: "#E4405F" },
  { value: "twitter", label: "Twitter/X", icon: Twitter, color: "#1DA1F2" },
  { value: "youtube", label: "YouTube", icon: Youtube, color: "#FF0000" },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "#25D366" },
  { value: "phone", label: "Phone", icon: Phone, color: "#22c55e" },
  { value: "email", label: "Email", icon: Mail, color: "#d4af37" },
  { value: "website", label: "Website", icon: Globe, color: "#8b5cf6" },
];

export default function SocialLinksManager({ links }: SocialLinksManagerProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [platform, setPlatform] = useState(PLATFORMS[0].value);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const resetForm = () => {
    setPlatform(PLATFORMS[0].value);
    setLabel("");
    setUrl("");
    setIsActive(true);
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (link: SocialLink) => {
    setEditing(link);
    setPlatform(link.platform);
    setLabel(link.label || "");
    setUrl(link.url);
    setIsActive(link.is_active);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!url.trim()) return;
    
    setSaving(true);
    const supabase = createClient();

    const data = {
      platform,
      label: label.trim() || null,
      url: url.trim(),
      is_active: isActive,
    };

    if (editing) {
      await supabase.from("social_links").update(data).eq("id", editing.id);
    } else {
      await supabase.from("social_links").insert(data);
    }

    resetForm();
    setSaving(false);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this social link?")) return;
    
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("social_links").delete().eq("id", id);
    setDeleting(null);
    router.refresh();
  };

  const toggleActive = async (link: SocialLink) => {
    const supabase = createClient();
    await supabase.from("social_links").update({ is_active: !link.is_active }).eq("id", link.id);
    router.refresh();
  };

  const getPlatformConfig = (platformValue: string) => {
    return PLATFORMS.find((p) => p.value === platformValue) || PLATFORMS[8];
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
          Add Social Link
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-gold/20 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">
              {editing ? "Edit Social Link" : "New Social Link"}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-lg border border-gold/20 bg-white/5 py-2.5 px-3 text-white focus:border-gold focus:outline-none"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value} className="bg-neutral-900">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Label (optional)</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., Krishna Properties Official"
                className="w-full rounded-lg border border-gold/20 bg-white/5 py-2.5 px-3 text-white placeholder-gray-600 focus:border-gold focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">URL / Link</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-gold/20 bg-white/5 py-2.5 px-3 text-white placeholder-gray-600 focus:border-gold focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-5 w-5 rounded border-gold/30 bg-white/5 text-gold focus:ring-gold focus:ring-offset-0"
                />
                <span className="text-white">Active (visible on website)</span>
              </label>
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
              disabled={saving || !url.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      )}

      {/* Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.length === 0 ? (
          <div className="col-span-full rounded-xl border border-gold/20 bg-white/5 p-12 text-center">
            <Globe className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No social links yet</p>
          </div>
        ) : (
          links.map((link) => {
            const config = getPlatformConfig(link.platform);
            const Icon = config.icon;
            return (
              <div
                key={link.id}
                className={`rounded-xl border bg-white/5 p-5 transition-colors ${
                  link.is_active ? "border-gold/20 hover:border-gold/40" : "border-gray-800 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${config.color}20` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: config.color }} />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{config.label}</h3>
                      {link.label && (
                        <p className="text-xs text-gray-500">{link.label}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => startEdit(link)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      disabled={deleting === link.id}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-500 truncate">{link.url}</p>
                <button
                  onClick={() => toggleActive(link)}
                  className={`mt-3 text-xs font-medium ${
                    link.is_active ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  {link.is_active ? "● Active" : "○ Inactive"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
