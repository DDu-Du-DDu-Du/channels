export async function getItem(key: string): Promise<string | null> {
  return Promise.resolve(sessionStorage.getItem(key));
}

export async function setItem(key: string, value: any): Promise<void> {
  sessionStorage.setItem(key, String(value));

  return Promise.resolve();
}

export async function removeItem(key: string) {
  sessionStorage.removeItem(key);

  return Promise.resolve();
}
