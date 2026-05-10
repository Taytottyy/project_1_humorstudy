"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function handleAuthCallback() {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth callback error:", error);
        router.push("/auth/login?error=auth_failed");
      } else {
        router.push("/");
      }
    }

    handleAuthCallback();
  }, [router, supabase]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Completing sign in...</h1>
          <p>Please wait while we authenticate you.</p>
        </div>
      </div>
    </div>
  );
}
