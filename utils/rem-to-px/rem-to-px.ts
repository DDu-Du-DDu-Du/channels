import { Platform } from "react-native";

function remToPx(value: number | string): number {
  const change = Platform.OS === "web" ? 14 : 10;

  if (typeof value === "number") {
    return value * change;
  }

  const s = value.trim().toLowerCase();

  if (s.endsWith("px")) {
    return parseFloat(s.slice(0, -2));
  }

  if (s.endsWith("rem")) {
    return parseFloat(s.slice(0, -3)) * change;
  }

  return parseFloat(s) * 10;
}

export default remToPx;
