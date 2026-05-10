export default function ServerTestPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1>🎯 Server Component Test</h1>
      <p>✅ Server-side rendering working</p>
      <p>✅ No client-side event handlers</p>
      <p>✅ Static generation compatible</p>
      <div style={{ 
        background: '#1a1a1a', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '20px',
        border: '1px solid #333'
      }}>
        <h3>Server Test Results</h3>
        <p>✅ Next.js App Router working</p>
        <p>✅ Server-side rendering successful</p>
        <p>✅ No hydration issues</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <a 
          href="/"
          style={{
            padding: '10px 20px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          Back to Main App
        </a>
      </div>
    </div>
  );
}
