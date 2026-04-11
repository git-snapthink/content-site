export const prerender = false;

import type { APIRoute } from 'astro';

function welcomeEmailHtml(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f9fafb; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; padding:40px; max-width:600px;">
          <tr>
            <td>
              <h1 style="margin:0 0 24px; font-size:24px; color:#111827;">Welcome to NextBuild.</h1>
              <p style="margin:0 0 16px; font-size:16px; line-height:1.6; color:#374151;">You joined because you're done researching and ready to start building. We're here to help you do exactly that.</p>
              <p style="margin:0 0 12px; font-size:16px; line-height:1.6; color:#374151;">Here's what you'll get from us:</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px 8px;">
                <tr>
                  <td style="padding:6px 0; font-size:16px; line-height:1.6; color:#374151; vertical-align:top;">&#8226;&nbsp;&nbsp;</td>
                  <td style="padding:6px 0; font-size:16px; line-height:1.6; color:#374151;"><strong>AI Playbooks</strong> — Step-by-step implementation guides, not theory. Pick a use case, follow the steps, ship something real.</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; font-size:16px; line-height:1.6; color:#374151; vertical-align:top;">&#8226;&nbsp;&nbsp;</td>
                  <td style="padding:6px 0; font-size:16px; line-height:1.6; color:#374151;"><strong>Tool Reviews</strong> — Honest breakdowns of what actually works for builders. No affiliate spam.</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; font-size:16px; line-height:1.6; color:#374151; vertical-align:top;">&#8226;&nbsp;&nbsp;</td>
                  <td style="padding:6px 0; font-size:16px; line-height:1.6; color:#374151;"><strong>Weekly Briefing</strong> — Curated AI news that matters: market shifts, new tools, and strategies worth your time.</td>
                </tr>
              </table>
              <p style="margin:0 0 16px; font-size:16px; line-height:1.6; color:#374151;">We're still early and building this alongside you. If there's something specific you're trying to ship, just reply to this email — we read everything.</p>
              <p style="margin:24px 0 0; font-size:16px; line-height:1.6; color:#374151;">Talk soon,<br>Jason<br>NextBuild</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  const apiKey = import.meta.env.RESEND_API_KEY;
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

  const res = await fetch('https://api.resend.com/contacts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, unsubscribed: false }),
  });

  const data = await res.json().catch(() => ({}));
  console.log('[subscribe]', res.status, JSON.stringify(data));

  if (res.ok || res.status === 409) {
    // Send welcome email for new contacts (skip for existing)
    if (res.ok) {
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Jason from NextBuild <jason@nextbuild.com>',
          to: email,
          subject: "You're in. Here's what comes next.",
          reply_to: 'jason@nextbuild.com',
          html: welcomeEmailHtml(),
        }),
      }).catch((err) => console.error('[welcome-email]', err));
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  }

  return new Response(JSON.stringify({ error: 'Subscription failed. Try again later.', detail: data }), {
    status: 502,
    headers,
  });
};
