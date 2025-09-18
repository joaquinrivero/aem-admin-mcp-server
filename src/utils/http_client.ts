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
      // Use Authorization: token format as per AEM Live documentation
      headers['Authorization'] = `token ${this.config.apiKey}`;
    } else if (this.config.authToken) {
      headers['Authorization'] = `token ${this.config.authToken}`;
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

      const requestOptions: RequestInit = {
        method,
        headers: this.getHeaders(),
        signal: controller.signal
      };

      // Only add body and Content-Type if we actually have data to send
      if (body !== undefined && body !== null) {
        requestOptions.body = JSON.stringify(body);
      } else {
        // Remove Content-Type for requests without body
        const headers = { ...requestOptions.headers };
        delete (headers as any)['Content-Type'];
        requestOptions.headers = headers;
      }

      const response = await fetch(url, requestOptions);

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        // Handle non-JSON responses (HTML, plain text, etc.)
        const textResponse = await response.text();
        responseData = { message: textResponse, raw: textResponse };
      }

      if (!response.ok) {
        logger.error('AEM API request failed', {
          url,
          method,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          data: responseData
        });

        return {
          success: false,
          error: responseData.message || responseData.raw || response.statusText
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