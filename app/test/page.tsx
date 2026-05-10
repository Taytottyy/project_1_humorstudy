"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-react';

export default function TestPage() {
  const supabase = createClientComponentClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Humor Study Test Page</h1>
      <button 
        onClick={handleLogin} 
        style={{ padding: '10px 20px', cursor: 'pointer' }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
