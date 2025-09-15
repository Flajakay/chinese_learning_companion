import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Languages, Eye, EyeOff, Volume2, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import electronAPI from '../services/electronAPI';
import audioService from '../services/audioService';
import LevelUpModal from './LevelUpModal';
import { useLevelUpManager } from '../hooks/useLevelUpManager';

const ChineseParagraph = ({ text, onTranslate, onWordClick, onPlayAudio, showPinyin, translateTitle, audioTitle }) => {
  const [content, setContent] = useState(text);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const segmentParagraph = async () => {
      try {
        const result = await electronAPI.segmentChineseText(text);
        if (result.success && result.data) {
          const segmentedContent = result.data;
          const renderedContent = [];
          let textIndex = 0;
          
          segmentedContent.forEach((wordData, index) => {
            const wordStart = text.indexOf(wordData.word, textIndex);
            
            if (wordStart > textIndex) {
              renderedContent.push(
                <span key={`text-${index}`}>
                  {text.substring(textIndex, wordStart)}
                </span>
              );
            }
            
            if (wordStart !== -1) {
              renderedContent.push(
                <span
                  key={`word-${index}`}
                  className="cursor-pointer hover:bg-indigo-100 rounded relative group"
                  onClick={(e) => onWordClick(wordData, e)}
                  title={showPinyin ? wordData.word : wordData.pinyin}
                >
                  {showPinyin ? wordData.pinyin : wordData.word}
                </span>
              );
              
              textIndex = wordStart + wordData.word.length;
            }
          });
          
          if (textIndex < text.length) {
            renderedContent.push(
              <span key="final-text">
                {text.substring(textIndex)}
              </span>
            );
          }
          
          setContent(renderedContent);
        }
      } catch (error) {
        console.error('Error segmenting paragraph:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    segmentParagraph();
  }, [text, showPinyin]);

  return (
    <p className="mb-4 relative">
      {isLoading ? text : content}
      <button
        className="ml-2 opacity-50 hover:opacity-100 transition-opacity p-1 rounded"
        onClick={() => onTranslate(text)}
        title={translateTitle}
      >
        <Languages size={12} />
      </button>
      <button
        className="ml-1 opacity-50 hover:opacity-100 transition-opacity p-1 rounded"
        onClick={() => onPlayAudio(text)}
        title={audioTitle}
      >
        <Volume2 size={12} />
      </button>
    </p>
  );
};

const ArticleReader = ({ article, onBack, profile }) => {
  const { t, currentLanguage } = useLanguage();
  const { saveWord, getWordByText, appState, updateAppState, savedWords } = useApp();
  const { showLevelUpModal, levelUpInfo, checkForLevelUp, closeLevelUpModal } = useLevelUpManager();
  const [selectedWord, setSelectedWord] = useState(null);
  const [translation, setTranslation] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const [showParagraphTranslation, setShowParagraphTranslation] = useState(false);
  const [paragraphTranslation, setParagraphTranslation] = useState('');
  const [selectedParagraph, setSelectedParagraph] = useState(null);
  const [fullArticle, setFullArticle] = useState(null);
  const [loadingArticle, setLoadingArticle] = useState(false);
  const [articleError, setArticleError] = useState(null);
  const [showPinyin, setShowPinyin] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (appState.readingPosition && contentRef.current) {
      setTimeout(() => {
        window.scrollTo(0, appState.readingPosition);
      }, 100);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      updateAppState({ readingPosition: window.scrollY });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateAppState]);

  useEffect(() => {
    loadFullStory();
  }, [article.id]);

  const loadFullStory = async () => {
    if (!article.id) return;
    
    setLoadingArticle(true);
    setArticleError(null);
    
    try {
      const result = await electronAPI.getStory(article.id);
      if (result.success) {
        setFullArticle(result.data);
      } else {
        setArticleError(result.error);
      }
    } catch (error) {
      console.error('ArticleReader: Error loading story:', error);
      setArticleError(error.message);
    } finally {
      setLoadingArticle(false);
    }
  };

  const handleWordClick = useCallback(async (wordData, event) => {
    setSelectedWord({ ...wordData, element: event.target });
    
    const result = await electronAPI.translateWord(wordData.word);
    if (result.success) {
      setTranslation(result.data);
    } else {
      setTranslation({
        word: wordData.word,
        translations: [{
          pos: 'error',
          terms: [`${t('common.error')}: ${result.error}`],
          entries: []
        }],
        hasMultipleOptions: false
      });
    }
    setShowTranslation(true);
  }, [t]);

  const handleParagraphTranslate = useCallback(async (paragraphText) => {
    setSelectedParagraph(paragraphText);
    
    try {
      const result = await electronAPI.translateText(paragraphText);
      if (result.success) {
        setParagraphTranslation(result.translation);
        setShowParagraphTranslation(true);
      }
    } catch (error) {
      console.error('Error translating paragraph:', error);
    }
  }, []);

  const handleParagraphAudio = useCallback((text) => {
    audioService.playAudio(text);
  }, []);

  const handleSaveWord = async () => {
    if (selectedWord && translation) {
      const wordData = {
        word: selectedWord.word,
        translation: translation.translations?.[0]?.terms?.[0] || 'No translation',
        context: selectedParagraph || article.title,
        pinyin: selectedWord.pinyin
      };
      
      const isNew = saveWord(wordData);
      if (isNew && profile) {
        await electronAPI.updateProfileStats(profile.id);
        await checkForLevelUp(profile.id, savedWords);
      }
      setShowTranslation(false);
    }
  };

  const isWordSaved = (word) => {
    return Boolean(getWordByText(word));
  };

  const getDisplayContent = () => {
    if (fullArticle && fullArticle.content && !fullArticle.isFallback) {
      return fullArticle.content;
    }
    
    const content = article.content || article.description || 'Content not available';
    return content;
  };

  const getDisplayTitle = () => {
    if (fullArticle && fullArticle.title && !fullArticle.isFallback) {
      return fullArticle.title;
    }
    return article.title;
  };

  const content = getDisplayContent();
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>{t('articleReader.back')}</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                showPinyin 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showPinyin ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showPinyin ? t('articleReader.hidePinyin') : t('articleReader.showPinyin')}</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{getDisplayTitle()}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{article.source || 'Chinese Stories'}</span>
            <span>{new Date(article.createdAt || article.publishedAt).toLocaleDateString()}</span>
            {fullArticle && fullArticle.wordCount > 0 && (
              <span>{fullArticle.wordCount} {t('articleReader.words')}</span>
            )}
            {fullArticle && fullArticle.author && (
              <span>{t('articleReader.by')} {fullArticle.author}</span>
            )}
          </div>
        </div>

        {loadingArticle && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Loader className="animate-spin" size={16} />
              <span className="text-blue-800">Loading story...</span>
            </div>
          </div>
        )}

        {articleError && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">Story unavailable</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6" ref={contentRef}>
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg">
            {!loadingArticle ? (
              <div>
                {(() => {
                  if (content.includes('\n\n')) {
                    return paragraphs.map((paragraph, index) => {
                      if (!paragraph.trim()) return null;
                      return (
                        <ChineseParagraph 
                          key={index}
                          text={paragraph.trim()}
                          onTranslate={handleParagraphTranslate}
                          onWordClick={handleWordClick}
                          onPlayAudio={handleParagraphAudio}
                          showPinyin={showPinyin}
                          translateTitle={t('articleReader.translateParagraph')}
                          audioTitle={t('articleReader.playAudio')}
                        />
                      );
                    }).filter(Boolean);
                  } else {
                    return (
                      <ChineseParagraph 
                        text={content}
                        onTranslate={handleParagraphTranslate}
                        onWordClick={handleWordClick}
                        onPlayAudio={handleParagraphAudio}
                        showPinyin={showPinyin}
                        translateTitle={t('articleReader.translateParagraph')}
                        audioTitle={t('articleReader.playAudio')}
                      />
                    );
                  }
                })()}
              </div>
            ) : (
              <p className="text-gray-600">{t('common.loading')}</p>
            )}
          </div>
        </div>
      </div>

      {showTranslation && selectedWord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">{t('articleReader.wordTranslation')}</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-2xl font-bold">{selectedWord.word}</span>
                {selectedWord.pinyin && (
                  <span className="ml-2 text-gray-500">[{selectedWord.pinyin}]</span>
                )}
              </div>
              
              {translation.translations && translation.translations.map((trans, index) => (
                <div key={index} className="border-l-4 border-indigo-500 pl-4">
                  <div className="font-medium text-gray-700">{trans.pos}</div>
                  <div className="text-gray-900">{trans.terms.join(', ')}</div>
                </div>
              ))}
              
              <div className="text-sm text-gray-600">
                <strong>{t('articleReader.context')}:</strong> {selectedParagraph || article.title}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTranslation(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                {t('articleReader.close')}
              </button>
              <button
                onClick={handleSaveWord}
                disabled={isWordSaved(selectedWord.word)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {isWordSaved(selectedWord.word) ? t('articleReader.alreadySaved') : t('articleReader.saveWord')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showParagraphTranslation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{t('articleReader.paragraphTranslation')}</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">{t('articleReader.original')}</h4>
                <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedParagraph}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">{t('articleReader.translation')}</h4>
                <p className="text-gray-900 bg-blue-50 p-3 rounded">{paragraphTranslation}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowParagraphTranslation(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {t('articleReader.close')}
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

export default ArticleReader;
