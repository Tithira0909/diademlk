import { createClient } from 'contentful';

// These should be in your .env file
// VITE_CONTENTFUL_SPACE_ID="your_space_id"
// VITE_CONTENTFUL_ACCESS_TOKEN="your_access_token"

const SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID || 'dummy_space_id';
const ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || 'dummy_token';

let client;
try {
    client = createClient({
        space: SPACE_ID,
        accessToken: ACCESS_TOKEN,
    });
} catch (e) {
    console.error("Contentful Client Init Failed:", e);
}

export const contentfulService = {
  // Fetch all posts (entries of content type 'blogPost')
  getPosts: async () => {
    if (!client) return [];
    try {
        const entries = await client.getEntries({
            content_type: 'blogPost',
            order: '-sys.createdAt'
        });
        // Normalize data structure for frontend
        return entries.items.map(entry => ({
            id: entry.sys.id,
            title: entry.fields.title,
            slug: entry.fields.slug,
            publishedAt: entry.sys.createdAt,
            excerpt: entry.fields.excerpt,
            coverImage: entry.fields.coverImage ? `https:${entry.fields.coverImage.fields.file.url}` : null,
            categories: entry.fields.category ? [entry.fields.category] : [], // Assuming simple string or single ref for now
            body: entry.fields.body // Rich Text Document
        }));
    } catch (error) {
        console.error("Contentful Fetch Error:", error);
        return [];
    }
  },

  // Fetch single post by slug
  getPostBySlug: async (slug) => {
    if (!client) return null;
    try {
        const entries = await client.getEntries({
            content_type: 'blogPost',
            'fields.slug': slug,
            limit: 1
        });

        if (entries.items.length === 0) return null;

        const entry = entries.items[0];
        return {
            id: entry.sys.id,
            title: entry.fields.title,
            slug: entry.fields.slug,
            publishedAt: entry.sys.createdAt,
            excerpt: entry.fields.excerpt,
            coverImage: entry.fields.coverImage ? `https:${entry.fields.coverImage.fields.file.url}` : null,
            categories: entry.fields.category ? [entry.fields.category] : [],
            body: entry.fields.body, // Rich Text Document
            author: entry.fields.author || 'Diadem'
        };
    } catch (error) {
        console.error("Contentful Single Fetch Error:", error);
        return null;
    }
  }
};
