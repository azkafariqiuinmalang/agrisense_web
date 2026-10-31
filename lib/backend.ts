import "server-only";

export class BackendError extends Error {
  constructor(public status: number) { super("backend_request_failed"); }
}

function origin() {
  const value = process.env.AGRISENSE_PLATFORM_URL || (process.env.NODE_ENV === "production" ? "" : "http://127.0.0.1:3009");
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new BackendError(503);
  }
  return url.origin;
}

// Fixed paths only. The web server has no database credential or AI token.
export async function backend(path: "/identity/login" | "/identity/profile" | "/identity/dashboard" | "/admin/dashboard", token?: string, body?: unknown, query?: URLSearchParams): Promise<unknown> {
  try {
    const response = await fetch(origin() + path + (query?.size ? "?" + query.toString() : ""), {
      method: body === undefined ? "GET" : "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new BackendError(response.status);
    const reader = response.body?.getReader();
    if (!reader) throw new BackendError(502);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1024 * 1024) { await reader.cancel(); throw new BackendError(502); }
      chunks.push(value);
    }
    const raw = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { raw.set(chunk, offset); offset += chunk.length; }
    return JSON.parse(new TextDecoder().decode(raw));
  } catch (error) {
    if (error instanceof BackendError) throw error;
    throw new BackendError(503);
  }
}
