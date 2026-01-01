import { NextResponse } from "next/server";
import { createServerSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const brochureId = body?.brochureId as string | undefined;
    const incrementBy = (body?.incrementBy as number | undefined) ?? 1;

    if (!brochureId) {
      return NextResponse.json({ error: "brochureId is required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseAdmin();
    const { error } = await supabase.rpc("increment_brochure_views", {
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
