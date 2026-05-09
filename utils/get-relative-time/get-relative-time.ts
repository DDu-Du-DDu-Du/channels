import i18n from "@/i18n";

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
    throw new Error(i18n.t("errors.pastDateOnly"));
  }

  if (Number.isNaN(past.getTime())) {
    throw new Error(i18n.t("errors.invalidDate"));
  }

  if (diffMs < MINUTE) {
    return i18n.t("dateTime.relative.secondsAgo", { count: Math.floor(diffMs / SECOND) });
  }

  if (diffMs < HOUR) {
    return i18n.t("dateTime.relative.minutesAgo", { count: Math.floor(diffMs / MINUTE) });
  }

  if (diffMs < DAY) {
    return i18n.t("dateTime.relative.hoursAgo", { count: Math.floor(diffMs / HOUR) });
  }

  if (diffMs < THIRTY_DAYS) {
    return i18n.t("dateTime.relative.daysAgo", { count: Math.floor(diffMs / DAY) });
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
    return i18n.t("dateTime.relative.monthsAgo", { count: months });
  }

  let years = y2 - y1;

  if (m2 < m1 || (m2 === m1 && d2 < d1)) {
    years -= 1;
  }

  return i18n.t("dateTime.relative.yearsAgo", { count: years });
}

export default getRelativeTime;
