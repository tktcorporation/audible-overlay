import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { load } from '@tauri-apps/plugin-store';
import { Globe2 } from "lucide-react";

export const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const handleLanguageChange = async (lang: string) => {
    await i18n.changeLanguage(lang);
    setCurrentLang(lang);
    const store = await load('.settings.dat');
    await store.set('language', lang);
    await store.save();
  };

  return (
    <div className="flex items-center gap-2">
      <Globe2 size={20} className="text-gray-600 dark:text-gray-400" />
      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="px-3 py-2 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer"
      >
        <option value="ja">{t('language.ja')}</option>
        <option value="en">{t('language.en')}</option>
      </select>
    </div>
  );
}; 