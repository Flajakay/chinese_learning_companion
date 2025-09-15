import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, CheckCircle, MoreVertical, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import FlashcardReview from '../components/FlashcardReview';
import LevelUpModal from '../components/LevelUpModal';
import { useLevelUpManager } from '../hooks/useLevelUpManager';
import { needsReview } from '../../../shared/utils/spacedRepetition';
import { formatNextReviewDate } from '../utils/dateUtils';
import electronAPI from '../services/electronAPI';

const FlashcardsPage = ({ profile }) => {
  const { t } = useLanguage();
  const { savedWords, setSavedWords, deleteWord, updateWord } = useApp();
  const [reviewMode, setReviewMode] = useState(false);
  const [wordsToReview, setWordsToReview] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewType, setSelectedReviewType] = useState('onlyDue');
  const [selectedMode, setSelectedMode] = useState('recognition');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const { showLevelUpModal, levelUpInfo, checkForLevelUp, closeLevelUpModal } = useLevelUpManager();
  const [stats, setStats] = useState({
    totalWords: 0,
    wellKnownWords: 0
  });

  useEffect(() => {
    setWordsToReview(savedWords.filter(word => needsReview(word)));
  }, [savedWords]);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownId(null);
    };

    if (openDropdownId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdownId]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const wordStats = await electronAPI.getWordStats(savedWords);
        console.log(wordStats);
        setStats(wordStats);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
  }, [savedWords]);

  const startReview = () => {
    setShowReviewModal(true);
  };

  const handleStartReview = () => {
    try{
      const wordsForReview = selectedReviewType === 'onlyDue' 
        ? savedWords.filter(word => needsReview(word))
        : savedWords;
      
      if (wordsForReview.length > 0) {
        setWordsToReview(wordsForReview);
        setReviewMode(true);
        setShowReviewModal(false);
      }      
    } catch (error) {
      console.error('Error starting review:', error);
    }

  };

  const getSelectedWordsCount = () => {
    return selectedReviewType === 'onlyDue' 
      ? savedWords.filter(word => needsReview(word)).length
      : savedWords.length;
  };

  const handleReviewComplete = async (reviewedWords) => {
    
    const reviewedWordsMap = new Map(reviewedWords.map(word => [word.id, word]));
    
    const updatedWords = savedWords.map(word => 
      reviewedWordsMap.has(word.id) ? reviewedWordsMap.get(word.id) : word
    );
    
    
    setSavedWords(updatedWords);
    
    if (profile && reviewedWords.length > 0) {
      await electronAPI.updateProfileStats(profile.id);
      await checkForLevelUp(profile.id, updatedWords);
    }
    setReviewMode(false);
  };

  const handleDeleteWord = (wordId) => {
    deleteWord(wordId);
    setOpenDropdownId(null);
  };

  const toggleDropdown = (wordId) => {
    setOpenDropdownId(openDropdownId === wordId ? null : wordId);
  };

  if (reviewMode) {
    return (
      <FlashcardReview 
        words={wordsToReview}
        onComplete={handleReviewComplete}
        onCancel={() => setReviewMode(false)}
        mode={selectedMode}
        profile={profile}
      />
    );
  }

  const wordsNeedingReview = savedWords.filter(word => needsReview(word));

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('flashcards.title')}</h1>
            <p className="text-gray-600">
              {t('flashcards.subtitle')}
            </p>
          </div>
          <button 
            onClick={startReview}
            disabled={savedWords.length === 0}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('flashcards.reviewWords')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {savedWords.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t('flashcards.noFlashcardsYet')}
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              {t('flashcards.startReadingArticles')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('flashcards.totalWords')}</p>
                    <p className="text-2xl font-bold text-indigo-600">{stats.totalWords}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('flashcards.needReview')}</p>
                    <p className="text-2xl font-bold text-yellow-600">{wordsNeedingReview.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('flashcards.wellKnown')}</p>
                    <p className="text-2xl font-bold text-green-600">{stats.wellKnownWords}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedWords.map((word) => (
                <div key={word.id} className="bg-white rounded-lg shadow border border-gray-200">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{word.word}</h3>
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(word.id);
                          }}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openDropdownId === word.id && (
                          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteWord(word.id);
                              }}
                              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>{t('flashcards.delete')}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{word.translation}</p>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <p><strong>{t('flashcards.context')}:</strong> {word.context}</p>
                      <p><strong>{t('flashcards.added')}:</strong> {new Date(word.addedAt || word.dateAdded).toLocaleDateString()}</p>
                      <p><strong>{t('flashcards.reviews')}:</strong> {word.repetitions || 0}</p>
                      {word.easeFactor && (
                        <p><strong>Ease:</strong> {word.easeFactor}</p>
                      )}
                      {word.nextReviewDate && (
                        <p><strong>Next:</strong> {formatNextReviewDate(word.nextReviewDate)}</p>
                      )}
                    </div>

                    <div className="flex justify-end mt-3">
                      {needsReview(word) ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" />
                          {t('flashcards.needsReview')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {t('flashcards.reviewed')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-6">{t('flashcards.reviewModal.title')}</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">{t('flashcards.reviewModal.reviewType')}</h4>
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="reviewType" 
                      className="mt-1" 
                      checked={selectedReviewType === 'onlyDue'}
                      onChange={() => setSelectedReviewType('onlyDue')}
                    />
                    <div>
                      <div className="font-medium">{t('flashcards.reviewModal.onlyDue')}</div>
                      <div className="text-sm text-gray-600">{t('flashcards.reviewModal.onlyDueDesc')}</div>
                      <div className="text-xs text-indigo-600 mt-1">
                        {savedWords.filter(word => needsReview(word)).length} {t('flashcards.words')}
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="reviewType" 
                      className="mt-1" 
                      checked={selectedReviewType === 'allWords'}
                      onChange={() => setSelectedReviewType('allWords')}
                    />
                    <div>
                      <div className="font-medium">{t('flashcards.reviewModal.allWords')}</div>
                      <div className="text-sm text-gray-600">{t('flashcards.reviewModal.allWordsDesc')}</div>
                      <div className="text-xs text-indigo-600 mt-1">
                        {savedWords.length} {t('flashcards.words')}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">{t('flashcards.reviewModal.mode')}</h4>
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="mode" 
                      className="mt-1" 
                      checked={selectedMode === 'recognition'}
                      onChange={() => setSelectedMode('recognition')}
                    />
                    <div>
                      <div className="font-medium">{t('flashcards.reviewModal.recognitionMode')}</div>
                      <div className="text-sm text-gray-600">{t('flashcards.reviewModal.recognitionDesc')}</div>
                    </div>
                  </label>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="mode" 
                      className="mt-1" 
                      checked={selectedMode === 'production'}
                      onChange={() => setSelectedMode('production')}
                    />
                    <div>
                      <div className="font-medium">{t('flashcards.reviewModal.productionMode')}</div>
                      <div className="text-sm text-gray-600">{t('flashcards.reviewModal.productionDesc')}</div>
                    </div>
                  </label>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="mode" 
                      className="mt-1" 
                      checked={selectedMode === 'audio'}
                      onChange={() => setSelectedMode('audio')}
                    />
                    <div>
                      <div className="font-medium">{t('flashcards.reviewModal.audioMode')}</div>
                      <div className="text-sm text-gray-600">{t('flashcards.reviewModal.audioDesc')}</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                {t('common.cancel')}
              </button>
              <button 
                onClick={handleStartReview}
                disabled={getSelectedWordsCount() === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {t('flashcards.reviewModal.startReview')} ({getSelectedWordsCount()} {t('flashcards.reviewModal.wordsSelected')})
              </button>
            </div>
          </div>
        </div>
      )}

      <LevelUpModal
        isOpen={showLevelUpModal}
        onClose={closeLevelUpModal}
        previousLevel={levelUpInfo?.previousLevel}
        newLevel={levelUpInfo?.newLevel}
      />
    </div>
  );
};

export default FlashcardsPage;
