import GhostContentAPI from '@tryghost/content-api';

// Create a new GhostContentAPI instance
const api = new GhostContentAPI({
  url: import.meta.env.VITE_GHOST_API_URL || 'https://demo.ghost.io',
  key: import.meta.env.VITE_GHOST_CONTENT_API_KEY || '22444f78447824223cefc48062',
  version: "v5.0"
});

export const ghostService = {
  // Fetch all posts (optionally filtered by tag/page)
  getPosts: async (options = {}) => {
    try {
      const posts = await api.posts.browse({
        limit: 'all',
        include: 'tags,authors',
        ...options
      });
      // Normalize data structure for frontend (matching previous Contentful structure roughly)
      return posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.custom_excerpt || post.excerpt, // Use custom excerpt if available
        feature_image: post.feature_image, // Ghost uses 'feature_image' not 'coverImage'
        published_at: post.published_at,
        reading_time: post.reading_time,
        tags: post.tags,
        html: post.html, // Full HTML content
        url: post.url
      }));
    } catch (err) {
      console.error("Ghost API Error (Browse):", err);
      return [];
    }
  },

  // Fetch single post by slug
  getPostBySlug: async (slug) => {
    try {
      const post = await api.posts.read({
        slug: slug
      }, {
        include: 'tags,authors'
      });

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.custom_excerpt || post.excerpt,
        feature_image: post.feature_image,
        published_at: post.published_at,
        reading_time: post.reading_time,
        tags: post.tags,
        html: post.html,
        url: post.url,
        primary_author: post.primary_author
      };
    } catch (err) {
      console.error("Ghost API Error (Read):", err);
      return null;
    }
  }
};
