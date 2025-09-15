import React from 'react';
import { Star, Award, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LevelUpModal = ({ isOpen, onClose, previousLevel, newLevel }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-400 opacity-10"></div>
        
        <div className="relative p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-white" />
            </div>
            
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t('skillProgression.levelUpTitle')}
              </h2>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            
            <p className="text-lg text-gray-700 mb-2">
              {t('skillProgression.congratulations')}
            </p>
            
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="px-4 py-2 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-600">{previousLevel}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-yellow-500" />
              <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-bold">
                <span className="text-sm">{newLevel}</span>
              </div>
            </div>
            
            <p className="text-gray-600">
              {t('skillProgression.skillImproved')}
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-6 h-6 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
          >
            {t('skillProgression.continue')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;
