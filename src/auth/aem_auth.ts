import type { AemConfig } from '@/types/index.js';
import { logger } from '@/utils/index.js';

export interface AuthCredentials {
  apiKey?: string;
  authToken?: string;
}

export class AemAuthManager {
  private credentials: AuthCredentials = {};

  constructor(credentials?: AuthCredentials) {
    if (credentials) {
      this.setCredentials(credentials);
    }
  }

  setCredentials(credentials: AuthCredentials): void {
    this.credentials = { ...credentials };
    logger.debug('AEM credentials updated');
  }

  getCredentials(): AuthCredentials {
    return { ...this.credentials };
  }

  isAuthenticated(): boolean {
    return !!(this.credentials.apiKey || this.credentials.authToken);
  }

  clearCredentials(): void {
    this.credentials = {};
    logger.debug('AEM credentials cleared');
  }

  static fromEnvironment(): AemAuthManager {
    const credentials: AuthCredentials = {};

    if (process.env.AEM_API_KEY) {
      credentials.apiKey = process.env.AEM_API_KEY;
    }

    if (process.env.AEM_AUTH_TOKEN) {
      credentials.authToken = process.env.AEM_AUTH_TOKEN;
    }

    return new AemAuthManager(credentials);
  }

  applyToConfig(config: AemConfig): AemConfig {
    return {
      ...config,
      ...this.credentials
    };
  }
}

export function createAuthManager(credentials?: AuthCredentials): AemAuthManager {
  return new AemAuthManager(credentials);
}