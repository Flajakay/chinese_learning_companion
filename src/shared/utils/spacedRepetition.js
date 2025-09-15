export const SM2_INTERVALS = {
  AGAIN: 1,
  HARD: 10,
  GOOD: 1440,
  EASY: 4320
};

export const GRADE_VALUES = {
  AGAIN: 0,
  HARD: 1,
  GOOD: 3,
  EASY: 5
};

export function calculateNextReview(word, grade) {
  const gradeValue = GRADE_VALUES[grade];
  let easeFactor = word.easeFactor || 2.5;
  let interval = word.interval || 1;
  let repetitions = word.repetitions || 0;

  if (gradeValue >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - gradeValue) * (0.08 + (5 - gradeValue) * 0.02));
  
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const nextReviewDate = new Date();
  
  if (grade === 'AGAIN') {
    nextReviewDate.setMinutes(nextReviewDate.getMinutes() + SM2_INTERVALS.AGAIN);
  } else if (grade === 'HARD') {
    nextReviewDate.setMinutes(nextReviewDate.getMinutes() + SM2_INTERVALS.HARD);
  } else if (grade === 'GOOD') {
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  } else if (grade === 'EASY') {
    nextReviewDate.setDate(nextReviewDate.getDate() + Math.max(interval * 1.3, 4));
  }

  return {
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    repetitions,
    nextReviewDate: nextReviewDate.toISOString(),
    lastReviewed: new Date().toISOString()
  };
}

export function needsReview(word) {
  if (!word.nextReviewDate) return true;
  return new Date() >= new Date(word.nextReviewDate);
}
