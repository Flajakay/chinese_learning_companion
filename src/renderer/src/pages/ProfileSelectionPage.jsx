import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import ProfileCreator from '../components/ProfileCreator';
import electronAPI from '../services/electronAPI';

const ProfileSelectionPage = ({ profiles, setProfiles, setCurrentProfile, onProfileSelected }) => {
  const { t } = useLanguage();
  const { savedWords } = useApp();
  const [showCreator, setShowCreator] = useState(false);
  const [statsCache, setStatsCache] = useState({});

  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await electronAPI.getWordStats(savedWords);
        setStatsCache(stats);
      } catch (error) {
        console.error('Error loading stats:', error);
        setStatsCache({ totalWords: 0 });
      }
    };
    loadStats();
  }, [savedWords]);

  const handleCreateProfile = (profileData) => {
    const newProfile = {
      ...profileData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      stats: {
        articlesRead: 0,
        currentStreak: 0,
        lastActivityDate: null
      }
    };
    
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    setCurrentProfile(newProfile);
    setShowCreator(false);
    onProfileSelected();
  };

  const handleSelectProfile = (profile) => {
    setCurrentProfile(profile);
    onProfileSelected();
  };

  if (showCreator) {
    return (
      <ProfileCreator
        onSave={handleCreateProfile}
        onCancel={() => setShowCreator(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('profileSelection.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('profileSelection.subtitle')}
          </p>
        </div>

        {profiles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {t('profileSelection.welcome')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('profileSelection.welcomeDescription')}
              </p>
            </div>
            <button
              onClick={() => setShowCreator(true)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              {t('profileSelection.createYourProfile')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {t('profileSelection.selectProfile')}
              </h2>
              <p className="text-gray-600">
                {t('profileSelection.selectDescription')}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile)}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-indigo-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
                    <div className="text-sm text-gray-500">
                      {t('profileSelection.learning')}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>{t('profileSelection.articles')}</span>
                      <span>{profile.stats.articlesRead}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('profileSelection.words')}</span>
                      <span>{statsCache.totalWords || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('profileSelection.dayStreak')}</span>
                      <span>{profile.stats.currentStreak}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('profileSelection.started')}</span>
                      <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center text-indigo-600 text-sm font-medium">
                    {t('profileSelection.clickToContinue')}
                  </div>
                </div>
              ))}
              
              <div
                onClick={() => setShowCreator(true)}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors flex flex-col items-center justify-center min-h-[200px]"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-gray-600 font-medium">{t('profileSelection.newProfile')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSelectionPage;
