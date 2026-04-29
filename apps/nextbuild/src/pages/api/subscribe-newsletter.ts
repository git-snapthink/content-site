export const prerender = false;

import type { APIRoute } from 'astro';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const email = (body as Record<string, unknown>)?.email;

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const substackRes = await fetch('https://jasonclewis.substack.com/api/v1/free', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, public_brand: 'jason-c-lewis', first_name: '' }),
    });

    if (substackRes.status === 200 || substackRes.status === 201) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const errorText = await substackRes.text().catch(() => '');
    console.error(`Substack subscribe error: ${substackRes.status}`, errorText);

    return new Response(JSON.stringify({ error: 'Subscription service error' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Substack subscribe fetch failed:', err);
    return new Response(JSON.stringify({ error: 'Subscription service unavailable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
