import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Settings, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { calculateNextReview } from '../../../shared/utils/spacedRepetition';
import RecognitionMode from './RecognitionMode';
import ProductionMode from './ProductionMode';
import AudioMode from './AudioMode';
import audioService from '../services/audioService';

const FlashcardReview = ({ words, onComplete, onCancel, mode = 'recognition', profile }) => {
  const { t } = useLanguage();
  const { updateWord } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedWords, setReviewedWords] = useState([]);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);
  const [isAnswering, setIsAnswering] = useState(false);

  const currentWord = words[currentIndex];

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'ArrowRight' || e.code === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  useEffect(() => {
    setIsAnswering(false);
  }, [currentIndex]);

  const handleAnswer = (grade) => {
    if (isAnswering) return;
    setIsAnswering(true);
    
    const updatedWord = {
      ...currentWord,
      ...calculateNextReview(currentWord, grade)
    };

    const newReviewedWords = [...reviewedWords.filter(w => w.id !== currentWord.id), updatedWord];
	console.log('Updated word:', { id: updatedWord.id, word: updatedWord.word, repetitions: updatedWord.repetitions });
	console.log('All reviewed words so far:', newReviewedWords.map(w => ({ id: w.id, word: w.word, repetitions: w.repetitions })));
    setReviewedWords(newReviewedWords);

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsAnswering(false);
    } else {
      onComplete(newReviewedWords);
    }
  };

  const handlePlayAudio = (text) => {
    audioService.playAudio(text);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    handleAnswer('GOOD');
  };

  const renderModeComponent = () => {
    if (!currentWord) {
      return <div className="flex items-center justify-center">Loading...</div>;
    }

    const props = {
      word: currentWord,
      onAnswer: handleAnswer,
      onPlayAudio: handlePlayAudio
    };

    switch (currentMode) {
      case 'production':
        return <ProductionMode {...props} />;
      case 'audio':
        return <AudioMode {...props} />;
      default:
        return <RecognitionMode {...props} />;
    }
  };

  const progress = ((currentIndex + 1) / words.length) * 100;

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('flashcardReview.title')}</h1>
            <p className="text-sm text-gray-600">
              {currentIndex + 1} {t('flashcardReview.of')} {words.length} • {t(`flashcardReview.modes.${currentMode}`)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowModeSelector(!showModeSelector)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <Settings size={16} />
            </button>
            <button 
              onClick={onCancel}
              className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <X size={16} />
              <span>{t('flashcardReview.exit')}</span>
            </button>
          </div>
        </div>
        
        {showModeSelector && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2">{t('flashcards.reviewModal.mode')}:</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentMode('recognition')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  currentMode === 'recognition' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t('flashcardReview.modes.recognition')}
              </button>
              <button
                onClick={() => setCurrentMode('production')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  currentMode === 'production' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t('flashcardReview.modes.production')}
              </button>
              <button
                onClick={() => setCurrentMode('audio')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  currentMode === 'audio' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t('flashcardReview.modes.audio')}
              </button>
            </div>
          </div>
        )}
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative">
        {renderModeComponent()}

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-4">
          <button 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} />
            <span>{t('flashcardReview.previous')}</span>
          </button>
          
          <div className="text-center px-4">
            <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded border">
              {currentIndex + 1} / {words.length}
            </div>
          </div>
          
          <button 
            onClick={() => handleAnswer('GOOD')}
            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <span>{t('common.skip')}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardReview;
