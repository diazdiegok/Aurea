import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getHomeSplash, upsertHomeSplash } from "@/lib/splash";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json(await getHomeSplash());
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const splash = await upsertHomeSplash({
    active: body.active != null ? Boolean(body.active) : undefined,
    title: body.title != null ? String(body.title) : undefined,
    subtitle: body.subtitle != null ? String(body.subtitle) : undefined,
    ctaLabel: body.ctaLabel != null ? String(body.ctaLabel) : undefined,
    imageUrl:
      body.imageUrl === undefined
        ? undefined
        : body.imageUrl
          ? String(body.imageUrl)
          : null,
  });

  return NextResponse.json(splash);
}
