# AEM Admin MCP Server

A Model Context Protocol (MCP) server that enables AI assistants like Claude Code and Cursor AI to interact with Adobe Experience Manager (AEM) Live Admin API for content management, publishing, and administrative tasks.

## Features

- **Content Publishing**: Publish content to AEM Live with force update and bulk options (also refreshes cache)
- **Content Preview**: Generate content previews for testing and validation
- **Cache Management**: Invalidate cache entries (Note: publishing content also refreshes cache automatically)
- **Sitemap Generation**: Create and update sitemaps for AEM Live sites
- **Snapshot Management**: Create content snapshots for versioning and backup

## Prerequisites

- Node.js 18.0.0 or higher
- AEM Live instance with Admin API access
- API authentication credentials (API key or auth token)

> **Need an API key?** Use our [Universal Setup Tool](setup.html) which includes API key generation and testing features.

## Installation

### For Claude Code

```bash
# Install the server globally
npm install -g aem-admin-mcp-server

# Add to Claude Code (replace YOUR_API_KEY with your actual AEM API key)
claude mcp add aem-admin --env AEM_API_KEY=YOUR_API_KEY --env AEM_BASE_URL=https://admin.hlx.page -- aem-admin-mcp-server
```

### For Cursor AI

Follow the [official Cursor MCP setup guide](https://docs.cursor.com/en/tools/developers) and use this configuration:

#### Option 1: One-Click Installation (Recommended)
Open the [Universal Setup Tool](setup.html) in your browser:
1. Enter your AEM API Key
2. Click "📱 Add to Cursor (One-Click)" to automatically configure Cursor
3. Cursor will open and prompt you to add the MCP server

#### Option 2: Manual Configuration
Build the project and add this to your Cursor MCP settings (see [Cursor docs](https://docs.cursor.com/en/tools/developers) for setup location):

```bash
# Build the project
npm install
npm run build
```

```json
{
  "mcpServers": {
    "aem-admin": {
      "command": "node",
      "args": ["/Users/rivero/ai/mcp/aem-authoring/build/index.js"],
      "env": {
        "AEM_API_KEY": "YOUR_API_KEY",
        "AEM_BASE_URL": "https://admin.hlx.page"
      }
    }
  }
}
```

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd aem-admin-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

## Configuration

Configure the server using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `AEM_BASE_URL` | AEM Admin API base URL | `https://admin.hlx.page` |
| `AEM_API_KEY` | API key for authentication | Required |
| `AEM_AUTH_TOKEN` | Alternative auth token | Optional |
| `AEM_TIMEOUT` | Request timeout in milliseconds | `30000` |

## Available Tools

### `publish_content`
Publish content to AEM Live.

```typescript
{
  org: string;           // Organization (e.g., "adobecom")
  site: string;          // Site repository (e.g., "milo")
  ref?: string;          // Git branch (default: "main")
  path: string;          // Content path (e.g., "/en/products")
  force?: boolean;       // Force update even if up to date
  bulk?: boolean;        // Use bulk publishing endpoint
}
```

### `preview_content`
Generate content preview.

```typescript
{
  org: string;           // Organization (e.g., "adobecom")
  site: string;          // Site repository (e.g., "milo")
  ref?: string;          // Git branch (default: "main")
  path: string;          // Content path (e.g., "/en/products")
}
```

### `invalidate_cache`
Invalidate AEM Live cache. **Note**: Publishing content automatically refreshes cache, so use `publish_content` if this tool doesn't work.

```typescript
{
  org: string;           // Organization (e.g., "adobecom")
  site: string;          // Site repository (e.g., "milo")
  ref?: string;          // Git branch (default: "main")
  path: string;          // Content path (e.g., "/en/products")
}
```

### `generate_sitemap`
Generate sitemap for AEM Live site.

```typescript
{
  org: string;           // Organization (e.g., "adobecom")
  site: string;          // Site repository (e.g., "milo")
  ref?: string;          // Git branch (default: "main")
  path?: string;         // Optional specific path
}
```

### `create_snapshot`
Create content snapshot.

```typescript
{
  org: string;           // Organization (e.g., "adobecom")
  site: string;          // Site repository (e.g., "milo")
  name: string;          // Snapshot name
  description?: string;  // Optional description
  paths?: string[];      // Optional specific paths
}
```

## Usage Examples

### With Claude Code

```bash
# Publish a specific page for Milo project
> "Publish the /en/products page for adobecom/milo project"

# Generate a preview
> "Create a preview for /en/products on adobecom/milo main branch"

# Clear cache for a specific path (or use publish_content as alternative)
> "Invalidate the cache for /en/products on adobecom/milo"
> "Publish /en/products on adobecom/milo to refresh cache"

# Generate sitemap for Milo
> "Generate a sitemap for adobecom/milo project"

# Create a snapshot
> "Create a snapshot named 'pre-release-backup' for adobecom/milo"
```

### With Cursor AI

Simply ask Cursor AI to perform AEM operations and it will use the available tools automatically.

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test:coverage

# Test with MCP Inspector
npx @modelcontextprotocol/inspector node build/index.js
```

## Development

### Code Structure

The project follows modular design principles:

- `src/tools/` - Individual tool implementations (<50 lines each)
- `src/utils/` - Shared utilities (HTTP client, logger, validation)
- `src/auth/` - Authentication management
- `src/config/` - Configuration management
- `src/types/` - TypeScript type definitions

### Core Principles

- **KISS**: Keep It Simple - single-purpose tools with clear naming
- **YAGNI**: You Aren't Gonna Need It - essential features only
- **DRY**: Don't Repeat Yourself - shared utilities for common patterns

### File Limits

- Functions: <50 lines
- Classes: <100 lines
- Files: <500 lines

## Error Handling

The server includes comprehensive error handling:

- Input validation using Zod schemas
- HTTP request/response error handling
- Structured logging for debugging
- Graceful error responses to MCP clients

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the coding standards (ESLint configuration provided)
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and feature requests, please open an issue in the repository.