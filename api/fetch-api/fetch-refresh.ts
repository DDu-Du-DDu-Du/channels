const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const fetchRefresh = (url: string, options: RequestInit = {}) => {
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
  });
};

export default fetchRefresh;
