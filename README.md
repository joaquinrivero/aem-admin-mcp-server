# AEM Admin MCP Server

Connect your AI assistant (Claude Code or Cursor AI) directly to Adobe Experience Manager (AEM) Live for seamless content management. Publish pages, generate previews, manage cache, and create backups - all through natural conversation with your AI.

## What You Can Do

- **📤 Publish Content**: Deploy your pages to AEM Live instantly
- **👀 Preview Changes**: Test your content before going live
- **🔄 Refresh Cache**: Clear cache to show latest updates
- **🗺️ Generate Sitemaps**: Create site maps for better SEO
- **💾 Create Backups**: Save snapshots of your content

## Quick Start

### Step 1: Get Your API Key
Use our [Universal Setup Tool](setup.html) to get your AEM API key and test the connection.

### Step 2: Install for Your AI Assistant

**For Claude Code:**
```bash
npm install -g aem-admin-mcp-server
claude mcp add aem-admin --env AEM_API_KEY=YOUR_API_KEY --env AEM_BASE_URL=https://admin.hlx.page -- aem-admin-mcp-server
```

**For Cursor AI:**
1. Open the [Universal Setup Tool](setup.html)
2. Enter your AEM API Key
3. Click "📱 Add to Cursor (One-Click)" to automatically configure Cursor
4. Cursor will open and prompt you to add the MCP server

### Step 3: Start Using It!
Just ask your AI assistant to help with AEM tasks:
- "Publish the /en/products page for adobecom/milo"
- "Create a preview for /en/products on adobecom/milo"
- "Generate a sitemap for adobecom/milo"
- "Create a backup snapshot for adobecom/milo"

## How It Works

This tool connects your AI assistant to AEM Live through a simple bridge. When you ask your AI to "publish a page," it automatically:

1. **Understands** your request in natural language
2. **Translates** it to the correct AEM API calls
3. **Executes** the action on your AEM Live instance
4. **Reports** back the results in plain English

## Common Tasks

### Publishing Content
Ask your AI: *"Publish the /en/products page for adobecom/milo"*

**What happens:**
- Your AI connects to AEM Live
- Publishes the specified page
- Refreshes the cache automatically
- Confirms the page is live

### Creating Previews
Ask your AI: *"Create a preview for /en/products on adobecom/milo"*

**What happens:**
- Generates a preview URL
- Shows you exactly how the page will look
- Perfect for testing before going live

### Managing Cache
Ask your AI: *"Refresh the cache for /en/products on adobecom/milo"*

**What happens:**
- Clears the cache for that specific page
- Ensures visitors see the latest changes
- Alternative: Just publish the page (cache refreshes automatically)

### Generating Sitemaps
Ask your AI: *"Generate a sitemap for adobecom/milo"*

**What happens:**
- Creates a complete sitemap of your site
- Helps search engines find all your pages
- Improves SEO automatically

### Creating Backups
Ask your AI: *"Create a backup snapshot named 'pre-release-backup' for adobecom/milo"*

**What happens:**
- Saves a snapshot of your current content
- Creates a restore point before major changes
- Includes optional description and specific paths

## What You Need

- **AEM Live Access**: Your organization must have AEM Live with Admin API enabled
- **API Key**: Get this from your AEM administrator or use our [setup tool](setup.html)
- **AI Assistant**: Claude Code or Cursor AI (both supported)

## Troubleshooting

### "API Key Invalid" Error
- Double-check your API key in the [setup tool](setup.html)
- Ensure your organization has AEM Live Admin API access
- Contact your AEM administrator if needed

### "Page Not Found" Error
- Verify the organization name (e.g., "adobecom")
- Check the site repository name (e.g., "milo")
- Confirm the page path exists (e.g., "/en/products")

### Cache Issues
- Publishing content automatically refreshes cache
- If cache problems persist, try publishing the page again
- Use the cache invalidation tool as a last resort

## Tips for Better Results

### Be Specific
✅ **Good**: "Publish the /en/products page for adobecom/milo"
❌ **Vague**: "Publish something"

### Include Context
✅ **Good**: "Create a preview for /en/products on adobecom/milo main branch"
❌ **Missing**: "Create preview"

### Use Natural Language
✅ **Good**: "Generate a sitemap for adobecom/milo"
❌ **Technical**: "Execute generate_sitemap with org=adobecom, site=milo"

## Advanced Configuration

If you need to customize the connection settings, you can modify these environment variables:

| Setting | What It Does | Default |
|---------|--------------|---------|
| `AEM_BASE_URL` | AEM Live server address | `https://admin.hlx.page` |
| `AEM_API_KEY` | Your authentication key | Required |
| `AEM_TIMEOUT` | How long to wait for responses | 30 seconds |

## Getting Help

### Common Questions

**Q: Can I use this with other AI assistants?**
A: Currently optimized for Claude Code and Cursor AI, but other MCP-compatible assistants should work.

**Q: What if I don't have an API key?**
A: Contact your AEM administrator or use our [setup tool](setup.html) to generate one.

**Q: Can I publish multiple pages at once?**
A: Yes! Ask your AI: "Publish all pages in /en/products for adobecom/milo"

**Q: Is my data secure?**
A: Yes, all communication uses HTTPS and your API key is stored securely on your device.

### Need More Help?

- **Setup Issues**: Use our [Universal Setup Tool](setup.html) for guided configuration
- **Technical Problems**: Check the troubleshooting section above
- **Feature Requests**: Open an issue in the repository
- **General Questions**: Contact your AEM administrator

---

**Ready to get started?** Use our [Universal Setup Tool](setup.html) to set up your API key and start managing AEM content with your AI assistant!
