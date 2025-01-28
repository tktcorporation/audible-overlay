import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const handleClick = () => {
    const newTheme = theme === 'light' ? 'dark' : 
                     theme === 'dark' ? 'system' : 'light';
    
    document.documentElement.classList.remove('light', 'dark');
    if (newTheme !== 'system') {
      document.documentElement.classList.add(newTheme);
    }
    
    setTheme(newTheme);
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400 hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md flex items-center justify-center"
      title={t('theme.current', { theme: t(`theme.${theme || 'system'}`) })}
    >
      {theme === 'system' ? (
        <Monitor size={20} />
      ) : resolvedTheme === 'light' ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
}; 