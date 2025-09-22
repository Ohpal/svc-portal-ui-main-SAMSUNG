import { commonLocale, menuLocale, formLocale, pagesLocale, alertLocale, rulesLocale } from '@/locale';
import { createI18n } from 'vue-i18n';

// 로컬 스토리지에서 저장된 언어 설정 가져오기
const getInitialLocale = (): string => {
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'ko' || savedLanguage === 'en')) {
      return savedLanguage;
    }
  }
  return 'ko'; // 기본값
};

const i18nInstance = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  messages: {
    en: {
      welcome: 'Welcome',
      ...commonLocale.en,
      ...menuLocale.en,
      ...formLocale.en,
      ...pagesLocale.en,
      ...alertLocale.en,
      ...rulesLocale.en
    },
    ko: {
      welcome: '웰컴',
      ...commonLocale.ko,
      ...menuLocale.ko,
      ...formLocale.ko,
      ...pagesLocale.ko,
      ...alertLocale.ko,
      ...rulesLocale.ko
    }
  }
});

export default i18nInstance;
