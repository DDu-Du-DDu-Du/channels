const TZ_SUFFIX_RE = /(Z|[+-]\d{2}:\d{2})$/i;
const HAS_YMD_RE = /^\d{4}-\d{2}-\d{2}/;
const HAS_TIME_RE = /[T\s]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?/;

function parseUtc(input: string): Date {
  if (!HAS_YMD_RE.test(input)) {
    throw new Error("유효하지 않은 날짜 형식입니다.");
  }

  let normalized = input;

  if (!TZ_SUFFIX_RE.test(input)) {
    if (HAS_TIME_RE.test(input)) {
      normalized = `${input}Z`;
    } else {
      normalized = `${input}T00:00:00Z`;
    }
  }

  const ms = Date.parse(normalized);

  if (Number.isNaN(ms)) {
    throw new Error("유효하지 않은 날짜 형식입니다.");
  }

  return new Date(ms);
}

export default parseUtc;
