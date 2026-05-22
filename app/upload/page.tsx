"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { Upload, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

const API_BASE = "https://api.almostcrackd.ai";

export default function UploadPage() {
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [step, setStep] = useState<"idle" | "uploading" | "generating" | "done" | "error">("idle");
  const [captions, setCaptions] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (authLoading) return null;
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStep("idle");
    setCaptions([]);
    setErrorMsg(null);
  }

  async function handleUploadAndGenerate() {
    if (!file) return;
    setErrorMsg(null);

    try {
      // Get JWT token from Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Step 1: Get presigned URL
      setStep("uploading");
      const presignRes = await fetch(`${API_BASE}/pipeline/generate-presigned-url`, {
        method: "POST",
        headers,
        body: JSON.stringify({ contentType: file.type }),
      });
      if (!presignRes.ok) throw new Error("Failed to get upload URL");
      const { presignedUrl, cdnUrl } = await presignRes.json();

      // Step 2: Upload image to S3
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("Failed to upload image");

      // Step 3: Register image in pipeline
      const registerRes = await fetch(`${API_BASE}/pipeline/upload-image-from-url`, {
        method: "POST",
        headers,
        body: JSON.stringify({ imageUrl: cdnUrl, isCommonUse: false }),
      });
      if (!registerRes.ok) throw new Error("Failed to register image");
      const { imageId } = await registerRes.json();

      // Step 4: Generate captions
      setStep("generating");
      const captionRes = await fetch(`${API_BASE}/pipeline/generate-captions`, {
        method: "POST",
        headers,
        body: JSON.stringify({ imageId }),
      });
      if (!captionRes.ok) throw new Error("Failed to generate captions");
      const captionData = await captionRes.json();

      setCaptions(Array.isArray(captionData) ? captionData : [captionData]);
      setStep("done");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
      setStep("error");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#f0f0f0",
      fontFamily: "system-ui, sans-serif",
      padding: "32px 16px",
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <button
          onClick={() => router.push("/")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", color: "#94a3b8",
            cursor: "pointer", fontSize: 14, marginBottom: 24,
          }}
        >
          <ArrowLeft size={16} /> Back to voting
        </button>

        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Upload Image</h1>
        <p style={{ color: "#94a3b8", marginBottom: 32, fontSize: 15 }}>
          Upload an image and we&apos;ll generate AI captions for it automatically.
        </p>

        {/* File picker */}
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: "2px dashed #334155",
            borderRadius: 12,
            padding: "40px 24px",
            textAlign: "center",
            cursor: "pointer",
            marginBottom: 24,
            background: "#111",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#667eea")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#334155")}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{ maxHeight: 240, maxWidth: "100%", borderRadius: 8, marginBottom: 12 }}
            />
          ) : (
            <Upload size={40} color="#475569" style={{ margin: "0 auto 12px" }} />
          )}
          <p style={{ color: "#64748b", fontSize: 14 }}>
            {file ? file.name : "Click to select an image (JPEG, PNG, WEBP, GIF, HEIC)"}
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic"
            onChange={handleFile}
            style={{ display: "none" }}
          />
        </div>

        {errorMsg && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b",
            borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 14,
          }}>
            {errorMsg}
          </div>
        )}

        {file && step !== "done" && (
          <button
            onClick={handleUploadAndGenerate}
            disabled={step === "uploading" || step === "generating"}
            style={{
              width: "100%",
              padding: "14px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 600,
              cursor: step === "idle" || step === "error" ? "pointer" : "not-allowed",
              opacity: step === "uploading" || step === "generating" ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {step === "uploading" && <><Loader2 size={18} className="spin" /> Uploading image…</>}
            {step === "generating" && <><Loader2 size={18} className="spin" /> Generating captions…</>}
            {(step === "idle" || step === "error") && <><Upload size={18} /> Upload & Generate Captions</>}
          </button>
        )}

        {/* Generated captions */}
        {step === "done" && captions.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <CheckCircle2 size={22} color="#22c55e" />
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>
                {captions.length} caption{captions.length !== 1 ? "s" : ""} generated!
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {captions.map((c, i) => (
                <div
                  key={c.id ?? i}
                  style={{
                    background: "#1a1a2e",
                    border: "1px solid #334155",
                    borderRadius: 10,
                    padding: "16px 20px",
                    fontSize: 15,
                    lineHeight: 1.5,
                  }}
                >
                  &ldquo;{c.content ?? c.caption_text ?? c.text ?? JSON.stringify(c)}&rdquo;
                </div>
              ))}
            </div>
            <button
              onClick={() => { setFile(null); setPreview(null); setStep("idle"); setCaptions([]); }}
              style={{
                marginTop: 20,
                width: "100%",
                padding: "12px",
                background: "none",
                border: "1px solid #334155",
                color: "#94a3b8",
                borderRadius: 10,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Upload another image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
