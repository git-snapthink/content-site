import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';

const directusUrl = import.meta.env.DIRECTUS_URL;
const directusToken = import.meta.env.DIRECTUS_TOKEN;

const directus = createDirectus(directusUrl)
  .with(staticToken(directusToken))
  .with(rest());

export async function getAllArticles() {
  return directus.request(
    readItems('articles', {
      filter: { status: { _eq: 'published' } },
      fields: [
        '*',
        'categories.categories_id.name',
        'categories.categories_id.slug',
        'tags.tags_id.name',
        'tags.tags_id.slug',
      ],
      sort: ['-published_at'],
    })
  );
}

export async function getArticleBySlug(slug: string) {
  const articles = await directus.request(
    readItems('articles', {
      filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
      fields: [
        '*',
        'categories.categories_id.name',
        'categories.categories_id.slug',
        'tags.tags_id.name',
        'tags.tags_id.slug',
      ],
      limit: 1,
    })
  );
  return (articles as any[])[0] || null;
}

export async function getAllCategories() {
  return directus.request(readItems('categories', { sort: ['name'] }));
}
