import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { previewContentSchema, type PreviewContentInput } from '@/utils/validation.js';
import { createHttpClient } from '@/utils/http_client.js';
import { logger } from '@/utils/logger.js';

export async function previewContent(
  args: PreviewContentInput,
  httpClient: ReturnType<typeof createHttpClient>
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  logger.info('Generating content preview', {
    org: args.org,
    site: args.site,
    ref: args.ref,
    path: args.path
  });

  // Build the correct AEM Live admin API endpoint
  const endpoint = `/preview/${args.org}/${args.site}/${args.ref}/${args.path}`;

  const response = await httpClient.post(endpoint);

  if (!response.success) {
    logger.error('Failed to generate preview', { path: args.path, error: response.error });
    return {
      content: [{
        type: 'text',
        text: `Error generating preview: ${response.error}`
      }]
    };
  }

  const previewUrl = (response.data as any)?.url || `Preview generated for ${args.path}`;
  logger.info('Preview generated successfully', { path: args.path, url: previewUrl });

  return {
    content: [{
      type: 'text',
      text: `Preview generated for path: ${args.path}\nURL: ${previewUrl}`
    }]
  };
}

export const previewContentTool: Tool = {
  name: 'preview_content',
  title: 'AEM Content Previewer',
  description: 'Generate content preview in AEM Live',
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
        description: 'Content path to preview (e.g., "/en/products")'
      }
    },
    required: ['org', 'site', 'path']
  }
};