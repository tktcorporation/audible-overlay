import { useState, useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core";
import { load } from '@tauri-apps/plugin-store';
import { AudioDevice } from '../types';
import { log } from '../utils/logger';
import { safeGet } from '../utils/store';

export const useAudioMonitor = () => {
  const [isActive, setIsActive] = useState(false);
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('default');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [threshold, setThreshold] = useState<number>(0.001);

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        log.info('デバイス一覧を取得中...');
        const deviceList = await invoke<AudioDevice[]>('get_input_devices');
        log.info('取得したデバイス一覧:', deviceList);
        setDevices(deviceList);

        const savedDevice = await safeGet<string>('selected_device', 'default');
        setSelectedDevice(savedDevice);
        await invoke('set_input_device', { deviceId: savedDevice });

        const savedThreshold = await safeGet<number>('threshold', 0.001);
        setThreshold(savedThreshold);
        await invoke('set_threshold', { threshold: savedThreshold });
      } catch (error) {
        log.error('設定の初期化に失敗:', error);
      }
    };

    initializeSettings();
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
      log.error('デバイスの設定に失敗:', error);
    }
  };

  const handleThresholdChange = async (newThreshold: number) => {
    try {
      setThreshold(newThreshold);
      await invoke('set_threshold', { threshold: newThreshold });
      
      const store = await load('.settings.dat');
      await store.set('threshold', newThreshold);
      await store.save();
    } catch (error) {
      log.error('閾値の設定に失敗:', error);
    }
  };

  return {
    isActive,
    devices,
    selectedDevice,
    audioLevel,
    threshold,
    handleDeviceChange,
    handleThresholdChange,
  };
}; 