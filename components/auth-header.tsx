"use client";

import { useAuth } from "./auth-provider";
import { LogOut, User, Upload } from "lucide-react";
import Link from "next/link";

export function AuthHeader() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="auth-header">
      <div className="user-info">
        <User size={16} />
        <span>{user.email}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Link href="/upload" style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 8,
          background: "#667eea", color: "white",
          fontSize: 13, fontWeight: 500, textDecoration: "none",
        }}>
          <Upload size={14} /> Upload Image
        </Link>
        <button onClick={signOut} className="logout-btn">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
