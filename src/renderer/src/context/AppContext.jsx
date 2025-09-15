import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../../../shared/constants';
import useStorage from '../hooks/useStorage';
import electronAPI from '../services/electronAPI';

const AppContext = createContext();

const DEFAULT_APP_STATE = {
  currentPage: 'dashboard',
  currentArticle: null,
  readingPosition: null,
  lastActivity: new Date().toISOString()
};

const DEFAULT_SAVED_WORDS = [];

export const AppProvider = ({ children }) => {
  const [appState, setAppState, { loading: appStateLoading }] = useStorage(STORAGE_KEYS.APP_STATE, DEFAULT_APP_STATE);

  const [savedWords, setSavedWords, { loading: wordsLoading }] = useStorage(STORAGE_KEYS.SAVED_WORDS, DEFAULT_SAVED_WORDS);

  const updateAppState = (updates) => {
    const newState = {
      ...appState,
      ...updates,
      lastActivity: new Date().toISOString()
    };
    setAppState(newState);
  };

  const saveWord = (wordData) => {
    const existingIndex = savedWords.findIndex(w => w.word === wordData.word);
    let newWords;
    
    if (existingIndex >= 0) {
      newWords = [...savedWords];
      newWords[existingIndex] = { ...newWords[existingIndex], ...wordData };
    } else {
      newWords = [...savedWords, {
        ...wordData,
        id: Date.now().toString(),
        addedAt: new Date().toISOString(),
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        nextReviewDate: new Date().toISOString()
      }];
    }
    
    setSavedWords(newWords);
    return !Boolean(existingIndex >= 0);
  };

  const updateWord = (wordId, updates) => {
    const newWords = savedWords.map(word => 
      word.id === wordId ? { ...word, ...updates } : word
    );
    setSavedWords(newWords);
  };

  const deleteWord = (wordId) => {
    const newWords = savedWords.filter(word => word.id !== wordId);
    setSavedWords(newWords);
  };

  const getWordByText = (text) => {
    return savedWords.find(word => word.word === text);
  };

  const isLoading = appStateLoading || wordsLoading;

  return (
    <AppContext.Provider value={{
      appState,
      updateAppState,
      savedWords,
      setSavedWords,
      saveWord,
      updateWord,
      deleteWord,
      getWordByText,
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
