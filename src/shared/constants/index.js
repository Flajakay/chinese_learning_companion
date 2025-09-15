export const STORAGE_KEYS = {
  PROFILES: 'profiles',
  CURRENT_PROFILE: 'current-profile',
  APP_STATE: 'app-state',
  SAVED_WORDS: 'saved-words',
  INTERFACE_LANGUAGE: 'interface-language'
};

export const LANGUAGES = [
  { code: 'zh', name: 'Chinese', country: 'cn', flag: '🇨🇳' }
];

export const CACHE_TIMEOUTS = {
  TRANSLATION: 60 * 60 * 1000,
  RSS: 30 * 60 * 1000,
  ARTICLE: 60 * 60 * 1000
};

export const API_TIMEOUTS = {
  TRANSLATION: 10000
  };
