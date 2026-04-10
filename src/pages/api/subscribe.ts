export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  const apiKey = import.meta.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Newsletter service not configured' }), {
      status: 500,
      headers,
    });
  }

  let email: string;
  try {
    const body = await request.json();
    email = body.email?.trim();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers,
    });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Valid email required' }), {
      status: 400,
      headers,
    });
  }

  const res = await fetch('https://api.buttondown.com/v1/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email_address: email }),
  });

  const data = await res.json().catch(() => ({}));
  console.log('[subscribe]', res.status, JSON.stringify(data));

  if (res.ok) {
    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  }

  // Buttondown returns 400 if already subscribed — treat as success
  if (res.status === 400) {
    const alreadySubscribed = JSON.stringify(data).toLowerCase().includes('already');
    if (alreadySubscribed) {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }
  }

  return new Response(JSON.stringify({ error: 'Subscription failed. Try again later.', detail: data }), {
    status: 502,
    headers,
  });
};
