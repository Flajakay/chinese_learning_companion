import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Flame, Zap, TrendingUp, Calendar, Target, Award, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import SkillProgressTracker from '../components/SkillProgressTracker';
import electronAPI from '../services/electronAPI';

const ProgressPage = ({ profile }) => {
  const { t, translateLevel } = useLanguage();
  const { savedWords } = useApp();
  const [stats, setStats] = useState({
    totalWords: 0,
    wellKnownWords: 0,
    recentlyAdded: 0,
    avgReviewCount: 0,
    currentStreak: 0,
    articlesRead: 0,
    achievements: []
  });
  
  useEffect(() => {
    const loadStats = async () => {
      try {
        const completeStats = await electronAPI.getCompleteStats(savedWords, profile);
        setStats(completeStats);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
  }, [savedWords, profile]);

  const recentWords = savedWords
    .sort((a, b) => new Date(b.addedAt || b.dateAdded) - new Date(a.addedAt || a.dateAdded))
    .slice(0, 10);

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">{t('progress.title')}</h1>
        <p className="text-gray-600">
          {t('progress.subtitle')}
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('progress.totalWords')}</p>
                  <p className="text-2xl font-bold text-indigo-600">{stats.totalWords}</p>
                  <p className="text-xs text-gray-500">{t('progress.wordsSaved')}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <BookOpen size={24} className="text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('progress.wellKnown')}</p>
                  <p className="text-2xl font-bold text-green-600">{stats.wellKnownWords}</p>
                  <p className="text-xs text-gray-500">{t('progress.reviewsCount')}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('progress.thisWeek')}</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.recentlyAdded}</p>
                  <p className="text-xs text-gray-500">{t('progress.newWords')}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Flame size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('progress.avgReviews')}</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.avgReviewCount}</p>
                  <p className="text-xs text-gray-500">{t('progress.perWord')}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
            <SkillProgressTracker profile={profile} />

            <div className="bg-white rounded-lg shadow p-6 flex flex-col">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2 flex-shrink-0">
                <BookOpen size={20} className="text-green-600" />
                <span>{t('progress.recentWords')}</span>
              </h2>
              
              {recentWords.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center text-gray-600">
                  <div>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen size={32} className="text-gray-400" />
                    </div>
                    <p>{t('progress.noWordsSavedYet')}</p>
                    <p className="text-sm">{t('progress.startReadingToAdd')}</p>
                  </div>
                </div>
              ) : (
                <div className="max-h-[440px] overflow-y-auto">
                  <div className="space-y-2 pr-1">
                    {recentWords.map((word) => (
                      <div key={word.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <span className="font-semibold">{word.word}</span>
                          <p className="text-xs text-gray-500">{word.translation}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                            <Calendar size={12} />
                            <span>{new Date(word.addedAt || word.dateAdded).toLocaleDateString()}</span>
                          </div>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            <Zap size={10} className="mr-1" />
                            {word.repetitions || 0} {t('progress.reviews')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <User size={20} className="text-purple-600" />
              <span>{t('progress.profileInformation')}</span>
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Target size={16} className="text-indigo-600" />
                  <span>{t('progress.learningDetails')}</span>
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-2">
                      <BookOpen size={14} />
                      <span>Chinese:</span>
                    </span>
                    <span className="font-semibold">中文</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-2">
                      <TrendingUp size={14} />
                      <span>{t('progress.currentLevel')}:</span>
                    </span>
                    <span className="font-semibold">{translateLevel ? translateLevel(profile?.currentLevel) : profile?.currentLevel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-2">
                      <Target size={14} />
                      <span>{t('progress.dailyGoal')}:</span>
                    </span>
                    <span className="font-semibold">{profile?.dailyGoal} {t('progress.minutes')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-2">
                      <Calendar size={14} />
                      <span>{t('progress.started')}:</span>
                    </span>
                    <span className="font-semibold">
                      {new Date(profile?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Award size={16} className="text-yellow-600" />
                  <span>{t('progress.achievements')}</span>
                </h3>
                <div className="space-y-2">
                  {stats.achievements.includes('first10Words') && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2 mb-2">
                      <Target size={12} className="mr-1" />
                      {t('progress.first10Words')}
                    </span>
                  )}
                  {stats.achievements.includes('vocabularyBuilder') && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2 mb-2">
                      <BookOpen size={12} className="mr-1" />
                      {t('progress.vocabularyBuilder')}
                    </span>
                  )}
                  {stats.achievements.includes('quickLearner') && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2 mb-2">
                      <Zap size={12} className="mr-1" />
                      {t('progress.quickLearner')}
                    </span>
                  )}
                  {stats.achievements.includes('weekWarrior') && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2 mb-2">
                      <Flame size={12} className="mr-1" />
                      {t('progress.weekWarrior')}
                    </span>
                  )}
                  {stats.achievements.length === 0 && (
                    <div className="text-center py-4 text-gray-600">
                      <CheckCircle size={24} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">{t('progress.keepLearningToUnlock')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
