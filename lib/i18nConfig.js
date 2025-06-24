import { I18n } from "i18n";

const i18n = new I18n({
  locales: ["en", "es"],
  defaultLocale: "en",
  directory: "./locales",
  autoReload: true,
  syncFiles: true,
  cookie: "nodeapp-locale",
});

export default i18n;
