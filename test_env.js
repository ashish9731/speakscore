// Test script to verify environment variables
require('dotenv').config();

console.log('Environment Variables Test:');
console.log('==========================');
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
console.log('Is placeholder:', process.env.OPENAI_API_KEY === 'your_openai_api_key_here');
console.log('PORT:', process.env.PORT || 'Not set (default: 5001)');

if (process.env.OPENAI_API_KEY) {
  console.log('API Key starts with:', process.env.OPENAI_API_KEY.substring(0, 10) + '...');
}