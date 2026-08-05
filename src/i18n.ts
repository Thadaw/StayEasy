import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import ne from "./locales/ne/translation.json";
import hi from "./locales/hi/translation.json";
import es from "./locales/es/translation.json";
import fr from "./locales/fr/translation.json";
import de from "./locales/de/translation.json";
import it from "./locales/it/translation.json";
import pt from "./locales/pt/translation.json";
import nl from "./locales/nl/translation.json";
import ja from "./locales/ja/translation.json";
import ko from "./locales/ko/translation.json";
import zh from "./locales/zh/translation.json";
import ar from "./locales/ar/translation.json";
import ru from "./locales/ru/translation.json";
import th from "./locales/th/translation.json";
import vi from "./locales/vi/translation.json";
import tr from "./locales/tr/translation.json";
import pl from "./locales/pl/translation.json";
import sv from "./locales/sv/translation.json";
import da from "./locales/da/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ne: { translation: ne },
    hi: { translation: hi },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
    it: { translation: it },
    pt: { translation: pt },
    nl: { translation: nl },
    ja: { translation: ja },
    ko: { translation: ko },
    zh: { translation: zh },
    ar: { translation: ar },
    ru: { translation: ru },
    th: { translation: th },
    vi: { translation: vi },
    tr: { translation: tr },
    pl: { translation: pl },
    sv: { translation: sv },
    da: { translation: da },
  },
  lng: localStorage.getItem("lng") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lng", lng);
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lng;
});

export default i18n;
