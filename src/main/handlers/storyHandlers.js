const storyService = require('../services/StoryService');

const storyHandlers = {
  'fetch-stories': async (event, maxStories = 20, level = 'HSK1', category = null) => {
    try {
      const result = await storyService.fetchStories(maxStories, level, category);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  'get-story': async (event, storyId) => {
    try {
      const result = await storyService.getStory(storyId);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  'get-story-categories': () => {
    try {
      return storyService.getAvailableCategories();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  'get-story-levels': () => {
    try {
      return storyService.getAvailableLevels();
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

module.exports = storyHandlers;