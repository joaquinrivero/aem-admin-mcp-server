import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { sitemapRequestSchema, type SitemapRequestInput } from '@/utils/validation.js';
import { createHttpClient } from '@/utils/http_client.js';
import { logger } from '@/utils/logger.js';

export async function generateSitemap(
  args: SitemapRequestInput,
  httpClient: ReturnType<typeof createHttpClient>
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  logger.info('Generating sitemap', {
    org: args.org,
    site: args.site,
    ref: args.ref,
    path: args.path
  });

  // Build the correct AEM Live admin API endpoint
  const cleanPath = args.path ? (args.path.startsWith('/') ? args.path.slice(1) : args.path) : '';
  const endpoint = `/sitemap/${args.org}/${args.site}/${args.ref}${cleanPath ? `/${cleanPath}` : ''}`;

  const response = await httpClient.post(endpoint);

  if (!response.success) {
    logger.error('Failed to generate sitemap', { args, error: response.error });
    return {
      content: [{
        type: 'text',
        text: `Error generating sitemap: ${response.error}`
      }]
    };
  }

  const sitemapUrl = (response.data as any)?.url || `https://${args.org}--${args.site}--${args.org}.aem.page/sitemap.xml`;
  logger.info('Sitemap generated successfully', {
    org: args.org,
    site: args.site,
    ref: args.ref,
    url: sitemapUrl
  });

  return {
    content: [{
      type: 'text',
      text: `Sitemap generated for ${args.org}/${args.site}/${args.ref}\nSitemap URL: ${sitemapUrl}`
    }]
  };
}

export const generateSitemapTool: Tool = {
  name: 'generate_sitemap',
  description: 'Generate sitemap for AEM Live site',
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
        description: 'Optional specific path to include in sitemap'
      }
    },
    required: ['org', 'site']
  }
};