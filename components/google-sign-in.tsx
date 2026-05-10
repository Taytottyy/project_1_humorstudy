"use client";

import { createClient } from "@/lib/supabase/client";

export function GoogleSignInButton() {
  async function handleClick() {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo
      }
    });

    if (error) {
      console.error("Google sign-in failed", error);
      window.alert(error.message);
    }
  }

  return (
    <button className="button-primary w-full" onClick={handleClick} type="button">
      Continue with Google
    </button>
  );
}
