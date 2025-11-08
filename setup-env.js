// Quick setup script to create .env.local with Hostaway credentials
const fs = require('fs');
const path = require('path');

const envContent = `HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
GOOGLE_PLACES_API_KEY=
`;

const envPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath)) {
  console.log('✅ .env.local already exists');
} else {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local with Hostaway credentials');
}

console.log('\n📋 Environment variables set:');
console.log('   HOSTAWAY_ACCOUNT_ID=61148');
console.log('   HOSTAWAY_API_KEY=f943...9152 (hidden for security)');
console.log('\n🚀 You can now run: npm run dev');

