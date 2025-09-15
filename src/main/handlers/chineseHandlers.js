const chineseProcessor = require('../services/ChineseProcessor');

const chineseHandlers = {
  'segment-chinese-text': (event, text) => {
    try {
      const result = chineseProcessor.extractWords(text);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  'get-pinyin': (event, text) => {
    try {
      const result = chineseProcessor.getPinyin(text);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

module.exports = chineseHandlers;
