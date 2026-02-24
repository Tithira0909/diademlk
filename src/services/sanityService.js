import { createClient } from '@sanity/client';
import createImageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'dummy_project_id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
});

// Safe builder initialization
let builder;
try {
    builder = createImageUrlBuilder(sanityClient);
} catch (e) {
    console.error("Sanity Image Builder Init Failed", e);
}

export const urlFor = (source) => {
  // Mock Builder pattern for testing or fallbacks
  const mockBuilder = {
    url: () => "https://via.placeholder.com/800x600?text=Mock+Image",
    width: function() { return this; },
    height: function() { return this; },
    fit: function() { return this; },
    auto: function() { return this; }
  };

  if (!source) return mockBuilder;

  // Check if source is a mock ref (used in Playwright tests)
  if (source.asset && source.asset._ref && source.asset._ref.startsWith('image-mock')) {
      return mockBuilder;
  }

  if (!builder) return mockBuilder;

  try {
      return builder.image(source);
  } catch (e) {
      console.warn("Sanity Image Builder Failed for source:", source, e);
      return mockBuilder;
  }
};

export const sanityService = {
  // Fetch all posts (articles)
  getPosts: async () => {
    try {
        const query = `*[_type == "post"] | order(publishedAt desc) {
            _id,
            title,
            slug,
            publishedAt,
            mainImage,
            excerpt,
            "categories": categories[]->title,
            "author": author->name
        }`;
        const posts = await sanityClient.fetch(query);
        return posts || [];
    } catch (error) {
        console.error("Sanity Fetch Error:", error);
        return [];
    }
  },

  // Fetch single post by slug
  getPostBySlug: async (slug) => {
    try {
        const query = `*[_type == "post" && slug.current == $slug][0] {
            _id,
            title,
            slug,
            publishedAt,
            mainImage,
            body,
            "categories": categories[]->title,
            "author": author->name
        }`;
        const post = await sanityClient.fetch(query, { slug });
        return post;
    } catch (error) {
        console.error("Sanity Single Fetch Error:", error);
        return null;
    }
  }
};
