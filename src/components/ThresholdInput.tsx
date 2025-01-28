import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ThresholdInputProps {
  threshold: number;
  onThresholdChange: (threshold: number) => Promise<void>;
}

export const ThresholdInput: React.FC<ThresholdInputProps> = ({ threshold, onThresholdChange }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(threshold.toString());
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    const num = parseFloat(newValue);
    if (!isNaN(num) && num >= 0 && num <= 1) {
      setIsValid(true);
      onThresholdChange(num);
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-gray-800 dark:text-gray-100 text-lg font-semibold tracking-wide relative after:content-[''] after:block after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-indigo-500 after:mt-2 after:rounded">{t('threshold.title')}</h2>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border-2 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 transition-all duration-200 ${
            isValid
              ? 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10'
              : 'border-red-500 dark:border-red-400 focus:ring-2 focus:ring-red-500/10'
          }`}
          placeholder="0.001"
        />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {t('threshold.description')}
        </p>
      </div>
    </div>
  );
}; 