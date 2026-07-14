import { createI18n } from "vue-i18n";
import { STORAGE_KEYS } from "@/constants";
import { Storage } from "@/utils/storage";
// 本地语言包
import enLocale from "./package/en";
import viLocale from "./package/vi";
import zhCnLocale from "./package/zh-cn";

const messages = {
  "zh-cn": {
    ...zhCnLocale,
  },
  en: {
    ...enLocale,
  },
  vi: {
    ...viLocale,
  },
};

const savedLocale = Storage.get(STORAGE_KEYS.LANGUAGE, "zh-cn");
const initialLocale = Object.hasOwn(messages, savedLocale) ? savedLocale : "zh-cn";

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  messages,
  globalInjection: true,
});

// 全局注册 i18n
export function setupI18n(app) {
  app.use(i18n);
}

export default i18n;
