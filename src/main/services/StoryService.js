const { HSK1_STORIES, getStoriesByLevel, getStoryById, getStoriesByCategory } = require('../../shared/stories');

class StoryService {
  constructor() {
  }

  async fetchStories(maxStories = 20, level = 'HSK1', category = null) {
    try {
      let stories;
      
      if (category) {
        stories = getStoriesByCategory(category).filter(story => story.level === level);
      } else {
        stories = getStoriesByLevel(level);
      }
      
      stories = stories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      const limitedStories = stories.slice(0, maxStories);
      
      const meta = {
        totalStories: stories.length,
        returnedStories: limitedStories.length,
        level: level,
        category: category,
        lastUpdated: new Date().toISOString()
      };

      return { 
        success: true, 
        data: limitedStories,
        meta
      };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getStory(storyId) {
    try {
      const story = getStoryById(storyId);
      
      if (!story) {
        return { 
          success: false, 
          error: 'Story not found' 
        };
      }

      const processedStory = {
        ...story,
        extractedAt: new Date().toISOString(),
        isFallback: false,
        url: `story://${story.id}`,
        source: 'Chinese Stories Collection',
        author: 'HSK Learning Material',
        publishedAt: story.createdAt,
        pubDate: story.createdAt
      };

      return {
        success: true,
        data: processedStory
      };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getAvailableCategories() {
    try {
      const categories = [...new Set(HSK1_STORIES.map(story => story.category))];
      return { success: true, data: categories };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getAvailableLevels() {
    try {
      const levels = [...new Set(HSK1_STORIES.map(story => story.level))];
      return { success: true, data: levels };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new StoryService();