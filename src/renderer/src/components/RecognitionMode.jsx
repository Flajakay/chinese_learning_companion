import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import audioService from '../services/audioService';

const RecognitionMode = ({ word, onAnswer, onPlayAudio }) => {
  const { t } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(!isFlipped);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipped]);

  const handleGrade = (grade) => {
    setSelectedAnswer(grade);
    setTimeout(() => {
      onAnswer(grade);
      setIsFlipped(false);
      setSelectedAnswer(null);
    }, 300);
  };

  return (
    <div className="w-full max-w-md">
      <div 
        className={`flashcard-flip cursor-pointer ${isFlipped ? 'flashcard-flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="flashcard-inner relative w-full h-64">
          <div className="flashcard-front absolute inset-0 bg-indigo-600 text-white rounded-lg shadow-xl">
            <div className="flex items-center justify-center text-center h-full p-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{word.word}</h2>
                {word.pinyin && (
                  <p className="text-lg opacity-80 mb-4">{word.pinyin}</p>
                )}
                <button
                  className="px-3 py-1 border border-white text-white rounded hover:bg-white hover:text-indigo-600 transition-colors mb-4 inline-flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    audioService.playAudio(word.word);
                  }}
                >
                  <Volume2 size={16} />
                </button>
                <p className="text-sm opacity-70">{t('flashcardReview.clickOrPressSpace')}</p>
              </div>
            </div>
          </div>
          
          <div className="flashcard-back absolute inset-0 bg-white border border-gray-200 rounded-lg shadow-xl">
            <div className="flex items-center justify-center text-center h-full p-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-indigo-600">{word.word}</h2>
                {word.pinyin && (
                  <p className="text-lg text-gray-600 mb-4">{word.pinyin}</p>
                )}
                <p className="text-xl mb-4">{word.translation}</p>
                <div className="text-sm text-gray-500">
                  <p><strong>{t('flashcardReview.context')}:</strong> {word.context}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="mt-6 space-y-2">
          <p className="text-center text-sm text-gray-600 mb-4">
            {t('flashcardReview.grading.howWellKnown')}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleGrade('AGAIN')}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                selectedAnswer === 'AGAIN' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {t('flashcardReview.grading.again')} (1m)
            </button>
            <button
              onClick={() => handleGrade('HARD')}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                selectedAnswer === 'HARD' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              {t('flashcardReview.grading.hard')} (10m)
            </button>
            <button
              onClick={() => handleGrade('GOOD')}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                selectedAnswer === 'GOOD' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {t('flashcardReview.grading.good')}
            </button>
            <button
              onClick={() => handleGrade('EASY')}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                selectedAnswer === 'EASY' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {t('flashcardReview.grading.easy')}
            </button>
          </div>
        </div>
      )}

      {!isFlipped && (
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 mb-2">
            {t('flashcardReview.pressSpaceToFlip')}
          </p>
          <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded border text-sm">
            {t('flashcardReview.tapToReveal')}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecognitionMode;