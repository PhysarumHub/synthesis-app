import { NextRequest, NextResponse } from "next/server";

const PUBLIC = ["/admin", "/api/admin/"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const cookie = req.cookies.get("admin_auth")?.value;
  const pin = process.env.ADMIN_PIN ?? "";

  if (!pin || cookie !== btoa(pin)) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
