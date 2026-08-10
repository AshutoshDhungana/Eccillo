const BASE = import.meta.env.VITE_API_URL ?? "/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, "body" | "headers"> {
  body?: unknown;
  /** Use for catalog endpoints that intentionally expect a non-JSON payload. */
  rawBody?: BodyInit;
  headers?: HeadersInit;
  auth?: boolean;
  idempotency?: boolean;
  idempotencyKey?: string;
  eventRevision?: number;
  responseType?: "json" | "blob" | "text";
}

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

const TOKEN_KEY = "eccillo.session";
let refreshPromise: Promise<boolean> | null = null;

function browserStorage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

export const tokenStore = {
  get(): StoredTokens | null {
    const raw = browserStorage()?.getItem(TOKEN_KEY);
    if (!raw) return null;
    try {
      const value = JSON.parse(raw) as StoredTokens;
      return value.accessToken && value.refreshToken ? value : null;
    } catch {
      return null;
    }
  },
  set(tokens: StoredTokens) {
    browserStorage()?.setItem(TOKEN_KEY, JSON.stringify(tokens));
  },
  clear() {
    browserStorage()?.removeItem(TOKEN_KEY);
    if (typeof window !== "undefined") window.dispatchEvent(new Event("eccillo:auth-expired"));
  },
};

function makeKey() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + "-" + Math.random().toString(16).slice(2);
}

function isWrite(method: string) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
}

function errorMessage(payload: unknown, fallback: string, status: number) {
  if (payload && typeof payload === "object") {
    const body = payload as Record<string, unknown>;
    const hasNestedErrors = Boolean(body.errors && typeof body.errors === "object");
    const errors = hasNestedErrors ? body.errors as Record<string, unknown> : body;
    if (!hasNestedErrors && typeof body.detail === "string") return body.detail;
    const messages = Object.entries(errors).flatMap(([field, value]) => {
      const text = Array.isArray(value)
        ? value.map((item) => {
          if (item && typeof item === "object" && "msg" in item && typeof item.msg === "string") return item.msg;
          return typeof item === "string" ? item : "";
        }).filter(Boolean).join(" ")
        : typeof value === "string" ? value : "";
      return text ? [(field === "non_field_errors" ? "" : field.replace(/_/g, " ") + ": ") + text] : [];
    });
    if (messages.length) return messages.join(" ");
    if (typeof body.detail === "string") return body.detail;
  }
  if (status === 401) return "Your email or password is incorrect.";
  if (status === 403) return "You do not have permission to complete this action.";
  if (status === 409) return "This change needs review or conflicts with newer event data.";
  return fallback || "We could not complete that request. Please try again.";
}

async function refreshSession() {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    const session = tokenStore.get();
    if (!session) return false;
    try {
      const response = await fetch(BASE + "/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: session.refreshToken }),
      });
      if (!response.ok) return false;
      const next = await response.json() as { access_token: string; refresh_token: string };
      tokenStore.set({ accessToken: next.access_token, refreshToken: next.refresh_token });
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const auth = options.auth !== false;
  const session = tokenStore.get();
  const headers = new Headers(options.headers);
  const idempotencyKey = options.idempotencyKey ?? (options.idempotency !== false && isWrite(method) ? makeKey() : undefined);

  if (options.body !== undefined && options.rawBody === undefined) headers.set("Content-Type", "application/json");
  if (auth && session?.accessToken) headers.set("Authorization", "Bearer " + session.accessToken);
  if (idempotencyKey) headers.set("Idempotency-Key", idempotencyKey);
  if (options.eventRevision !== undefined) headers.set("If-Match", '"event-' + options.eventRevision + '"');

  let response: Response;
  try {
    response = await fetch(BASE + path, {
      method,
      headers,
      body: options.rawBody ?? (options.body === undefined ? undefined : JSON.stringify(options.body)),
      credentials: "include",
      signal: options.signal,
    });
  } catch {
    throw new ApiError("We could not reach Eccillo. Check that the API is running, then try again.", 0);
  }

  if (response.status === 401 && auth && path !== "/auth/refresh" && await refreshSession()) {
    return apiFetch<T>(path, { ...options, idempotencyKey });
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => undefined) as { detail?: string } | undefined;
    if (response.status === 401) tokenStore.clear();
    throw new ApiError(errorMessage(payload, response.statusText, response.status), response.status, payload);
  }
  if (response.status === 204) return undefined as T;
  if (options.responseType === "blob") return response.blob() as Promise<T>;
  if (options.responseType === "text") return response.text() as Promise<T>;
  return response.json() as Promise<T>;
}

export function query(params: Record<string, string | number | boolean | undefined | null>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  });
  const text = search.toString();
  return text ? "?" + text : "";
}

export const api = {
  get: <T>(path: string, options?: ApiRequestOptions) => apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiFetch<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: ApiRequestOptions) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
};
