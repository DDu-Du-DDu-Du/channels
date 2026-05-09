import * as Localization from "expo-localization";

const FALLBACK_TIME_ZONE = "UTC";

const getIntlTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
};

const getClientTimeZone = () => {
  const calendarTimeZone = Localization.getCalendars()[0]?.timeZone;

  return calendarTimeZone || getIntlTimeZone() || FALLBACK_TIME_ZONE;
};

export default getClientTimeZone;
