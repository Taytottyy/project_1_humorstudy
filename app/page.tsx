'use client';

import VotePage from "../vote-page";
import { ErrorBoundary } from "@/components/error-boundary";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ErrorBoundary fallback={
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <h2>Something went wrong</h2>
        <p>Please refresh the page and try again.</p>
        <button
          onClick={() => window.location.reload()}
          style={{ marginTop: '20px', padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Refresh
        </button>
      </div>
    }>
      <VotePage />
    </ErrorBoundary>
  );
}
