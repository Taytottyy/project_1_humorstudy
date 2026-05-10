import { createClient } from "./lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to auth pages
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to login if not authenticated and trying to access protected routes
  if (!session && pathname !== "/auth/login") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next|favicon.ico).*)",
  ],
};
