async function testBackend() {
  try {
    console.log('🔍 Testing backend connection...');
    console.log('📍 Target: http://localhost:5000/health');
    console.log('');
    
    const response = await fetch('http://localhost:5000/health');
    const data = await response.json();
    
    console.log('✅ SUCCESS! Backend is running!');
    console.log('📦 Response:', JSON.stringify(data, null, 2));
    console.log('');
    console.log('✨ Your backend is working correctly!');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Make sure your frontend is running (npm run dev in client folder)');
    console.log('  2. Check client/.env has: VITE_API_URL=http://localhost:5000');
    
  } catch (error) {
    console.log('❌ FAILED! Cannot connect to backend');
    console.log('');
    
    if (error.cause?.code === 'ECONNREFUSED') {
      console.log('⚠️  Problem: Backend server is NOT running');
      console.log('');
      console.log('✅ Solution:');
      console.log('  1. Open a new terminal/command prompt');
      console.log('  2. Run: cd C:\\dev\\todolist\\server');
      console.log('  3. Run: npm run dev');
      console.log('  4. Wait for "Server running on port 5000"');
      console.log('  5. Run this test again');
      console.log('');
      
    } else if (error.cause?.code === 'ENOTFOUND') {
      console.log('⚠️  Problem: Invalid hostname');
      console.log('Make sure you are using localhost or 127.0.0.1');
      
    } else {
      console.log('⚠️  Error:', error.message);
      console.log('');
      if (error.cause) {
        console.log('Cause:', error.cause);
      }
    }
  }
}

console.log('='.repeat(50));
console.log('Backend Connection Test');
console.log('='.repeat(50));
console.log('');

testBackend();
