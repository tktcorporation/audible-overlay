import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { load } from '@tauri-apps/plugin-store';
import "./App.css";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = 'light' | 'dark' | 'system';

interface AudioDevice {
  name: string;
  id: string;
}

interface MonitorInfo {
  id: number;
  name: string;
  position: [number, number];
  size: [number, number];
}

interface SettingsWindowProps {
  devices: AudioDevice[];
  selectedDevice: string;
  monitors: MonitorInfo[];
  selectedMonitor: number;
  theme: Theme;
  audioLevel: number;
  isActive: boolean;
  onDeviceChange: (deviceId: string) => Promise<void>;
  onMonitorChange: (monitorId: number) => Promise<void>;
  onThemeChange: (theme: Theme) => Promise<void>;
}

const ThemeToggle: React.FC<{
  theme: Theme;
  onThemeChange: (theme: Theme) => Promise<void>;
}> = ({ theme, onThemeChange }) => {
  const handleClick = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    onThemeChange(nextTheme);
  };

  return (
    <button
      onClick={handleClick}
      className="theme-toggle-btn"
      title={`現在のテーマ: ${theme === 'system' ? 'システム' : theme === 'light' ? 'ライト' : 'ダーク'}`}
    >
      {theme === 'light' && <Sun size={20} />}
      {theme === 'dark' && <Moon size={20} />}
      {theme === 'system' && <Monitor size={20} />}
    </button>
  );
};

