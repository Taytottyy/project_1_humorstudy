"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data?.session) {
          console.log("Auth successful, redirecting...");
          router.push("/");
        } else {
          // Try to exchange code for session
          const code = searchParams.get("code");
          if (code) {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) {
              console.error("Code exchange error:", exchangeError);
              setError(exchangeError.message);
            } else {
              router.push("/");
            }
          } else {
            setError("No authentication session found");
          }
        }
      } catch (err) {
        console.error("Callback error:", err);
        setError("Authentication failed");
      } finally {
        setLoading(false);
      }
    }

    handleAuthCallback();
  }, [router, searchParams, supabase]);

  if (loading) {
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

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Authentication Error</h1>
            <p>{error}</p>
          </div>
          <div className="auth-form">
            <button 
              onClick={() => router.push("/auth/login")}
              className="button-primary"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
