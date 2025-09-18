import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { cacheRequestSchema, type CacheRequestInput } from '@/utils/validation.js';
import { createHttpClient } from '@/utils/http_client.js';
import { logger } from '@/utils/logger.js';

export async function invalidateCache(
  args: CacheRequestInput,
  httpClient: ReturnType<typeof createHttpClient>
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  logger.info('Invalidating cache', {
    org: args.org,
    site: args.site,
    ref: args.ref,
    path: args.path
  });

  // Build the correct AEM Live admin API endpoint
  const cleanPath = args.path.startsWith('/') ? args.path.slice(1) : args.path;
  const endpoint = `/cache/${args.org}/${args.site}/${args.ref}/${cleanPath}`;

  const response = await httpClient.post(endpoint);

  if (!response.success) {
    logger.error('Failed to invalidate cache', { args, error: response.error });
    return {
      content: [{
        type: 'text',
        text: `Error invalidating cache: ${response.error}`
      }]
    };
  }

  logger.info('Cache invalidated successfully', {
    org: args.org,
    site: args.site,
    ref: args.ref,
    path: args.path
  });

  return {
    content: [{
      type: 'text',
      text: `Successfully invalidated cache for ${args.org}/${args.site}/${args.ref}/${args.path}`
    }]
  };
}

export const manageCacheTool: Tool = {
  name: 'invalidate_cache',
  description: 'Invalidate AEM Live cache for specific content. Note: Publishing content also refreshes cache automatically.',
  inputSchema: {
    type: 'object',
    properties: {
      org: {
        type: 'string',
        description: 'Organization (e.g., "adobecom")'
      },
      site: {
        type: 'string',
        description: 'Site repository name (e.g., "milo")'
      },
      ref: {
        type: 'string',
        description: 'Git reference/branch (e.g., "main")',
        default: 'main'
      },
      path: {
        type: 'string',
        description: 'Content path to invalidate (e.g., "/en/products")'
      }
    },
    required: ['org', 'site', 'path']
  }
};