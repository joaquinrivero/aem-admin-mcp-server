export interface AemConfig {
  baseUrl: string;
  apiKey?: string;
  authToken?: string;
  timeout?: number;
}

export interface AemResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PublishRequest {
  path: string;
  force?: boolean;
  bulk?: boolean;
}

export interface PreviewRequest {
  path: string;
  host?: string;
}

export interface CacheRequest {
  path?: string;
  pattern?: string;
  purgeAll?: boolean;
}

export interface SitemapRequest {
  host: string;
  path?: string;
}

export interface SnapshotRequest {
  name: string;
  description?: string;
  paths?: string[];
}