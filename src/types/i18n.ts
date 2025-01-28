export interface TranslationType {
  title: string;
  theme: {
    current: string;
    light: string;
    dark: string;
    system: string;
  };
  language: {
    title: string;
    ja: string;
    en: string;
  };
  device: {
    title: string;
    placeholder: string;
  };
  monitor: {
    title: string;
  };
  threshold: {
    title: string;
    description: string;
  };
  status: {
    audioLevel: string;
    active: string;
    inactive: string;
  };
  error: {
    title: string;
    message: string;
    reload: string;
  };
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: TranslationType;
    };
  }
} 