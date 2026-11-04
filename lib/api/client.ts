export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface RequestOptions extends RequestInit {
  retryOn401?: boolean;
}

export class ApiClientError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = "ApiClientError";
    this.status = status;
    this.detail = detail;
  }
}

let isRefreshing = false;
let refreshSubscribers: ((ok: boolean) => void)[] = [];

function onRefreshed(ok: boolean) {
  refreshSubscribers.forEach((callback) => callback(ok));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (ok: boolean) => void) {
  refreshSubscribers.push(callback);
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { retryOn401 = true, ...fetchOptions } = options;
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!(fetchOptions.body instanceof FormData) && fetchOptions.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
    credentials: "include", // Essential for HttpOnly authentication cookies
  };

  try {
    const response = await fetch(url, config);

    // If 401 Unauthorized, attempt token refresh unless this is an auth endpoint
    const isAuthEndpoint =
      endpoint.includes("/auth/login") ||
      endpoint.includes("/auth/signup") ||
      endpoint.includes("/auth/refresh");

    if (response.status === 401 && retryOn401 && !isAuthEndpoint) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
          });

          if (refreshRes.ok) {
            isRefreshing = false;
            onRefreshed(true);
            // Retry original request
            return apiClient<T>(endpoint, { ...options, retryOn401: false });
          } else {
            isRefreshing = false;
            onRefreshed(false);
          }
        } catch {
          isRefreshing = false;
          onRefreshed(false);
        }
      } else {
        // Wait for existing refresh to complete
        const retrySuccess = await new Promise<boolean>((resolve) => {
          addRefreshSubscriber(resolve);
        });
        if (retrySuccess) {
          return apiClient<T>(endpoint, { ...options, retryOn401: false });
        }
      }
    }

    if (!response.ok) {
      let errorDetail = `Request failed with status ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson?.detail) {
          errorDetail = typeof errorJson.detail === "string"
            ? errorJson.detail
            : JSON.stringify(errorJson.detail);
        } else if (errorJson?.message) {
          errorDetail = errorJson.message;
        }
      } catch {
        // Response was not JSON
      }
      throw new ApiClientError(response.status, errorDetail);
    }

    // Parse JSON response
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Network error. Please verify backend is running.";
    throw new ApiClientError(0, message);
  }
}

