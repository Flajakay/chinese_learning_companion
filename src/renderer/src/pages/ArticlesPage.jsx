import React, { useState, useEffect } from 'react';
import { RefreshCw, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import ArticleReader from '../components/ArticleReader';
import electronAPI from '../services/electronAPI';

const ArticlesPage = ({ profile }) => {
  const { t } = useLanguage();
  const { appState, updateAppState } = useApp();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cacheInfo, setCacheInfo] = useState(null);
  const [selectedStory, setSelectedStory] = useState(appState.currentArticle);
  const [selectedLevel, setSelectedLevel] = useState('HSK1');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [readArticles, setReadArticles] = useState(new Set());

  useEffect(() => {
    loadStories();
    loadAvailableCategories();
  }, [selectedLevel, selectedCategory]);

  useEffect(() => {
    loadReadArticles();
  }, [stories, profile]);

  const loadReadArticles = async () => {
    if (!profile) return;
    
    const readSet = new Set();
    for (const story of stories) {
      const isRead = await electronAPI.isArticleRead(profile.id, story.id);
      if (isRead) {
        readSet.add(story.id);
      }
    }
    setReadArticles(readSet);
  };

  const markAsRead = async (articleId, event) => {
    event.stopPropagation();
    if (!profile) return;
    
    const result = await electronAPI.markArticleAsRead(profile.id, articleId);
    if (result.success) {
      setReadArticles(prev => new Set([...prev, articleId]));
    }
  };

  const loadStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await electronAPI.fetchStories(20, selectedLevel, selectedCategory);
      if (result.success) {
        setStories(result.data);
        setCacheInfo(result.meta);
      } else {
        setError(result.error);
        setCacheInfo({ totalStories: 0, returnedStories: 0, error: result.error });
      }
    } catch (err) {
      setError(err.message);
      setCacheInfo({ totalStories: 0, returnedStories: 0, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableCategories = async () => {
    try {
      const result = await electronAPI.getStoryCategories();
      if (result.success) {
        setAvailableCategories(result.data);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleStorySelect = (story) => {
    setSelectedStory(story);
    updateAppState({ 
      currentArticle: story,
      readingPosition: null
    });
  };

  const handleBackToList = () => {
    setSelectedStory(null);
    updateAppState({ 
      currentArticle: null,
      readingPosition: null
    });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === 'all' ? null : category);
  };

  const getCategoryDisplayName = (category) => {
    return t(`articles.${category}`) || category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (selectedStory) {
    return (
      <ArticleReader 
        article={selectedStory}
        onBack={handleBackToList}
        profile={profile}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('articles.title')}</h1>
            <p className="text-gray-600">
              {t('articles.subtitle')}
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={loadStories}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <RefreshCw size={16} />
              )}
              <span>{t('articles.refresh')}</span>
            </button>
          </div>
        </div>
        
        <div className="flex space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">{t('articles.level')}:</label>
            <select 
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="HSK1">HSK 1</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">{t('articles.category')}:</label>
            <select 
              value={selectedCategory || 'all'}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">{t('articles.allCategories')}</option>
              {availableCategories.map(category => (
                <option key={category} value={category}>
                  {getCategoryDisplayName(category)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {cacheInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <BookOpen size={16} />
                  <span>{t('articles.stories')}: {cacheInfo.returnedStories || 0}/{cacheInfo.totalStories || 0}</span>
                </span>
                {cacheInfo.error && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                    {t('common.error')}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {t('articles.hskLearningStories')}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story, index) => {
              const isRead = readArticles.has(story.id);
              return (
                <div 
                  key={story.id || index}
                  onClick={() => handleStorySelect(story)}
                  className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border ${isRead ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
                >
                  <div className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{story.title}</h3>
                          {isRead ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 ml-2">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {t('articles.alreadyRead')}
                            </span>
                          ) : (
                            <button
                              onClick={(e) => markAsRead(story.id, e)}
                              className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors ml-2"
                            >
                              {t('articles.markAsRead')}
                            </button>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {story.content.substring(0, 120)}...
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <BookOpen size={12} />
                            <span>{story.source || 'Chinese Stories'}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{new Date(story.publishedAt || story.createdAt).toLocaleDateString()}</span>
                          </span>
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                            {story.level}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                            {getCategoryDisplayName(story.category)}
                          </span>
                          {story.wordCount && (
                            <span>{story.wordCount} {t('articleReader.words')}</span>
                          )}
                          {story.readTime && (
                            <span>{story.readTime} min</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {stories.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="text-gray-500">{t('articles.noStoriesAvailable')}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;