import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { load } from '@tauri-apps/plugin-store';
import "./App.css";

interface AudioDevice {
  name: string;
  id: string;
}

function App() {
  const [isActive, setIsActive] = useState(false);
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [isOverlayWindow, setIsOverlayWindow] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);

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
        } catch (error) {
          console.error('デバイス一覧の取得に失敗:', error);
        }
      };

      loadDevices();
    };

    initStore();
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

  return (
    <>
      {!isOverlayWindow && (
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
          <div className="debug-info">
            <p>音声レベル: {audioLevel.toFixed(3)}</p>
            <p>アクティブ: {isActive ? "はい" : "いいえ"}</p>
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
