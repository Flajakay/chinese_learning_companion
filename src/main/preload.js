const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAppDataPath: () => ipcRenderer.invoke('get-app-data-path'),
  saveData: (key, data) => ipcRenderer.invoke('save-data', key, data),
  loadData: (key) => ipcRenderer.invoke('load-data', key),
  fetchStories: (maxStories, level, category) => ipcRenderer.invoke('fetch-stories', maxStories, level, category),
  getStory: (storyId) => ipcRenderer.invoke('get-story', storyId),
  getStoryCategories: () => ipcRenderer.invoke('get-story-categories'),
  getStoryLevels: () => ipcRenderer.invoke('get-story-levels'),
  translateText: (text) => ipcRenderer.invoke('translate-text', text),
  translateWord: (word) => ipcRenderer.invoke('translate-word', word),
  segmentChineseText: (text) => ipcRenderer.invoke('segment-chinese-text', text),
  getPinyin: (text) => ipcRenderer.invoke('get-pinyin', text),
  markArticleAsRead: (profileId, articleId) => ipcRenderer.invoke('stats:mark-article-read', profileId, articleId),
  updateProfileStats: (profileId) => ipcRenderer.invoke('stats:update-profile-stats', profileId),
  isArticleRead: (profileId, articleId) => ipcRenderer.invoke('stats:is-article-read', profileId, articleId),
  
  getCompleteStats: (savedWords, profile) => ipcRenderer.invoke('stats:get-complete-stats', savedWords, profile),
  getProgressStats: (savedWords, profile) => ipcRenderer.invoke('stats:get-progress-stats', savedWords, profile),
  getWordStats: (savedWords) => ipcRenderer.invoke('stats:get-word-stats', savedWords),
  
  checkLevelUp: (profileId, savedWords) => ipcRenderer.invoke('skill:check-level-up', profileId, savedWords),
  getSkillProgress: (profileId, savedWords) => ipcRenderer.invoke('skill:get-progress', profileId, savedWords),
  onSwitchProfile: (callback) => ipcRenderer.on('switch-profile', callback),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});
