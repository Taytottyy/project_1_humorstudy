export default function SimpleTestPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1>✅ Next.js Working</h1>
      <p>Basic functionality test passed</p>
      <div style={{ 
        background: '#1a1a1a', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '20px',
        border: '1px solid #333'
      }}>
        <h3>✅ Server Components Working</h3>
        <p>Page renders successfully</p>
        <h3>✅ Build Process Working</h3>
        <p>No build errors detected</p>
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
