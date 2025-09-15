const translationService = require('../services/TranslationService');

const translationHandlers = {
  'translate-text': async (event, text) => {
    try {
      const result = await translationService.translateText(text);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  'translate-word': async (event, word) => {
    try {
      const result = await translationService.translateWord(word);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

module.exports = translationHandlers;
