import type { MetadataRoute } from 'next';
import { INITIAL_NEWS_ARTICLES, DEFAULT_NEWS_CATEGORIES } from '@/lib/default-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://netibhaaratham.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'always',
      priority: 1.0,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = DEFAULT_NEWS_CATEGORIES.filter((c) => c.active).map(
    (cat) => ({
      url: `${baseUrl}/?category=${encodeURIComponent(cat.name)}`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.8,
    })
  );

  const articleRoutes: MetadataRoute.Sitemap = INITIAL_NEWS_ARTICLES.filter(
    (n) => n.status === 'PUBLISHED'
  ).map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
