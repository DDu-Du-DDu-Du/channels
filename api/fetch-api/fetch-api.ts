import { useAuthStore } from "@/stores";

import { waitForRefresh } from "./refresh-promise";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const fetchWithBearer = (url: string, options: RequestInit = {}, headers: Headers) => {
  const accessToken = useAuthStore.getState().accessToken;

  headers.set("Authorization", `Bearer ${accessToken}`);

  return fetch(url, {
    ...options,
    headers,
  });
};

export const fetchApi = async (
  url: string,
  options: RequestInit = {},
  requiredAuth: boolean = false,
) => {
  const requestUrl = `${API_BASE_URL}${url}`;
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (requiredAuth) {
    const response = await fetchWithBearer(requestUrl, options, headers);

    if (response.status !== 401) {
      return response;
    }

    await waitForRefresh();

    return fetchWithBearer(requestUrl, options, headers);
  }

  return fetch(requestUrl, {
    ...options,
    headers,
  });
};

export const fetchRefresh = (url: string, options: RequestInit = {}) => {
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
  });
};

export default fetchApi;
