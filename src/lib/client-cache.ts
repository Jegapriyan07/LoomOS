/**
 * Short-lived client cache so tab switches don't blank the UI
 * or re-hit Neon for every navigation.
 *
 * Important: failed in-flight requests must not be reused after login
 * (session cookie rotation). invalidateCached clears both store + inflight.
 */
const store = new Map<string, { at: number; data: unknown }>();
const inflight = new Map<string, Promise<unknown>>();

const TTL_MS = 45_000;
const DEFAULT_TIMEOUT_MS = 12_000;

export async function cachedJson<T>(
  url: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<T> {
  const key = url;
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) {
    return hit.data as T;
  }

  const pending = inflight.get(key);
  if (pending) return pending as Promise<T>;

  const timeoutMs = init?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const { timeoutMs: _drop, ...rest } = init ?? {};

  const req = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        ...rest,
        cache: "no-store",
        credentials: "include",
        signal: controller.signal,
      });
      if (!res.ok) {
        inflight.delete(key);
        throw new Error(`Request failed: ${res.status} ${url}`);
      }
      const data = (await res.json()) as T;
      store.set(key, { at: Date.now(), data });
      return data;
    } catch (e) {
      inflight.delete(key);
      if (e instanceof Error && e.name === "AbortError") {
        throw new Error(`Request timed out: ${url}`);
      }
      throw e;
    } finally {
      clearTimeout(timer);
    }
  })().finally(() => {
    inflight.delete(key);
  });

  inflight.set(key, req);
  return req;
}

export function invalidateCached(urlPrefix?: string) {
  if (!urlPrefix) {
    store.clear();
    inflight.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(urlPrefix)) store.delete(key);
  }
  for (const key of inflight.keys()) {
    if (key.startsWith(urlPrefix)) inflight.delete(key);
  }
}

/** Read cached payload without network (if still fresh). */
export function peekCached<T>(url: string): T | null {
  const hit = store.get(url);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data as T;
  return null;
}
