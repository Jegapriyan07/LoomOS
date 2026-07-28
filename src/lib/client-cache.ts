/**
 * Short-lived client cache so tab switches don't blank the UI
 * or re-hit Neon for every navigation.
 */
const store = new Map<string, { at: number; data: unknown }>();
const inflight = new Map<string, Promise<unknown>>();

const TTL_MS = 45_000;

export async function cachedJson<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const key = url;
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) {
    return hit.data as T;
  }

  const pending = inflight.get(key);
  if (pending) return pending as Promise<T>;

  const req = (async () => {
    const res = await fetch(url, {
      ...init,
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${url}`);
    }
    const data = (await res.json()) as T;
    store.set(key, { at: Date.now(), data });
    return data;
  })().finally(() => {
    inflight.delete(key);
  });

  inflight.set(key, req);
  return req;
}

export function invalidateCached(urlPrefix?: string) {
  if (!urlPrefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(urlPrefix)) store.delete(key);
  }
}
