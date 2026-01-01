import { NextResponse } from "next/server";
import { createServerSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isAllowedRedirect = (url: string) => {
  try {
    const u = new URL(url);
    const allowedHosts = new Set([
      "drive.google.com",
      "docs.google.com",
      "mggemmpkqzwlvmypvygx.supabase.co",
    ]);

    return u.protocol === "https:" && allowedHosts.has(u.host);
  } catch {
    return false;
  }
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const brochureId = searchParams.get("brochureId");
    const url = searchParams.get("url");

    if (!brochureId || !url) {
      return NextResponse.json({ error: "brochureId and url are required" }, { status: 400 });
    }

    if (!isAllowedRedirect(url)) {
      return NextResponse.json({ error: "Invalid download URL" }, { status: 400 });
    }

    const supabase = await createServerSupabaseAdmin();
    await supabase.rpc("increment_brochure_downloads", {
      brochure_id: brochureId,
      increment_by: 1,
    });

    const res = NextResponse.redirect(url, 302);
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const brochureId = body?.brochureId as string | undefined;
    const incrementBy = (body?.incrementBy as number | undefined) ?? 1;

    if (!brochureId) {
      return NextResponse.json({ error: "brochureId is required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseAdmin();
    const { error } = await supabase.rpc("increment_brochure_downloads", {
      brochure_id: brochureId,
      increment_by: incrementBy,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return new NextResponse(null, {
      status: 204,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
