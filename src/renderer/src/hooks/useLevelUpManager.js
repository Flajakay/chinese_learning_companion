import { useState, useCallback } from 'react';
import electronAPI from '../services/electronAPI';

export const useLevelUpManager = () => {
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState(null);

  const checkForLevelUp = useCallback(async (profileId, savedWords) => {
    try {
      if (!profileId || !savedWords) return;
      
      const levelUpResult = await electronAPI.checkLevelUp(profileId, savedWords);
      if (levelUpResult.success && levelUpResult.leveledUp) {
        setLevelUpInfo({
          previousLevel: levelUpResult.previousLevel,
          newLevel: levelUpResult.newLevel
        });
        setShowLevelUpModal(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking level up:', error);
      return false;
    }
  }, []);

  const closeLevelUpModal = useCallback(() => {
    setShowLevelUpModal(false);
    setLevelUpInfo(null);
  }, []);

  return {
    showLevelUpModal,
    levelUpInfo,
    checkForLevelUp,
    closeLevelUpModal
  };
};
