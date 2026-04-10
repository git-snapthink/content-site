import type { APIRoute } from 'astro';
import { getAllArticles, getAllCategories } from '../lib/directus';

const siteUrl = import.meta.env.SITE_URL || 'https://example.com';

export const GET: APIRoute = async () => {
  const articles = await getAllArticles();
  const categories = await getAllCategories();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/articles</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${(categories as any[])
    .map(
      (cat) => `
  <url>
    <loc>${siteUrl}/category/${cat.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
  ${(articles as any[])
    .map(
      (article) => `
  <url>
    <loc>${siteUrl}/articles/${article.slug}</loc>
    <lastmod>${article.published_at ? new Date(article.published_at).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
