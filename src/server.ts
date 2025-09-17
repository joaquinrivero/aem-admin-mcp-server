import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
  type ListToolsRequest
} from '@modelcontextprotocol/sdk/types.js';

import { createConfigManager } from '@/config/index.js';
import { createHttpClient } from '@/utils/http_client.js';
import { logger } from '@/utils/logger.js';
import {
  publishContentTool,
  previewContentTool,
  manageCacheTool,
  generateSitemapTool,
  createSnapshotTool,
  publishContent,
  previewContent,
  invalidateCache,
  generateSitemap,
  createSnapshot
} from '@/tools/index.js';
import {
  publishContentSchema,
  previewContentSchema,
  cacheRequestSchema,
  sitemapRequestSchema,
  snapshotRequestSchema
} from '@/utils/validation.js';

export class AemMcpServer {
  private server: Server;
  private configManager = createConfigManager();
  private httpClient: ReturnType<typeof createHttpClient>;

  constructor() {
    this.server = new Server({
      name: 'aem-admin-mcp-server',
      version: '0.1.0'
    }, {
      capabilities: {
        tools: {}
      }
    });

    const config = this.configManager.getConfig();
    this.httpClient = createHttpClient(config);

    this.setupTools();
    logger.info('AEM MCP Server initialized');
  }

  private setupTools(): void {
    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'publish_content': {
            const validatedArgs = publishContentSchema.parse(args);
            return await publishContent(validatedArgs, this.httpClient);
          }

          case 'preview_content': {
            const validatedArgs = previewContentSchema.parse(args);
            return await previewContent(validatedArgs, this.httpClient);
          }

          case 'invalidate_cache': {
            const validatedArgs = cacheRequestSchema.parse(args);
            return await invalidateCache(validatedArgs, this.httpClient);
          }

          case 'generate_sitemap': {
            const validatedArgs = sitemapRequestSchema.parse(args);
            return await generateSitemap(validatedArgs, this.httpClient);
          }

          case 'create_snapshot': {
            const validatedArgs = snapshotRequestSchema.parse(args);
            return await createSnapshot(validatedArgs, this.httpClient);
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Tool execution failed', { tool: name, error: errorMessage });
        throw new Error(`Tool execution failed: ${errorMessage}`);
      }
    });

    this.server.setRequestHandler(ListToolsRequestSchema, async (_request: ListToolsRequest) => {
      return {
        tools: [
          publishContentTool,
          previewContentTool,
          manageCacheTool,
          generateSitemapTool,
          createSnapshotTool
        ]
      };
    });
  }

  async connect(): Promise<void> {
    const validation = this.configManager.validate();
    if (!validation.valid) {
      logger.error('Configuration validation failed', { errors: validation.errors });
      throw new Error(`Configuration errors: ${validation.errors.join(', ')}`);
    }

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('AEM MCP Server connected');
  }
}

export function createServer(): AemMcpServer {
  return new AemMcpServer();
}