import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SKILL_LEVELS, SKILL_LEVEL_ORDER } from '../../../shared/utils/skillProgression';

const ProfileCreator = ({ onSave, onCancel }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    currentLevel: SKILL_LEVELS.BEGINNER,
    dailyGoal: 30
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('profileCreator.nameError');
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {t('profileCreator.title')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profileCreator.name')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={t('profileCreator.namePlaceholder')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profileCreator.currentLevel')}
            </label>
            <select
              value={formData.currentLevel}
              onChange={(e) => handleChange('currentLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {SKILL_LEVEL_ORDER.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profileCreator.dailyGoal')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="5"
                max="180"
                step="5"
                value={formData.dailyGoal}
                onChange={(e) => handleChange('dailyGoal', parseInt(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-500">{t('profileCreator.dailyGoalMin')}</span>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('profileCreator.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {t('profileCreator.createProfile')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreator;
