export default function BasicPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1>✅ Basic Server Component</h1>
      <p>Server-side rendering works correctly</p>
      <p>No client-side event handlers</p>
      <p>Static generation compatible</p>
      <div style={{ 
        background: '#1a1a1a', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '20px',
        border: '1px solid #333'
      }}>
        <h3>✅ Server Component Test</h3>
        <p>✅ Renders without errors</p>
        <p>✅ No hydration issues</p>
        <p>✅ Static generation compatible</p>
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
