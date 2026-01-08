const jwt = require('./server/node_modules/jsonwebtoken');

const token = process.argv[2];
if (!token) {
  console.log('Usage: node test-jwt.js <token>');
  process.exit(1);
}

const decoded = jwt.decode(token);
console.log('Decoded JWT:', JSON.stringify(decoded, null, 2));
