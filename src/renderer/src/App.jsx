import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AppProvider } from './context/AppContext';
import ProfileSelectionPage from './pages/ProfileSelectionPage';
import ArticlesPage from './pages/ArticlesPage';
import FlashcardsPage from './pages/FlashcardsPage';
import ProgressPage from './pages/ProgressPage';
import Sidebar from './components/Sidebar';
import ConnectivityWarning from './components/ConnectivityWarning';
import useStorage from './hooks/useStorage';
import checkInternetConnection from './utils/checkConnection';
import { STORAGE_KEYS } from '../../shared/constants';

const DEFAULT_PROFILES = [];
const DEFAULT_CURRENT_PROFILE = null;

function App() {
  const [profiles, setProfiles, { loading: profilesLoading }] = useStorage(STORAGE_KEYS.PROFILES, DEFAULT_PROFILES);
  const [currentProfile, setCurrentProfile, { loading: currentProfileLoading }] = useStorage(STORAGE_KEYS.CURRENT_PROFILE, DEFAULT_CURRENT_PROFILE);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showConnectivityWarning, setShowConnectivityWarning] = useState(false);

  useEffect(() => {
    if (!profilesLoading && !currentProfileLoading) {
      if (!currentProfile || profiles.length === 0) {
        setCurrentPage('profile-selection');
      }
    }
  }, [profiles, currentProfile, profilesLoading, currentProfileLoading]);

  useEffect(() => {
    const checkConnection = async () => {
      const isOnline = await checkInternetConnection();
      if (!isOnline) {
        setShowConnectivityWarning(true);
      }
    };
    
    checkConnection();
  }, []);

  const renderPage = () => {
    if (currentPage === 'profile-selection' || !currentProfile) {
      return (
        <ProfileSelectionPage 
          profiles={profiles}
          setProfiles={setProfiles}
          setCurrentProfile={setCurrentProfile}
          onProfileSelected={() => setCurrentPage('progress')}
        />
      );
    }

    switch (currentPage) {
      case 'articles':
        return <ArticlesPage profile={currentProfile} />;
      case 'flashcards':
        return <FlashcardsPage profile={currentProfile} />;
      case 'progress':
        return <ProgressPage profile={currentProfile} />;
      default:
        return <ProgressPage profile={currentProfile} onPageChange={setCurrentPage} />;
    }
  };

  return (
    <LanguageProvider>
      <AppProvider>
        <ConnectivityWarning 
          isOpen={showConnectivityWarning}
          onClose={() => setShowConnectivityWarning(false)}
        />
        {(currentPage === 'profile-selection' || !currentProfile) ? (
          renderPage()
        ) : (
          <div className="min-h-screen bg-gray-100 flex">
            <Sidebar 
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              profile={currentProfile}
              onSwitchProfile={() => setCurrentPage('profile-selection')}
            />
            <main className="flex-1 ml-64">
              {renderPage()}
            </main>
          </div>
        )}
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;
