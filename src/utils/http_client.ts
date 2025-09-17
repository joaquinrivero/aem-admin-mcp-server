import type { AemConfig, AemResponse } from '@/types';
import { logger } from './logger.js';

export class AemHttpClient {
  private config: AemConfig;

  constructor(config: AemConfig) {
    this.config = config;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    } else if (this.config.authToken) {
      headers['Authorization'] = `Token ${this.config.authToken}`;
    }

    return headers;
  }

  private async makeRequest<T>(
    method: string,
    endpoint: string,
    body?: any
  ): Promise<AemResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const timeout = this.config.timeout || 30000;

    logger.debug('Making AEM API request', { method, url, body });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok) {
        logger.error('AEM API request failed', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });

        return {
          success: false,
          error: responseData.message || response.statusText
        };
      }

      logger.debug('AEM API request successful', { url, status: response.status });

      return {
        success: true,
        data: responseData
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('AEM API request error', { url, error: errorMessage });

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async get<T>(endpoint: string): Promise<AemResponse<T>> {
    return this.makeRequest<T>('GET', endpoint);
  }

  async post<T>(endpoint: string, body?: any): Promise<AemResponse<T>> {
    return this.makeRequest<T>('POST', endpoint, body);
  }

  async put<T>(endpoint: string, body?: any): Promise<AemResponse<T>> {
    return this.makeRequest<T>('PUT', endpoint, body);
  }

  async delete<T>(endpoint: string): Promise<AemResponse<T>> {
    return this.makeRequest<T>('DELETE', endpoint);
  }
}

export function createHttpClient(config: AemConfig): AemHttpClient {
  return new AemHttpClient(config);
}