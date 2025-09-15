const { load, cut } = require('@node-rs/jieba');
const pinyin = require('pinyin').default;

class ChineseProcessor {
  constructor() {
    load();
  }

  segmentText(text) {
    if (!text) return [];
    
    const segments = cut(text, false);
    return segments.filter(segment => segment.trim().length > 0);
  }
  
  cleanChineseText(text) {
    if (!text) return '';
    
    return text
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  extractWords(text) {	  
    if (!text) return [];
    try {
      const segments = this.segmentText(text);
      const words = [];
      segments.forEach(segment => {
          words.push({
            word: segment,
            pinyin: pinyin(segment)
          });
      });
      return words;
    } catch (error) {
      return [];
    }
  }

  getPinyin(text) {
    if (!text) return '';
    try {
      return pinyin(text, {
        style: pinyin.STYLE_TONE,
        heteronym: false
      }).join(' ');
    } catch (error) {
      return '';
    }
  }
}

module.exports = new ChineseProcessor();
