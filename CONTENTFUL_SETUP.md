# Contentful CMS Setup Guide

This project uses Contentful as a Headless CMS to manage blog posts. Follow these steps to set up your content management system.

## 1. Create a Contentful Account & Space
1. Sign up for a free account at [Contentful](https://www.contentful.com/).
2. Create a new "Space" (e.g., "Diadem Website").
3. Select the "Empty Space" template to start fresh.

## 2. Define the Content Model (CRITICAL)
For the website to fetch articles correctly, you must create a Content Type with specific Field IDs.

1. Go to the **Content model** tab.
2. Click **Add content type**.
3. Name it **Blog Post**.
4. Set the **Api Identifier** to `blogPost` (case-sensitive!).
5. Click **Create**.

### Add Fields (Field ID must match exactly)

| Field Name | Type | Field ID (API Identifier) | Notes |
| :--- | :--- | :--- | :--- |
| **Title** | Text (Short text) | `title` | Required, Entry title |
| **Slug** | Text (Short text) | `slug` | Required, Unique, URL-friendly (e.g., `my-first-post`) |
| **Excerpt** | Text (Long text) | `excerpt` | Short summary for the blog card |
| **Cover Image** | Media (One file) | `coverImage` | Featured image for the blog card |
| **Category** | Text (Short text) | `category` | e.g., "Technology", "News" |
| **Body** | Rich Text | `body` | The main article content |
| **Author** | Text (Short text) | `author` | Optional, defaults to "Diadem" if empty |

**Important:** Make sure the "Field ID" matches exactly what is listed above. You can verify this by clicking "Settings" on each field.

## 3. Get Your API Keys
1. Go to **Settings** > **API keys**.
2. Click **Add API key**.
3. Name it "Website Key".
4. Copy the following values:
   - **Space ID**
   - **Content Delivery API - access token** (Do not use the Preview API token)

## 4. Configure the Website
1. Open the `.env` file in your project root.
2. Paste your keys:

```bash
VITE_CONTENTFUL_SPACE_ID=your_space_id_here
VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token_here
```

3. Restart your development server:
```bash
npm run dev
```

## 5. Create Your First Post
1. Go to the **Content** tab in Contentful.
2. Click **Add entry** > **Blog Post**.
3. Fill in the Title, Slug (e.g., `hello-world`), Excerpt, and Body.
4. Add a Cover Image and Category.
5. Click **Publish**.

Your new article should now appear on the website!
