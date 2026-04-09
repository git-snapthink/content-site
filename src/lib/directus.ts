import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';

const directusUrl = import.meta.env.DIRECTUS_URL;
const directusToken = import.meta.env.DIRECTUS_TOKEN;

const brand = import.meta.env.BRAND;

const directus = createDirectus(directusUrl)
  .with(staticToken(directusToken))
  .with(rest());

function brandFilter(): Record<string, any> {
  const filter: Record<string, any> = { status: { _eq: 'published' } };
  if (brand) filter.brand = { _eq: brand };
  return filter;
}

export async function getAllArticles() {
  return directus.request(
    readItems('articles', {
      filter: brandFilter(),
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
      filter: { ...brandFilter(), slug: { _eq: slug } },
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
