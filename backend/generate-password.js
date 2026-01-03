/**
 * Utility script to generate bcrypt password hash
 * 
 * Usage: node generate-password.js <your-password>
 * 
 * Copy the output hash to your .env file as ADMIN_PASSWORD_HASH
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.log('Usage: node generate-password.js <your-password>');
  console.log('');
  console.log('Example: node generate-password.js mysecretpassword');
  process.exit(1);
}

const saltRounds = 10;
const hash = bcrypt.hashSync(password, saltRounds);

console.log('');
console.log('Add this to your .env file:');
console.log('');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log('');

