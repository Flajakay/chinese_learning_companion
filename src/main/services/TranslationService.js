const axios = require('axios');
const dataService = require('./DataService');
const cacheService = require('./CacheService');
const { CACHE_TIMEOUTS, API_TIMEOUTS, STORAGE_KEYS } = require('../../shared/constants');

class TranslationService {
  constructor() {
    this.apiUrl = 'https://translate.googleapis.com/translate_a/single';
    this.cacheName = 'translation';
    cacheService.createCache(this.cacheName, CACHE_TIMEOUTS.TRANSLATION);
  }

  async getCurrentLanguage() {
    try {
      const result = dataService.loadData(STORAGE_KEYS.INTERFACE_LANGUAGE);
      if (result.success) {
        return result.data;
      }
      return 'en';
    } catch (error) {
      return 'en';
    }
  }

  async translateText(text, targetLang = null) {
    try {
      const lang = targetLang || await this.getCurrentLanguage();
      const cacheKey = `${text}-zh-${lang}`;
      const cached = cacheService.get(this.cacheName, cacheKey);
      
      if (cached) {
        return { success: true, translation: cached };
      }

      const params = {
        client: 'gtx',
        sl: 'zh',
        tl: lang,
        dt: 't',
        q: text
      };

      const response = await axios.get(this.apiUrl, {
        params,
        timeout: API_TIMEOUTS.TRANSLATION,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.data && response.data[0]) {
        const translation = response.data[0].map(segment => segment[0]).join('');
        cacheService.set(this.cacheName, cacheKey, translation);
        return { success: true, translation };
      } else {
        return { success: false, error: 'Invalid response format' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async translateWord(word, targetLang = null) {
    try {
      const lang = targetLang || await this.getCurrentLanguage();
      const cacheKey = `word-${word}-zh-${lang}`;
      const cached = cacheService.get(this.cacheName, cacheKey);
      
      if (cached) {
        return { success: true, data: cached };
      }

      const params = {
        client: 'gtx',
        sl: 'zh',
        tl: lang,
        dt: 'bd',
        q: word
      };

      const response = await axios.get(this.apiUrl, {
        params,
        timeout: API_TIMEOUTS.TRANSLATION,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.data && response.data[1]) {
        const translations = response.data[1].map(dictEntry => ({
          pos: dictEntry[0],
          terms: dictEntry[1] || [],
          entries: dictEntry[2] ? dictEntry[2].map(entry => ({
            word: entry[0],
            reverseTranslations: entry[1] || [],
            score: entry[3] || 0
          })) : []
        }));

        const data = {
          word,
          translations,
          hasMultipleOptions: translations.length > 0
        };
        
        cacheService.set(this.cacheName, cacheKey, data);
        return { success: true, data };
      } else {
        const fallbackResult = await this.translateText(word, lang);
        if (fallbackResult.success) {
          const data = {
            word,
            translations: [{
              pos: 'unknown',
              terms: [fallbackResult.translation],
              entries: [{
                word: fallbackResult.translation,
                reverseTranslations: [],
                score: 1.0
              }]
            }],
            hasMultipleOptions: false
          };
          return { success: true, data };
        }
        return { success: false, error: 'No translation found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  clearCache() {
    cacheService.clear(this.cacheName);
  }
}

module.exports = new TranslationService();
