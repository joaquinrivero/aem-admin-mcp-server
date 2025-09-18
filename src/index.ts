#!/usr/bin/env node

import dotenv from 'dotenv';
import { createServer } from './server.js';
import { logger } from '@/utils/logger.js';

// Load environment variables from .env file
dotenv.config();

async function main() {
  try {
    logger.info('Starting AEM Admin MCP Server...');

    const server = createServer();
    await server.connect();

    logger.info('AEM Admin MCP Server running');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to start server', { error: errorMessage });
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}