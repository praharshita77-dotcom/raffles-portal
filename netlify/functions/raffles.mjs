// Netlify serverless function: securely proxies the chat to Claude.
// The API credentials live here on the server, never in the webpage.
//
// Two ways this gets its credentials, in order of preference:
//   1. Netlify AI Gateway (easiest): if you enable AI features on your site,
//      Netlify auto-injects ANTHROPIC_API_KEY and ANTHROPIC_BASE_URL for you —
//      no Anthropic account needed. Usage is billed as Netlify credits.
//   2. Your own key: set an environment variable ANTHROPIC_API_KEY in your
//      Netlify site settings to a key from console.anthropic.com.

export default async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON in request body" }, 400);
  }

  const baseUrl = process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com";
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return jsonResponse(
      { error: "No API credentials found. Enable AI features on this Netlify site, or set ANTHROPIC_API_KEY in site environment variables." },
      500
    );
  }

  // Build the request from the page's input, with the model + limits fixed here.
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: payload.system,
    messages: payload.messages
  };

  try {
    const upstream = await fetch(`${baseUrl}/v1/messages`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(body)
    });

    const data = await upstream.json();
    return jsonResponse(data, upstream.status);
  } catch (err) {
    return jsonResponse({ error: "Upstream request failed", detail: String(err) }, 502);
  }
};

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" }
  });
}
