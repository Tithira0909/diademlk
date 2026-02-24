
const STRAPI_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

export const strapiService = {
  // Helper to get full image URL
  getMediaUrl: (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('//')) return url;
    return `${STRAPI_URL}${url}`;
  },

  // Fetch all articles
  getArticles: async () => {
    try {
      const res = await fetch(`${STRAPI_URL}/api/articles?populate=*&sort=createdAt:desc`);
      if (!res.ok) throw new Error('Failed to fetch Strapi articles');
      const json = await res.json();
      return json.data; // Returns array of { id, attributes: { ... } }
    } catch (error) {
      console.error("Strapi fetch error:", error);
      return [];
    }
  },

  // Fetch single article by slug
  getArticleBySlug: async (slug) => {
    try {
      // Assuming 'slug' field exists and is unique
      const res = await fetch(`${STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`);
      if (!res.ok) throw new Error('Failed to fetch article');
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        return json.data[0];
      }
      return null;
    } catch (error) {
      console.error("Strapi single fetch error:", error);
      return null;
    }
  }
};
