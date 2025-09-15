const statsService = require('../services/StatsService');

module.exports = {
  'stats:mark-article-read': async (event, profileId, articleId) => {
    return await statsService.markArticleAsRead(profileId, articleId);
  },

  'stats:update-profile-stats': async (event, profileId) => {
    return await statsService.updateProfileStats(profileId);
  },

  'stats:is-article-read': async (event, profileId, articleId) => {
    return await statsService.isArticleRead(profileId, articleId);
  },

  'stats:get-complete-stats': async (event, savedWords, profile) => {
    return statsService.getCompleteStats(savedWords, profile);
  },

  'stats:get-progress-stats': async (event, savedWords, profile) => {
    return statsService.calculateProgressStats(savedWords, profile);
  },

  'stats:get-word-stats': async (event, savedWords) => {
    return statsService.calculateWordStats(savedWords);
  }
};
