export const SKILL_LEVELS = {
  BEGINNER: 'Beginner',
  ELEMENTARY: 'Elementary', 
  INTERMEDIATE: 'Intermediate',
  UPPER_INTERMEDIATE: 'Upper-Intermediate',
  ADVANCED: 'Advanced'
};

export const SKILL_LEVEL_ORDER = [
  SKILL_LEVELS.BEGINNER,
  SKILL_LEVELS.ELEMENTARY,
  SKILL_LEVELS.INTERMEDIATE,
  SKILL_LEVELS.UPPER_INTERMEDIATE,
  SKILL_LEVELS.ADVANCED
];

export const PROGRESSION_CRITERIA = {
  [SKILL_LEVELS.ELEMENTARY]: {
    minVocabulary: 5,
    minWellKnownWords: 1,
    minArticlesRead: 5,
    minAverageReviews: 1.0,
    minStreak: 1
  },
  [SKILL_LEVELS.INTERMEDIATE]: {
    minVocabulary: 150,
    minWellKnownWords: 75,
    minArticlesRead: 15,
    minAverageReviews: 2.5,
    minStreak: 7
  },
  [SKILL_LEVELS.UPPER_INTERMEDIATE]: {
    minVocabulary: 300,
    minWellKnownWords: 200,
    minArticlesRead: 30,
    minAverageReviews: 3.0,
    minStreak: 14
  },
  [SKILL_LEVELS.ADVANCED]: {
    minVocabulary: 500,
    minWellKnownWords: 350,
    minArticlesRead: 50,
    minAverageReviews: 3.5,
    minStreak: 21
  }
};

export function checkLevelUpEligibility(currentLevel, userStats) {
  const currentIndex = SKILL_LEVEL_ORDER.indexOf(currentLevel);
  if (currentIndex === -1 || currentIndex >= SKILL_LEVEL_ORDER.length - 1) {
    return null;
  }
  
  const nextLevel = SKILL_LEVEL_ORDER[currentIndex + 1];
  const criteria = PROGRESSION_CRITERIA[nextLevel];
  
  if (!criteria) return null;
  
  const meetsVocabulary = userStats.totalVocabulary >= criteria.minVocabulary;
  const meetsWellKnown = userStats.wellKnownWords >= criteria.minWellKnownWords;
  const meetsArticles = userStats.articlesRead >= criteria.minArticlesRead;
  const meetsReviews = userStats.averageReviews >= criteria.minAverageReviews;
  const meetsStreak = userStats.currentStreak >= criteria.minStreak;
  
  const allCriteriaMet = meetsVocabulary && meetsWellKnown && meetsArticles && meetsReviews && meetsStreak;
  
  return {
    eligible: allCriteriaMet,
    nextLevel,
    criteria,
    progress: {
      vocabulary: { current: userStats.totalVocabulary, required: criteria.minVocabulary, met: meetsVocabulary },
      wellKnownWords: { current: userStats.wellKnownWords, required: criteria.minWellKnownWords, met: meetsWellKnown },
      articlesRead: { current: userStats.articlesRead, required: criteria.minArticlesRead, met: meetsArticles },
      averageReviews: { current: userStats.averageReviews.toFixed(1), required: criteria.minAverageReviews, met: meetsReviews },
      currentStreak: { current: userStats.currentStreak, required: criteria.minStreak, met: meetsStreak }
    }
  };
}

export function getProgressToNextLevel(currentLevel, userStats) {
  const levelCheck = checkLevelUpEligibility(currentLevel, userStats);
  if (!levelCheck) return null;
  
  const { progress } = levelCheck;
  const totalCriteria = 5;
  const metCriteria = Object.values(progress).filter(p => p.met).length;
  
  return {
    ...levelCheck,
    overallProgress: (metCriteria / totalCriteria) * 100,
    criteriaCount: { met: metCriteria, total: totalCriteria }
  };
}
