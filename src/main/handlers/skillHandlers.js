const skillProgressionService = require('../services/SkillProgressionService');

module.exports = {
  'skill:check-level-up': async (event, profileId, savedWords) => {
    return await skillProgressionService.checkAndUpdateSkillLevel(profileId, savedWords);
  },

  'skill:get-progress': async (event, profileId, savedWords) => {
    return await skillProgressionService.getProgressToNextLevel(profileId, savedWords);
  }
};
