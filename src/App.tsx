import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import "./i18n";
import { SettingsWindow } from './components/SettingsWindow';
import { OverlayWindow } from './components/OverlayWindow';
import { useAudioMonitor } from './hooks/useAudioMonitor';
import { useMonitor } from './hooks/useMonitor';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initializeLogger, cleanupLogger } from './utils/logger';

function App() {
  const [isOverlayWindow, setIsOverlayWindow] = useState(false);
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
    const init = async () => {
      await initializeLogger();
      const windowType = await invoke<string>('get_window_type');
      setIsOverlayWindow(windowType === 'overlay');
    };
    init();

    return () => {
      cleanupLogger();
    };
  }, []);

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
