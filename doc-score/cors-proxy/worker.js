/**
 * DocScore Lab - restricted documentation fetch proxy.
 *
 * Deploy as a Cloudflare Worker. Configure:
 *   SITE_ORIGIN=https://tanmayi1996.github.io
 *   ALLOWED_HOSTS=help.salesforce.com
 *
 * ALLOWED_HOSTS is a comma-separated list of exact hostnames.
 * Never turn this into an unrestricted public proxy.
 */

const MAX_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 4;
const TIMEOUT_MS = 15000;

function corsHeaders(origin, allowedOrigin) {
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function reply(message, status, headers) {
  return new Response(message, {
    status: status,
    headers: Object.assign({
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }, headers || {})
  });
}

function parseAllowedHosts(value) {
  return String(value || "")
    .split(",")
    .map(function (host) { return host.trim().toLowerCase(); })
    .filter(Boolean);
}

function validateTarget(value, allowedHosts) {
  let url;
  try {
    url = new URL(value);
  } catch (_) {
    throw new Error("The supplied documentation URL is not valid.");
  }

  if (url.protocol !== "https:") {
    throw new Error("Only HTTPS documentation URLs are allowed.");
  }
  if (url.username || url.password) {
    throw new Error("URLs containing credentials are not allowed.");
  }
  if (url.port && url.port !== "443") {
    throw new Error("Custom ports are not allowed.");
  }
  if (!allowedHosts.includes(url.hostname.toLowerCase())) {
    throw new Error("This hostname is not in the proxy allowlist: " + url.hostname);
  }

  url.hash = "";
  return url;
}

export default {
  async fetch(request, env) {
    const allowedOrigin = env.SITE_ORIGIN || "https://tanmayi1996.github.io";
    const origin = request.headers.get("Origin");
    const headers = corsHeaders(origin, allowedOrigin);

    if (origin !== allowedOrigin) {
      return reply("Origin is not allowed.", 403);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: headers });
    }

    if (request.method !== "POST") {
      return reply("Use POST with a JSON body containing a url property.", 405, headers);
    }
    if (!(request.headers.get("Content-Type") || "").toLowerCase().includes("application/json")) {
      return reply("Send the request as application/json.", 415, headers);
    }

    const allowedHosts = parseAllowedHosts(env.ALLOWED_HOSTS);
    if (!allowedHosts.length) {
      return reply("The proxy administrator has not configured ALLOWED_HOSTS.", 503, headers);
    }

    let body;
    try {
      const raw = await request.text();
      if (raw.length > 4096) {
        return reply("Request body is too large.", 413, headers);
      }
      body = JSON.parse(raw);
    } catch (_) {
      return reply("Send a valid JSON body containing a url property.", 400, headers);
    }

    if (!body || typeof body.url !== "string") {
      return reply("The JSON body must contain a url string.", 400, headers);
    }

    let target;
    try {
      target = validateTarget(body.url, allowedHosts);
    } catch (error) {
      return reply(error.message, 400, headers);
    }

    let upstream;
    for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
      try {
        upstream = await fetch(target.href, {
          method: "GET",
          headers: { "Accept": "text/html, text/plain;q=0.9, application/xhtml+xml;q=0.8" },
          redirect: "manual",
          signal: AbortSignal.timeout(TIMEOUT_MS)
        });
      } catch (_) {
        return reply("The proxy could not reach the documentation host.", 502, headers);
      }

      if (![301, 302, 303, 307, 308].includes(upstream.status)) {
        break;
      }

      const location = upstream.headers.get("Location");
      if (!location) {
        return reply("The documentation host returned a redirect without a Location header.", 502, headers);
      }
      if (redirects === MAX_REDIRECTS) {
        return reply("The documentation host redirected too many times.", 502, headers);
      }
      try {
        target = validateTarget(new URL(location, target).href, allowedHosts);
      } catch (error) {
        return reply("Redirect blocked: " + error.message, 502, headers);
      }
    }

    if (!upstream || !upstream.ok) {
      const status = upstream ? upstream.status : 502;
      return reply("The documentation host returned HTTP " + status + ".", 502, headers);
    }

    const contentType = upstream.headers.get("Content-Type") || "";
    if (!/(text\/html|text\/plain|application\/xhtml\+xml)/i.test(contentType)) {
      return reply("The URL did not return HTML or plain text.", 415, headers);
    }

    const declaredLength = Number(upstream.headers.get("Content-Length") || 0);
    if (declaredLength > MAX_BYTES) {
      return reply("The page is larger than the 2 MB proxy limit.", 413, headers);
    }

    let content;
    try {
      content = await upstream.text();
    } catch (_) {
      return reply("The proxy could not read the upstream response.", 502, headers);
    }

    if (new TextEncoder().encode(content).byteLength > MAX_BYTES) {
      return reply("The page is larger than the 2 MB proxy limit.", 413, headers);
    }

    return new Response(content, {
      status: 200,
      headers: Object.assign({}, headers, {
        "Content-Type": /html|xhtml/i.test(contentType) ? "text/html; charset=utf-8" : "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      })
    });
  }
};
