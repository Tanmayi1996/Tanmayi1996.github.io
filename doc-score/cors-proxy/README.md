# DocScore Lab CORS proxy

Use this optional Cloudflare Worker when a public documentation host blocks direct browser requests with a CORS error.

This is a restricted fetch proxy, not an open proxy. It:
- accepts requests only from `https://tanmayi1996.github.io`;
- allows only HTTPS URLs on exact hostnames listed in `ALLOWED_HOSTS`;
- validates each redirect against the same allowlist;
- sends no browser cookies, authorization headers, or user credentials upstream;
- accepts HTML or plain-text responses up to 2 MB;
- uses a 15-second upstream timeout and does not cache page content.

## Deploy in Cloudflare

1. Sign in to Cloudflare.
2. Open **Workers & Pages**.
3. Select **Create application**, then create a **Worker** and deploy the starter.
4. Open the Worker editor and replace its code with the contents of [worker.js](worker.js). Save and deploy.
5. Open the Worker settings and add these environment variables:

| Variable | Value |
|---|---|
| `SITE_ORIGIN` | `https://tanmayi1996.github.io` |
| `ALLOWED_HOSTS` | `help.salesforce.com` |

Add any other public documentation hostnames you trust to `ALLOWED_HOSTS`, separated by commas. Use exact hostnames, not broad wildcards. For example, add `,docs.example.com` if you need that exact host. Deploy the changes.

6. Copy the Worker URL shown by Cloudflare. It normally ends in `.workers.dev`.

Cloudflare's current dashboard setup is documented in the [Workers dashboard quick start](https://developers.cloudflare.com/workers/get-started/dashboard/). Environment variables are configured under the Worker settings; see [Cloudflare environment variables](https://developers.cloudflare.com/workers/configuration/environment-variables/).

## Connect it to DocScore Lab

1. Open [DocScore Lab](https://tanmayi1996.github.io/doc-score/).
2. Select **Fetch URL**.
3. Enter the public Salesforce Help article URL.
4. Paste your Worker URL into **Optional fetch proxy URL**.
5. Select **Fetch page**, then **Analyze documentation**.

You only need to enter the Worker URL once per browser session; the page does not persist it.

## Salesforce-specific notes

The proxy can only fetch content that is publicly accessible without a Salesforce login. It does not forward your Salesforce cookies or SSO session. If Salesforce returns a login page, access-denied page, challenge page, or a client-rendered shell without the article body, open the article in your browser and use **Save page as HTML** or copy the article text into DocScore Lab instead.

A successful HTTP response does not guarantee that every dynamically loaded section is present. Check the extracted text before relying on the score.

## Security and operational notes

- Do not add internal-only documentation hosts to the allowlist unless you administer them and understand the exposure.
- Do not send credentials, cookies, access tokens, or customer data through this proxy.
- The allowlist is a deliberate safety boundary. Do not remove it or accept arbitrary hosts from the browser.
- This Worker does not store page content, but your Cloudflare account may have operational logs. Review your account's logging settings.
- The proxy is optional. Paste and file upload remain available without it.


## Important security note

The exact-origin CORS check controls which browser pages can read the response; it is not user authentication because non-browser clients can forge an Origin header. The hostname allowlist is the primary outbound restriction. Keep it as narrow as possible, do not allow wildcard hosts, and configure Cloudflare rate limiting for the Worker to reduce automated abuse. Do not use this Worker for private or sensitive documents.

The Worker intentionally rejects requests without the portfolio Origin header. Requests from scripts, command-line clients, or other websites are not supported.

## If Salesforce still does not load

A CORS proxy cannot bypass Salesforce authentication, SSO, access controls, bot challenges, or JavaScript-rendered content. If the Worker reports a redirect blocked error or the article body is missing, use a browser-saved HTML copy or paste the visible article content into DocScore Lab. Do not try to forward your Salesforce cookies or SSO credentials.
