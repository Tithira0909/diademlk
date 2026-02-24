# Ghost CMS Setup Guide

This project is integrated with Ghost CMS to provide a robust blog management system.

## 1. Prerequisites
You need a running Ghost instance. This can be:
- **Ghost Pro** (Managed hosting)
- **Self-Hosted Ghost** (e.g., on a VPS, DigitalOcean, etc.)

## 2. Get Your Content API Key
1. Log in to your Ghost Admin panel (usually at `yourdomain.com/ghost`).
2. Go to **Settings** (gear icon) > **Integrations**.
3. Scroll down and click **Add custom integration**.
4. Name it "Diadem Website".
5. Copy the following values:
   - **Content API URL** (e.g., `https://your-ghost-blog.com`)
   - **Content API Key** (starts with `...`)

## 3. Configure the Website
1. Open the `.env` file in your project root.
2. Update the Ghost configuration variables:

```bash
# Ghost API Integration
VITE_GHOST_API_URL=https://your-ghost-blog.com
VITE_GHOST_CONTENT_API_KEY=your_content_api_key_here
```

3. **Important:** If testing locally and your Ghost is local (e.g., `http://localhost:2368`), ensure the URL is accessible.

## 4. Restart Development Server
After changing the `.env` file, restart your development server:

```bash
npm run dev
```

## 5. Verify
The website will now automatically fetch the latest posts from your Ghost instance.
- **Featured Image:** Used as the card cover and article banner.
- **Excerpt:** Displayed on the blog card.
- **Tags:** The first tag is used as the category label.
