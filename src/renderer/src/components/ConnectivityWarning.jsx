import React from 'react';
import { WifiOff, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ConnectivityWarning = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-orange-100 rounded-full p-3">
              <WifiOff className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 text-center mb-4">
            {t('connectivity.title')}
          </h2>
          
          <p className="text-gray-600 text-center mb-6">
            {t('connectivity.message')}
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">{t('connectivity.canRead')}</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">{t('connectivity.canReview')}</span>
            </div>
            <div className="flex items-center space-x-3">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">{t('connectivity.cannotTranslate')}</span>
            </div>
            <div className="flex items-center space-x-3">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">{t('connectivity.cannotTTS')}</span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {t('connectivity.understood')}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConnectivityWarning;
