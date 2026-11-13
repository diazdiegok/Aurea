import { NextResponse } from "next/server";
import { getHomeSplash } from "@/lib/splash";

export async function GET() {
  const splash = await getHomeSplash();
  if (!splash.active || !splash.title.trim()) {
    return NextResponse.json({ active: false });
  }
  return NextResponse.json(splash);
}
