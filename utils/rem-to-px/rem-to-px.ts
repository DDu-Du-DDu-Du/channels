function remToPx(value: number | string): number {
  if (typeof value === "number") {
    return value;
  }

  const s = value.trim().toLowerCase();

  if (s.endsWith("px")) {
    return parseFloat(s.slice(0, -2));
  }

  if (s.endsWith("rem")) {
    return parseFloat(s.slice(0, -3)) * 10;
  }

  return parseFloat(s) * 10;
}

export default remToPx;
