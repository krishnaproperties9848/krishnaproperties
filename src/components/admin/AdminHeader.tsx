"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Bell, ExternalLink } from "lucide-react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

interface AdminHeaderProps {
  user: User;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-gold/20 bg-black/50 backdrop-blur-sm px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-medium text-white">Content Management</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* View Site */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg border border-gold/20 bg-white/5 px-3 py-2 text-sm text-gray-400 hover:text-white hover:border-gold/40 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          View Site
        </Link>

        {/* Notifications */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gold/20 bg-white/5 text-gray-400 hover:text-white hover:border-gold/40 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold text-[10px] font-bold text-black flex items-center justify-center">
            0
          </span>
        </button>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </header>
  );
}
