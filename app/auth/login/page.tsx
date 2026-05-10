"use client";

import { GoogleSignInButton } from "@/components/google-sign-in";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <LogIn className="auth-icon" size={32} />
          <h1>Welcome to Crackd</h1>
          <p>Sign in to vote on captions and power humor research</p>
        </div>

        <div className="auth-form">
          <GoogleSignInButton />
        </div>

        <div className="auth-footer">
          <p>
            By signing in, you agree to participate in humor research. Your votes help us understand what makes things funny!
          </p>
        </div>
      </div>
    </div>
  );
}
