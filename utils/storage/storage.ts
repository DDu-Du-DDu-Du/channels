import * as SecureStore from "expo-secure-store";

export async function getItem(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

export async function setItem(key: string, value: any): Promise<void> {
  return SecureStore.setItemAsync(key, String(value));
}

export async function removeItem(key: string) {
  return SecureStore.deleteItemAsync(key);
}
