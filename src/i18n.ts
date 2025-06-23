import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // For now, we'll use a simple default locale
  // This will be enhanced with browser detection and user preferences
  const locale = "en";

  return {
    locale,
    timeZone: "Pacific/Honolulu", // Hawaii timezone for AlohaWaii
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
