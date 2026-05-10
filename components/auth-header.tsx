"use client";

import { useAuth } from "./auth-provider";
import { LogOut, User } from "lucide-react";

export function AuthHeader() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="auth-header">
      <div className="user-info">
        <User size={16} />
        <span>{user.email}</span>
      </div>
      <button onClick={signOut} className="logout-btn">
        <LogOut size={16} />
        <span>Sign Out</span>
      </button>
    </div>
  );
}
