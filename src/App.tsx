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
  const [showSelector, setShowSelector] = useState(true);

  useEffect(() => {
    const initStore = async () => {
      const store = await load('.settings.dat');
      
      const loadDevices = async () => {
        try {
          const deviceList = await invoke<AudioDevice[]>('get_input_devices');
          setDevices(deviceList);
          
          // 保存されたデバイス設定を読み込む
          const savedDevice = await store.get('selected_device');
          if (savedDevice) {
            setSelectedDevice(savedDevice as string);
            handleDeviceChange(savedDevice as string);
            setShowSelector(false);
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

  const handleDeviceChange = async (deviceId: string) => {
    try {
      await invoke('set_input_device', { deviceId });
      setSelectedDevice(deviceId);
      
      // 設定を保存
      const store = await load('.settings.dat');
      await store.set('selected_device', deviceId);
      await store.save();
      
      setShowSelector(false);
    } catch (error) {
      console.error('デバイスの設定に失敗:', error);
    }
  };

  const handleShowSelector = () => {
    setShowSelector(true);
  };

  return (
    <>
      {showSelector && (
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
        </div>
      )}

      <div className={`overlay ${isActive ? 'active' : ''}`}>
        <div className="border-effect" />
        {!showSelector && (
          <button 
            className="settings-button"
            onClick={handleShowSelector}
          >
            設定
          </button>
        )}
      </div>
    </>
  );
}

export default App;