const SettingsWindow: React.FC<SettingsWindowProps> = ({
  devices,
  selectedDevice,
  monitors,
  selectedMonitor,
  theme,
  audioLevel,
  isActive,
  onDeviceChange,
  onMonitorChange,
  onThemeChange,
}) => {
  return (
    <div className="device-selector-window">
      <div className="container mx-auto p-8 max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary">AudibleOverlay</h1>
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
        </div>

        <div className="space-y-6">
          <div className="device-selector">
            <h2>入力デバイスを選択</h2>
            <select 
              value={selectedDevice} 
              onChange={(e) => onDeviceChange(e.target.value)}
              className="select-input"
            >
              <option value="">デバイスを選択してください</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>

          <div className="device-selector">
            <h2>表示モニターを選択</h2>
            <select
              value={selectedMonitor}
              onChange={(e) => onMonitorChange(Number(e.target.value))}
              className="select-input"
            >
              {monitors.map((monitor) => (
                <option key={monitor.id} value={monitor.id}>
                  {monitor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="debug-info">
            <div className="flex justify-between items-center">
              <span>音声レベル: {audioLevel.toFixed(3)}</span>
              <span className={`px-3 py-1 rounded-full text-sm ${isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-100'}`}>
                {isActive ? 'アクティブ' : '非アクティブ'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface OverlayWindowProps {
  isActive: boolean;
}

const OverlayWindow: React.FC<OverlayWindowProps> = ({ isActive }) => {
  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none bg-transparent flex justify-center items-center overflow-hidden">
      <div className={`absolute inset-0 w-full h-full transition-all duration-300 box-border bg-transparent ${isActive ? 'shadow-[0_-10px_10px_rgba(0,255,0,0.4),0_10px_10px_rgba(0,255,0,0.4),-10px_0_10px_rgba(0,255,0,0.4),10px_0_10px_rgba(0,255,0,0.4),inset_0_0_30px_rgba(0,255,0,0.2),inset_0_0_30px_rgba(0,255,0,0.1)]' : ''}`}>
      </div>
    </div>
  );
};

function App() {
  const [isActive, setIsActive] = useState(false);
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [isOverlayWindow, setIsOverlayWindow] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [monitors, setMonitors] = useState<MonitorInfo[]>([]);
  const [selectedMonitor, setSelectedMonitor] = useState<number>(0);
  const [theme, setTheme] = useState<Theme>('system');
  const [threshold, setThreshold] = useState<number>(0.001);

  useEffect(() => {
    const initStore = async () => {
      const store = await load('.settings.dat');
      
      const loadDevices = async () => {
        try {
          console.log('デバイス一覧を取得中...');
          const deviceList = await invoke<AudioDevice[]>('get_input_devices');
          console.log('取得したデバイス一覧:', deviceList);
          setDevices(deviceList);
          
          // 保存されたデバイス設定を読み込む
          const savedDevice = await store.get('selected_device');
          console.log('保存されたデバイス設定:', savedDevice);
          if (savedDevice) {
            setSelectedDevice(savedDevice as string);
            handleDeviceChange(savedDevice as string);
          }

          // 保存されたモニター設定を読み込む
          const savedMonitor = await store.get('selected_monitor');
          if (savedMonitor !== null) {
            setSelectedMonitor(savedMonitor as number);
            handleMonitorChange(savedMonitor as number);
          }

          // 保存されたテーマ設定を読み込む
          const savedTheme = await store.get('theme');
          if (savedTheme) {
            setTheme(savedTheme as Theme);
          }

          // 保存された閾値設定を読み込む
          const savedThreshold = await store.get('threshold');
          if (savedThreshold !== null) {
            setThreshold(savedThreshold as number);
            await invoke('set_threshold', { threshold: savedThreshold });
          }
        } catch (error) {
          console.error('設定の読み込みに失敗:', error);
        }
      };

      loadDevices();
    };

    initStore();
  }, []);

  // テーマの変更を監視し、クラスを更新
  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (theme === 'system') {
      root.classList.remove('light-theme', 'dark-theme');
      root.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
    } else {
      root.classList.remove('light-theme', 'dark-theme');
      root.classList.add(`${theme}-theme`);
    }
  }, [theme]);

  // システムのカラースキーム変更を監視
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const root = document.documentElement;
        root.classList.remove('light-theme', 'dark-theme');
        root.classList.add(mediaQuery.matches ? 'dark-theme' : 'light-theme');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    const loadMonitors = async () => {
      try {
        const monitorList = await invoke<MonitorInfo[]>('get_available_monitors');
        setMonitors(monitorList);
      } catch (error) {
        console.error('モニター一覧の取得に失敗:', error);
      }
    };

    loadMonitors();
  }, []);

  useEffect(() => {
    const checkAudioStatus = async () => {
      const active = await invoke<boolean>('check_audio_active');
      setIsActive(active);
    };

    const interval = setInterval(checkAudioStatus, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initWindow = async () => {
      const windowType = await invoke<string>('get_window_type');
      setIsOverlayWindow(windowType === 'overlay');
    };
    initWindow();
  }, []);

  useEffect(() => {
    const checkAudioLevel = async () => {
      const level = await invoke<number>('get_audio_level');
      setAudioLevel(level);
    };

    const interval = setInterval(checkAudioLevel, 100);
    return () => clearInterval(interval);
  }, []);

  const handleDeviceChange = async (deviceId: string) => {
    try {
      await invoke('set_input_device', { deviceId });
      setSelectedDevice(deviceId);
      
      const store = await load('.settings.dat');
      await store.set('selected_device', deviceId);
      await store.save();
    } catch (error) {
      console.error('デバイスの設定に失敗:', error);
    }
  };

  const handleMonitorChange = async (monitorId: number) => {
    try {
      await invoke('move_overlay_to_monitor', { monitor_id: monitorId });
      setSelectedMonitor(monitorId);
      
      const store = await load('.settings.dat');
      await store.set('selected_monitor', monitorId);
      await store.save();
    } catch (error) {
      console.error('モニターの設定に失敗:', error);
    }
  };

  const handleThemeChange = async (newTheme: Theme) => {
    setTheme(newTheme);
    const store = await load('.settings.dat');
    await store.set('theme', newTheme);
    await store.save();
  };

  return (
    <>
      {!isOverlayWindow && (
        <SettingsWindow
          devices={devices}
          selectedDevice={selectedDevice}
          monitors={monitors}
          selectedMonitor={selectedMonitor}
          theme={theme}
          audioLevel={audioLevel}
          isActive={isActive}
          onDeviceChange={handleDeviceChange}
          onMonitorChange={handleMonitorChange}
          onThemeChange={handleThemeChange}
        />
      )}

      {isOverlayWindow && (
        <OverlayWindow isActive={isActive} />
      )}
    </>
  );
}

export default App;
