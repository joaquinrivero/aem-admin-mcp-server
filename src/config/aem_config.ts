import type { AemConfig } from '@/types/index.js';
import { AemAuthManager } from '@/auth/index.js';
import { logger } from '@/utils/index.js';

export class AemConfigManager {
  private config: AemConfig;
  private authManager: AemAuthManager;

  constructor(baseConfig: Partial<AemConfig> = {}) {
    this.config = {
      baseUrl: baseConfig.baseUrl || this.getDefaultBaseUrl(),
      timeout: baseConfig.timeout || 30000,
      ...baseConfig
    };

    this.authManager = AemAuthManager.fromEnvironment();
    logger.info('AEM configuration initialized', { baseUrl: this.config.baseUrl });
  }

  private getDefaultBaseUrl(): string {
    return process.env.AEM_BASE_URL || 'https://admin.hlx.page';
  }

  getConfig(): AemConfig {
    return this.authManager.applyToConfig(this.config);
  }

  updateBaseUrl(baseUrl: string): void {
    this.config.baseUrl = baseUrl;
    logger.info('AEM base URL updated', { baseUrl });
  }

  updateTimeout(timeout: number): void {
    this.config.timeout = timeout;
    logger.debug('AEM timeout updated', { timeout });
  }

  getAuthManager(): AemAuthManager {
    return this.authManager;
  }

  static fromEnvironment(): AemConfigManager {
    const config: Partial<AemConfig> = {};

    if (process.env.AEM_BASE_URL) {
      config.baseUrl = process.env.AEM_BASE_URL;
    }

    if (process.env.AEM_TIMEOUT) {
      config.timeout = parseInt(process.env.AEM_TIMEOUT, 10);
    }

    return new AemConfigManager(config);
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.baseUrl) {
      errors.push('Base URL is required');
    }

    if (!this.authManager.isAuthenticated()) {
      errors.push('Authentication credentials are required (AEM_API_KEY or AEM_AUTH_TOKEN)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export function createConfigManager(config?: Partial<AemConfig>): AemConfigManager {
  return new AemConfigManager(config);
}