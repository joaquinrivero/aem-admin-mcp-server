#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Make the built file executable
const indexPath = path.join(process.cwd(), 'build', 'index.js');
if (fs.existsSync(indexPath)) {
  fs.chmodSync(indexPath, '755');
}

// Show success message with setup link
const setupUrl = `${process.cwd()}/setup.html`;

console.log(`
🎉 Build complete!

📋 Next step: Configure your AI client
🔗 Setup tool: ${setupUrl}

💡 Open the link above to configure Cursor AI or Claude Code

🚀 Installation method: Local Development
   • Uses your built files directly - no installation required!

📖 Need help? Check the README.md for detailed instructions
`);