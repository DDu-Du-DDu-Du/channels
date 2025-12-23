import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getItem(key: string): Promise<string | null> {
  return AsyncStorage.getItem(key);
}

export async function setItem(key: string, value: any): Promise<void> {
  return AsyncStorage.setItem(key, String(value));
}

export async function removeItem(key: string) {
  return AsyncStorage.removeItem(key);
}
