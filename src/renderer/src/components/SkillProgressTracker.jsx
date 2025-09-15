import React, { useState, useEffect } from 'react';
import { Target, Check, Clock, BookOpen, TrendingUp, Flame, Zap, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import electronAPI from '../services/electronAPI';

const SkillProgressTracker = ({ profile }) => {
  const { t } = useLanguage();
  const { savedWords } = useApp();
  const [progressInfo, setProgressInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile && savedWords.length >= 0) {
      loadProgressInfo();
    }
  }, [profile, savedWords]);

  const loadProgressInfo = async () => {
    try {
      setLoading(true);
      const result = await electronAPI.getSkillProgress(profile.id, savedWords);
      if (result.success) {
        setProgressInfo(result.progressInfo);
      }
    } catch (error) {
      console.error('Error loading skill progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!progressInfo) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-3 flex items-center space-x-2">
          <Target className="w-5 h-5 text-indigo-600" />
          <span>{t('skillProgression.progressToNext')}</span>
        </h3>
        <p className="text-gray-600">{t('skillProgression.maxLevelReached')}</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'vocabulary': return <BookOpen className="w-4 h-4" />;
      case 'wellKnownWords': return <Check className="w-4 h-4" />;
      case 'articlesRead': return <TrendingUp className="w-4 h-4" />;
      case 'averageReviews': return <Zap className="w-4 h-4" />;
      case 'currentStreak': return <Flame className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getLabel = (type) => {
    switch (type) {
      case 'vocabulary': return t('skillProgression.vocabulary');
      case 'wellKnownWords': return t('skillProgression.wellKnownWords');
      case 'articlesRead': return t('skillProgression.articlesRead');
      case 'averageReviews': return t('skillProgression.averageReviews');
      case 'currentStreak': return t('skillProgression.currentStreak');
      default: return type;
    }
  };

  const formatValue = (type, value) => {
    if (type === 'currentStreak') {
      return `${value} ${t('skillProgression.days')}`;
    }
    return value;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold mb-4 flex items-center space-x-2">
        <Target className="w-5 h-5 text-indigo-600" />
        <span>{t('skillProgression.progressToNext')}</span>
      </h3>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {t('skillProgression.criteriaToAdvance', { level: progressInfo.nextLevel })}
          </span>
          <span className="text-sm text-gray-500">
            {t('skillProgression.criteriaCount', { 
              met: Object.values(progressInfo.progress).filter(p => p.met).length, 
              total: Object.keys(progressInfo.progress).length 
            })}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(Object.values(progressInfo.progress).filter(p => p.met).length / Object.keys(progressInfo.progress).length) * 100}%` 
            }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(progressInfo.progress).map(([key, progress]) => (
          <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`p-1.5 rounded-lg ${progress.met ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                {getIcon(key)}
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">{getLabel(key)}</span>
                <div className="text-xs text-gray-500">
                  {formatValue(key, progress.current)} / {formatValue(key, progress.required)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {progress.met ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-xs font-medium">{t('skillProgression.completed')}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">{t('skillProgression.inProgress')}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!progressInfo.eligible && (
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-700 text-center">
            {t('skillProgression.keepLearning')}
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillProgressTracker;
