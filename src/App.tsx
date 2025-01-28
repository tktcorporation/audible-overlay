import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { load } from '@tauri-apps/plugin-store';
import "./App.css";

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
      
      // 設定を保存
      const store = await load('.settings.dat');
      await store.set('selected_device', deviceId);
      await store.save();
    } catch (error) {
      console.error('デバイスの設定に失敗:', error);
    }
  };

  const handleMonitorChange = async (monitorId: number) => {
    try {
      // オーバーレイウィンドウを移動
      await invoke('move_overlay_to_monitor', { monitor_id: monitorId });
      setSelectedMonitor(monitorId);
      
      // 設定を保存
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

  const handleThresholdChange = async (newThreshold: number) => {
    try {
      setThreshold(newThreshold);
      await invoke('set_threshold', { threshold: newThreshold });
      const store = await load('.settings.dat');
      await store.set('threshold', newThreshold);
      await store.save();
    } catch (error) {
      console.error('閾値の設定に失敗:', error);
    }
  };

  return (
    <>
      {!isOverlayWindow && (
        <div className="device-selector-window">
          <div className="device-selector">
            <h2>入力デバイスを選択</h2>
            <select 
              value={selectedDevice} 
              onChange={(e) => handleDeviceChange(e.target.value)}
            >
              <option value="">デバイスを選択してください</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>

            <h2>表示モニターを選択</h2>
            <select
              value={selectedMonitor}
              onChange={(e) => handleMonitorChange(Number(e.target.value))}
            >
              {monitors.map((monitor) => (
                <option key={monitor.id} value={monitor.id}>
                  {monitor.name}
                </option>
              ))}
            </select>

            <h2>テーマ設定</h2>
            <select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value as Theme)}
              className="theme-select"
            >
              <option value="system">システム設定に同期</option>
              <option value="light">ライトモード</option>
              <option value="dark">ダークモード</option>
            </select>

            <h2>音声検出閾値</h2>
            <input
              type="number"
              min="0.0001"
              max="0.01"
              step="0.0001"
              value={threshold}
              onChange={(e) => handleThresholdChange(Number(e.target.value))}
              className="threshold-input"
            />
            <div className="threshold-value">
              現在の閾値: {threshold?.toFixed(4) ?? '0.0010'}
            </div>

            <div className="debug-info">
              <p>音声レベル: {audioLevel.toFixed(3)}</p>
              <p>アクティブ: {isActive ? "はい" : "いいえ"}</p>
            </div>
          </div>
        </div>
      )}

      {isOverlayWindow && (
        <div className={`overlay ${isActive ? 'active' : ''}`}>
          <div className="border-effect" />
        </div>
      )}
    </>
  );
}

export default App;
