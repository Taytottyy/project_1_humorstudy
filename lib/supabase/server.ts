import { createServerClient, type CookieOptions } from "@supabase/ssr"; // Added type import
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // We add the specific type here to stop the "implicitly has an any type" error
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The Next.js middleware/server component pattern sometimes 
            // throws when setting cookies, which is safe to ignore here.
          }
        },
      },
    }
  );
}
