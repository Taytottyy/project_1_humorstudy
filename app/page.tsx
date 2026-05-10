"use client";

import VotePage from "../vote-page";
import { ErrorBoundary } from "@/components/error-boundary";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ErrorBoundary fallback={
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <h2>Loading Humor Study...</h2>
        <p>Please wait while we set up the application.</p>
      </div>
    }>
      <VotePage />
    </ErrorBoundary>
  );
}
