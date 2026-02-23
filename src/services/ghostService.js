import GhostContentAPI from '@tryghost/content-api';

let api;

try {
    if (import.meta.env.VITE_GHOST_API_URL && import.meta.env.VITE_GHOST_CONTENT_API_KEY) {
        api = new GhostContentAPI({
            url: import.meta.env.VITE_GHOST_API_URL,
            key: import.meta.env.VITE_GHOST_CONTENT_API_KEY,
            version: "v5.0"
        });
    } else {
        console.warn("Ghost API credentials missing. Content will not load.");
    }
} catch (e) {
    console.error("Failed to initialize Ghost API:", e);
}

export const ghostService = {
  // Fetch latest posts
  browsePosts: async (options = {}) => {
    if (!api) return [];
    try {
        return await api.posts.browse({
            limit: "all",
            include: "tags,authors",
            ...options
        });
    } catch (err) {
        console.error("Ghost browse error:", err);
        return [];
    }
  },

  // Fetch single post by slug
  readPost: async (slug) => {
    if (!api) return null;
    try {
        return await api.posts.read({ slug }, { include: "tags,authors" });
    } catch (err) {
         console.error("Ghost read error:", err);
         return null;
    }
  },

  // Fetch tags
  browseTags: async () => {
    if (!api) return [];
    try {
        return await api.tags.browse({ limit: "all" });
    } catch (err) {
         console.error("Ghost tags error:", err);
         return [];
    }
  }
};
