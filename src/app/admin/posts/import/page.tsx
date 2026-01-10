"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ImportPostPage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/external-posts/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const err = data?.error || "Failed to import";
        setStatus("error");
        setMessage(String(err));
        return;
      }

      setStatus("success");
      setMessage("Imported successfully. You can now see it in the posts list.");
      setUrl("");
    } catch (error: any) {
      setStatus("error");
      setMessage(error?.message || "Unexpected error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Posts
        </Link>
      </div>

      <div className="rounded-2xl border border-gold/20 bg-white/5 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Download className="h-5 w-5 text-gold" />
          <div>
            <h1 className="text-xl font-serif text-gold-light">Import WordPress Post</h1>
            <p className="text-sm text-gray-400">
              Paste any WordPress post URL. We’ll fetch metadata (title, cover image, excerpt) and store it as an external post.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">WordPress URL</label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/your-post"
            className="w-full rounded-lg border border-gold/20 bg-black/40 px-3 py-2 text-white placeholder-gray-600 focus:border-gold focus:outline-none"
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-light via-gold to-gold-dark px-4 py-2.5 font-semibold text-black shadow-lg shadow-gold/20 disabled:opacity-60"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Import Post
                </>
              )}
            </button>

            {status === "success" && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                {message}
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" />
                {message || "Import failed"}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
