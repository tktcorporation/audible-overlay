import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ThemeProvider } from 'next-themes';
import { useTranslation } from 'react-i18next';
import "./App.css";
import "./i18n";
import { SettingsWindow } from './components/SettingsWindow';
import { OverlayWindow } from './components/OverlayWindow';
import { useAudioMonitor } from './hooks/useAudioMonitor';
import { useMonitor } from './hooks/useMonitor';

function App() {
  const [isOverlayWindow, setIsOverlayWindow] = useState(false);
  const { i18n } = useTranslation();
  const {
    isActive,
    devices,
    selectedDevice,
    audioLevel,
    threshold,
    handleDeviceChange,
    handleThresholdChange,
  } = useAudioMonitor();
  const {
    monitors,
    selectedMonitor,
    handleMonitorChange,
  } = useMonitor();

  useEffect(() => {
    const initWindow = async () => {
      const windowType = await invoke<string>('get_window_type');
      setIsOverlayWindow(windowType === 'overlay');
    };
    initWindow();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {!isOverlayWindow && (
        <SettingsWindow
          devices={devices}
          selectedDevice={selectedDevice}
          monitors={monitors}
          selectedMonitor={selectedMonitor}
          audioLevel={audioLevel}
          isActive={isActive}
          threshold={threshold}
          onDeviceChange={handleDeviceChange}
          onMonitorChange={handleMonitorChange}
          onThresholdChange={handleThresholdChange}
        />
      )}

      {isOverlayWindow && (
        <OverlayWindow isActive={isActive} />
      )}
    </ThemeProvider>
  );
}

export default App;
