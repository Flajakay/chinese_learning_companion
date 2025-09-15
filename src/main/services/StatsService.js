const dataService = require('./DataService');
const { STORAGE_KEYS } = require('../../shared/constants');

class StatsService {
  async markArticleAsRead(profileId, articleId) {
    try {
      const profilesResult = await dataService.loadData(STORAGE_KEYS.PROFILES);
      if (!profilesResult.success) return { success: false, error: 'Failed to load profiles' };

      const profiles = profilesResult.data || [];
      const profileIndex = profiles.findIndex(p => p.id === profileId);
      
      if (profileIndex === -1) return { success: false, error: 'Profile not found' };

      const profile = profiles[profileIndex];
      if (!profile.readArticleIds) profile.readArticleIds = [];
      
      if (!profile.readArticleIds.includes(articleId)) {
        profile.readArticleIds.push(articleId);
        profile.stats.articlesRead = profile.readArticleIds.length;
        await this.updateLastActivity(profile);
        
        profiles[profileIndex] = profile;
        const saveResult = await dataService.saveData(STORAGE_KEYS.PROFILES, profiles);
        return saveResult;
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateLastActivity(profile) {
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = profile.stats.lastActivityDate;
    
    if (lastActivity !== today) {
      const previousStreak = profile.stats.currentStreak || 0;
      profile.stats.lastActivityDate = today;
      profile.stats.currentStreak = this.calculateCurrentStreak(today, lastActivity, previousStreak);
    }
    
    return profile;
  }

  calculateCurrentStreak(currentDate, lastActivityDate, previousStreak) {
    if (!lastActivityDate) return 1;
    
    const current = new Date(currentDate);
    const last = new Date(lastActivityDate);
    const diffTime = current - last;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return previousStreak || 1;
    } else if (diffDays === 1) {
      return (previousStreak || 0) + 1;
    } else {
      return 1;
    }
  }

  async updateProfileStats(profileId) {
    try {
      const profilesResult = await dataService.loadData(STORAGE_KEYS.PROFILES);
      if (!profilesResult.success) return { success: false, error: 'Failed to load profiles' };

      const profiles = profilesResult.data || [];
      const profileIndex = profiles.findIndex(p => p.id === profileId);
      
      if (profileIndex === -1) return { success: false, error: 'Profile not found' };

      const profile = profiles[profileIndex];
      await this.updateLastActivity(profile);
      
      profiles[profileIndex] = profile;
      const saveResult = await dataService.saveData(STORAGE_KEYS.PROFILES, profiles);
      return saveResult;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async isArticleRead(profileId, articleId) {
    try {
      const profilesResult = await dataService.loadData(STORAGE_KEYS.PROFILES);
      if (!profilesResult.success) return false;

      const profiles = profilesResult.data || [];
      const profile = profiles.find(p => p.id === profileId);
      
      if (!profile || !profile.readArticleIds) return false;
      return profile.readArticleIds.includes(articleId);
    } catch (error) {
      return false;
    }
  }

  calculateWordStats(savedWords) {
    const totalWords = savedWords.length;
    const wellKnownWords = savedWords.filter(w => (w.repetitions || 0) >= 3).length;
    const recentlyAdded = savedWords.filter(w => {
      const daysSinceAdded = Math.floor(
        (Date.now() - new Date(w.addedAt || w.dateAdded).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceAdded <= 7;
    }).length;
    const avgReviewCount = totalWords > 0 
      ? (savedWords.reduce((sum, w) => sum + (w.repetitions || 0), 0) / totalWords).toFixed(1)
      : 0;

    return {
      totalWords,
      wellKnownWords,
      recentlyAdded,
      avgReviewCount
    };
  }

  calculateProgressStats(savedWords, profile) {
    const wordStats = this.calculateWordStats(savedWords);
    
    return {
      ...wordStats,
      currentStreak: profile?.stats?.currentStreak || 0,
      articlesRead: profile?.stats?.articlesRead || 0,
      lastActivityDate: profile?.stats?.lastActivityDate || null,
      dailyGoal: profile?.dailyGoal || 30
    };
  }

  calculateAchievements(savedWords, profile) {
    const stats = this.calculateProgressStats(savedWords, profile);
    const achievements = [];

    if (stats.totalWords >= 10) {
      achievements.push('first10Words');
    }
    if (stats.totalWords >= 50) {
      achievements.push('vocabularyBuilder');
    }
    if (stats.wellKnownWords >= 5) {
      achievements.push('quickLearner');
    }
    if (stats.currentStreak >= 7) {
      achievements.push('weekWarrior');
    }

    return achievements;
  }

  getCompleteStats(savedWords, profile) {
    const progressStats = this.calculateProgressStats(savedWords, profile);
    const achievements = this.calculateAchievements(savedWords, profile);
    
    return {
      ...progressStats,
      achievements
    };
  }

  calculateUserStatsForSkillProgression(savedWords, profile) {
    const wordStats = this.calculateWordStats(savedWords);
    
    return {
      totalVocabulary: wordStats.totalWords,
      wellKnownWords: wordStats.wellKnownWords,
      articlesRead: profile?.stats?.articlesRead || 0,
      averageReviews: parseFloat(wordStats.avgReviewCount),
      currentStreak: profile?.stats?.currentStreak || 0
    };
  }
}

module.exports = new StatsService();