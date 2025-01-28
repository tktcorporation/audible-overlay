import { useTranslation } from 'react-i18next';
import { SettingsWindowProps } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { ThresholdInput } from './ThresholdInput';

export const SettingsWindow: React.FC<SettingsWindowProps> = ({
  devices,
  selectedDevice,
  monitors,
  selectedMonitor,
  audioLevel,
  isActive,
  threshold,
  onDeviceChange,
  onMonitorChange,
  onThresholdChange,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
      <div className="container mx-auto p-8 max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('title')}</h1>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>

        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="mb-4 text-gray-800 dark:text-gray-100 text-lg font-semibold tracking-wide relative after:content-[''] after:block after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-indigo-500 after:mt-2 after:rounded">{t('device.title')}</h2>
            <select 
              value={selectedDevice} 
              onChange={(e) => onDeviceChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer"
            >
              <option value="">{t('device.placeholder')}</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <h2 className="mb-4 text-gray-800 dark:text-gray-100 text-lg font-semibold tracking-wide relative after:content-[''] after:block after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-indigo-500 after:mt-2 after:rounded">{t('monitor.title')}</h2>
            <select
              value={selectedMonitor}
              onChange={(e) => onMonitorChange(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer"
            >
              {monitors.map((monitor) => (
                <option key={monitor.id} value={monitor.id}>
                  {monitor.name}
                </option>
              ))}
            </select>
          </div>

          <ThresholdInput
            threshold={threshold}
            onThresholdChange={onThresholdChange}
          />

          <div className="mt-6 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('status.audioLevel', { level: audioLevel.toFixed(3) })}</span>
              <span className={`px-3 py-1 rounded-full text-sm ${isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-100'}`}>
                {isActive ? t('status.active') : t('status.inactive')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 