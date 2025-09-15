const dataService = require('./DataService');
const { STORAGE_KEYS } = require('../../shared/constants');
const { 
  checkLevelUpEligibility, 
  SKILL_LEVELS 
} = require('../../shared/utils/skillProgression');
const statsService = require('./StatsService');

class SkillProgressionService {
  async checkAndUpdateSkillLevel(profileId, savedWords) {
    try {
      const profilesResult = await dataService.loadData(STORAGE_KEYS.PROFILES);
      if (!profilesResult.success) return { success: false, error: 'Failed to load profiles' };

      const profiles = profilesResult.data || [];
      const profileIndex = profiles.findIndex(p => p.id === profileId);
      
      if (profileIndex === -1) return { success: false, error: 'Profile not found' };

      const profile = profiles[profileIndex];
      const currentLevel = profile.currentLevel || SKILL_LEVELS.BEGINNER;
      
      const userStats = statsService.calculateUserStatsForSkillProgression(savedWords, profile);
      const levelCheck = checkLevelUpEligibility(currentLevel, userStats);
      
      if (levelCheck && levelCheck.eligible) {
        profile.currentLevel = levelCheck.nextLevel;
        profiles[profileIndex] = profile;
        
        const saveResult = await dataService.saveData(STORAGE_KEYS.PROFILES, profiles);
        
        if (saveResult.success) {
          return {
            success: true,
            leveledUp: true,
            newLevel: levelCheck.nextLevel,
            previousLevel: currentLevel
          };
        } else {
          return { success: false, error: 'Failed to save profile update' };
        }
      }
      
      return {
        success: true,
        leveledUp: false,
        currentLevel,
        progressInfo: levelCheck
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getProgressToNextLevel(profileId, savedWords) {
    try {
      const profilesResult = await dataService.loadData(STORAGE_KEYS.PROFILES);
      if (!profilesResult.success) return { success: false, error: 'Failed to load profiles' };

      const profiles = profilesResult.data || [];
      const profile = profiles.find(p => p.id === profileId);
      
      if (!profile) return { success: false, error: 'Profile not found' };

      const currentLevel = profile.currentLevel || SKILL_LEVELS.BEGINNER;
      const userStats = statsService.calculateUserStatsForSkillProgression(savedWords, profile);
      const progressInfo = checkLevelUpEligibility(currentLevel, userStats);

      return {
        success: true,
        currentLevel,
        userStats,
        progressInfo
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new SkillProgressionService();
