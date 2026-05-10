export default function DiagnosticPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1>Diagnostic Check</h1>
      <p>Testing basic functionality...</p>
      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <p>✅ Next.js app is running</p>
        <p>✅ React is available</p>
        <p>✅ Page rendering works</p>
        <p>❌ Environment variables may be missing</p>
        <p>❌ Database connection may be failing</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            padding: '10px 20px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Back to App
        </button>
      </div>
    </div>
  );
}
