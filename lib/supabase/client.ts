import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!; // The "!" tells TypeScript it WILL be there
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  // We want to initialize even if keys are missing initially to avoid the "null" hang
  return createBrowserClient(
    supabaseUrl || "", 
    supabaseKey || ""
  );
}
