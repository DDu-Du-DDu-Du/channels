import parseUtc from "../parse-utc/parse-utc";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const THIRTY_DAYS = 30 * DAY;

function getRelativeTime(utcDateString: string): string {
  const now = new Date();
  const past = parseUtc(utcDateString);
  const diffMs = now.getTime() - past.getTime();

  if (diffMs < 0) {
    throw new Error("과거 날짜만 입력해주세요.");
  }

  if (Number.isNaN(past.getTime())) {
    throw new Error("유효하지 않은 날짜 형식이에요.");
  }

  if (diffMs < MINUTE) {
    return `${Math.floor(diffMs / SECOND)}초 전`;
  }

  if (diffMs < HOUR) {
    return `${Math.floor(diffMs / MINUTE)}분 전`;
  }

  if (diffMs < DAY) {
    return `${Math.floor(diffMs / HOUR)}시간 전`;
  }

  if (diffMs < THIRTY_DAYS) {
    return `${Math.floor(diffMs / DAY)}일 전`;
  }

  const y1 = past.getUTCFullYear();
  const m1 = past.getUTCMonth();
  const d1 = past.getUTCDate();
  const y2 = now.getUTCFullYear();
  const m2 = now.getUTCMonth();
  const d2 = now.getUTCDate();

  let months = (y2 - y1) * 12 + (m2 - m1);

  if (d2 < d1) {
    months -= 1;
  }

  if (months < 12) {
    return `${months}개월 전`;
  }

  let years = y2 - y1;

  if (m2 < m1 || (m2 === m1 && d2 < d1)) {
    years -= 1;
  }

  return `${years}년 전`;
}

export default getRelativeTime;
