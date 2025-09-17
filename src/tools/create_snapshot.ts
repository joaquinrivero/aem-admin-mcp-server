import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { snapshotRequestSchema, type SnapshotRequestInput } from '@/utils/validation.js';
import { createHttpClient } from '@/utils/http_client.js';
import { logger } from '@/utils/logger.js';

export async function createSnapshot(
  args: SnapshotRequestInput,
  httpClient: ReturnType<typeof createHttpClient>
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  logger.info('Creating snapshot', {
    org: args.org,
    site: args.site,
    name: args.name,
    description: args.description,
    paths: args.paths
  });

  // Build the correct AEM Live admin API endpoint
  const endpoint = `/snapshot/${args.org}/${args.site}/main/${args.name}`;
  const body = {
    ...(args.description && { description: args.description }),
    ...(args.paths && { paths: args.paths })
  };

  const response = await httpClient.post(endpoint, body);

  if (!response.success) {
    logger.error('Failed to create snapshot', { name: args.name, error: response.error });
    return {
      content: [{
        type: 'text',
        text: `Error creating snapshot: ${response.error}`
      }]
    };
  }

  const snapshotId = (response.data as any)?.id || args.name;
  logger.info('Snapshot created successfully', { name: args.name, id: snapshotId });

  return {
    content: [{
      type: 'text',
      text: `Snapshot created successfully:
Name: ${args.name}
ID: ${snapshotId}
${args.description ? `Description: ${args.description}` : ''}
${args.paths ? `Paths: ${args.paths.join(', ')}` : 'All content included'}`
    }]
  };
}

export const createSnapshotTool: Tool = {
  name: 'create_snapshot',
  title: 'AEM Snapshot Creator',
  description: 'Create content snapshot in AEM Live',
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
      name: {
        type: 'string',
        description: 'Name for the snapshot (used as snapshotId)'
      },
      description: {
        type: 'string',
        description: 'Optional description for the snapshot'
      },
      paths: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional specific paths to include in snapshot'
      }
    },
    required: ['org', 'site', 'name']
  }
};