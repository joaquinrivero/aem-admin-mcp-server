import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { publishContentSchema, type PublishContentInput } from '@/utils/validation.js';
import { createHttpClient } from '@/utils/http_client.js';
import { logger } from '@/utils/logger.js';

export async function publishContent(
  args: PublishContentInput,
  httpClient: ReturnType<typeof createHttpClient>
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  logger.info('Publishing content', {
    org: args.org,
    site: args.site,
    ref: args.ref,
    path: args.path,
    force: args.force,
    bulk: args.bulk
  });

  // Build the correct AEM Live admin API endpoint
  const endpoint = args.bulk
    ? `/live/${args.org}/${args.site}/${args.ref}/*`
    : `/live/${args.org}/${args.site}/${args.ref}/${args.path}`;

  const body = args.bulk ? { paths: [args.path] } : {};

  const response = await httpClient.post(endpoint, body);

  if (!response.success) {
    logger.error('Failed to publish content', { path: args.path, error: response.error });
    return {
      content: [{
        type: 'text',
        text: `Error publishing content: ${response.error}`
      }]
    };
  }

  logger.info('Content published successfully', {
    org: args.org,
    site: args.site,
    ref: args.ref,
    path: args.path
  });

  return {
    content: [{
      type: 'text',
      text: `Successfully published content: ${args.org}/${args.site}/${args.ref}/${args.path}`
    }]
  };
}

export const publishContentTool: Tool = {
  name: 'publish_content',
  title: 'AEM Content Publisher',
  description: 'Publish content to AEM Live',
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
        description: 'Content path to publish (e.g., "/en/products")'
      },
      force: {
        type: 'boolean',
        description: 'Force update even if content is up to date',
        default: false
      },
      bulk: {
        type: 'boolean',
        description: 'Use bulk publishing endpoint',
        default: false
      }
    },
    required: ['org', 'site', 'path']
  }
};