#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testing AEM Admin MCP Server...\n');

// Test the server by running it with --version or similar
const serverPath = path.join(process.cwd(), 'build', 'index.js');

console.log(`📍 Server path: ${serverPath}`);
console.log('🔄 Starting server test...\n');

// Start the server process
const serverProcess = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: {
    ...process.env,
    AEM_API_KEY: 'test-key',
    AEM_BASE_URL: 'https://admin.hlx.page'
  }
});

let output = '';
let errorOutput = '';

serverProcess.stdout.on('data', (data) => {
  output += data.toString();
});

serverProcess.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

// Send a test MCP request to see if it responds
setTimeout(() => {
  const testRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  };

  serverProcess.stdin.write(JSON.stringify(testRequest) + '\n');
}, 1000);

// Kill the server after a few seconds
setTimeout(() => {
  serverProcess.kill('SIGTERM');
}, 3000);

serverProcess.on('close', (code) => {
  console.log('📊 Test Results:');
  console.log('================\n');

  if (output.includes('AEM Admin MCP Server') || output.includes('running')) {
    console.log('✅ Server started successfully');
  } else {
    console.log('❌ Server may not have started properly');
  }

  if (output.includes('tools') || output.includes('publish_content')) {
    console.log('✅ MCP tools are available');
  } else {
    console.log('⚠️  MCP tools response not detected');
  }

  if (errorOutput) {
    console.log('⚠️  Errors detected:');
    console.log(errorOutput);
  } else {
    console.log('✅ No errors detected');
  }

  console.log('\n📝 Raw Output:');
  console.log('==============');
  console.log(output || '(no stdout output)');

  if (errorOutput) {
    console.log('\n🚨 Error Output:');
    console.log('================');
    console.log(errorOutput);
  }

  const setupPath = `${process.cwd()}/setup.html`;

  console.log('\n💡 Next Steps:');
  console.log('==============');
  console.log(`• If tests passed: Configure your AI client using ${setupPath}`);
  console.log('• If tests failed: Check the error output above');
  console.log('• For manual testing: Run `node build/index.js` and send MCP requests');
  console.log(`• For full testing: Run \`npx @modelcontextprotocol/inspector node ${serverPath}\``);
});

serverProcess.on('error', (error) => {
  console.log('❌ Failed to start server:');
  console.log(error.message);
  console.log('\n💡 Make sure you\'ve run `npm run build` first!');
});