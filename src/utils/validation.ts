import { z } from 'zod';

export const publishContentSchema = z.object({
  org: z.string().min(1, 'Organization is required'),
  site: z.string().min(1, 'Site is required'),
  ref: z.string().min(1, 'Ref (branch) is required').default('main'),
  path: z.string().min(1, 'Path is required'),
  force: z.boolean().optional().default(false),
  bulk: z.boolean().optional().default(false)
});

export const previewContentSchema = z.object({
  org: z.string().min(1, 'Organization is required'),
  site: z.string().min(1, 'Site is required'),
  ref: z.string().min(1, 'Ref (branch) is required').default('main'),
  path: z.string().min(1, 'Path is required')
});

export const cacheRequestSchema = z.object({
  org: z.string().min(1, 'Organization is required'),
  site: z.string().min(1, 'Site is required'),
  ref: z.string().min(1, 'Ref (branch) is required').default('main'),
  path: z.string().min(1, 'Path is required for cache invalidation')
});

export const sitemapRequestSchema = z.object({
  org: z.string().min(1, 'Organization is required'),
  site: z.string().min(1, 'Site is required'),
  ref: z.string().min(1, 'Ref (branch) is required').default('main'),
  path: z.string().optional()
});

export const snapshotRequestSchema = z.object({
  org: z.string().min(1, 'Organization is required'),
  site: z.string().min(1, 'Site is required'),
  name: z.string().min(1, 'Snapshot name is required'),
  description: z.string().optional(),
  paths: z.array(z.string()).optional()
});

export type PublishContentInput = z.infer<typeof publishContentSchema>;
export type PreviewContentInput = z.infer<typeof previewContentSchema>;
export type CacheRequestInput = z.infer<typeof cacheRequestSchema>;
export type SitemapRequestInput = z.infer<typeof sitemapRequestSchema>;
export type SnapshotRequestInput = z.infer<typeof snapshotRequestSchema>;