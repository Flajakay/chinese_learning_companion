import React from 'react';
import { Home, FileText, BookOpen, BarChart3 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = ({ currentPage, onPageChange, profile, onSwitchProfile }) => {
  const { t, availableLanguages, currentLanguage, changeLanguage } = useLanguage();

  const menuItems = [
    { id: 'progress', label: t('navigation.progress'), icon: 'chart' },
    { id: 'articles', label: t('navigation.articles'), icon: 'document' },
    { id: 'flashcards', label: t('navigation.flashcards'), icon: 'book' }
  ];

  const getIcon = (iconName) => {
    const icons = {
      home: <Home className="w-5 h-5" />,
      document: <FileText className="w-5 h-5" />,
      book: <BookOpen className="w-5 h-5" />,
      chart: <BarChart3 className="w-5 h-5" />
    };
    return icons[iconName];
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Chinese Learning</h1>
        <p className="text-sm text-gray-600 mt-1">{profile?.name}</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentPage === item.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {getIcon(item.icon)}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('navigation.language')}
          </label>
          <select
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {availableLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onSwitchProfile}
          className="w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {t('navigation.switchProfile')}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
