class ElectronAPI {
  async getAppDataPath() {
    return await window.electronAPI.getAppDataPath();
  }

  async saveData(key, data) {
    return await window.electronAPI.saveData(key, data);
  }

  async loadData(key) {
    return await window.electronAPI.loadData(key);
  }

  async fetchStories(maxStories = 20, level = 'HSK1', category = null) {
    return await window.electronAPI.fetchStories(maxStories, level, category);
  }

  async getStory(storyId) {
    return await window.electronAPI.getStory(storyId);
  }

  async getStoryCategories() {
    return await window.electronAPI.getStoryCategories();
  }

  async getStoryLevels() {
    return await window.electronAPI.getStoryLevels();
  }

  async translateText(text) {
    return await window.electronAPI.translateText(text);
  }

  async translateWord(word) {
    return await window.electronAPI.translateWord(word);
  }

  async segmentChineseText(text) {
    return await window.electronAPI.segmentChineseText(text);
  }

  async getPinyin(text) {
    return await window.electronAPI.getPinyin(text);
  }

  async markArticleAsRead(profileId, articleId) {
    return await window.electronAPI.markArticleAsRead(profileId, articleId);
  }

  async updateProfileStats(profileId) {
    return await window.electronAPI.updateProfileStats(profileId);
  }

  async isArticleRead(profileId, articleId) {
    return await window.electronAPI.isArticleRead(profileId, articleId);
  }

  async checkLevelUp(profileId, savedWords) {
    return await window.electronAPI.checkLevelUp(profileId, savedWords);
  }

  async getSkillProgress(profileId, savedWords) {
    return await window.electronAPI.getSkillProgress(profileId, savedWords);
  }

  async getCompleteStats(savedWords, profile) {
    return await window.electronAPI.getCompleteStats(savedWords, profile);
  }

  async getProgressStats(savedWords, profile) {
    return await window.electronAPI.getProgressStats(savedWords, profile);
  }

  async getWordStats(savedWords) {
    return await window.electronAPI.getWordStats(savedWords);
  }

  onSwitchProfile(callback) {
    return window.electronAPI.onSwitchProfile(callback);
  }

  removeAllListeners(channel) {
    return window.electronAPI.removeAllListeners(channel);
  }
}

export default new ElectronAPI();
