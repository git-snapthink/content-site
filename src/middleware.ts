import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const brand = import.meta.env.PUBLIC_BRAND;
  if (brand === 'jason-c-lewis' && context.url.pathname === '/') {
    return context.rewrite('/jcl');
  }
  return next();
});
