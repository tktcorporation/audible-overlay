import { useState, useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core";
import { load } from '@tauri-apps/plugin-store';
import { MonitorInfo } from '../types';
import { log } from '../utils/logger';

export const useMonitor = () => {
  const [monitors, setMonitors] = useState<MonitorInfo[]>([]);
  const [selectedMonitor, setSelectedMonitor] = useState<number>(0);

  useEffect(() => {
    const loadMonitors = async () => {
      try {
        const monitorList = await invoke<MonitorInfo[]>('get_available_monitors');
        setMonitors(monitorList);

        const store = await load('.settings.dat');
        const savedMonitor = await store.get('selected_monitor');
        if (savedMonitor !== null) {
          setSelectedMonitor(savedMonitor as number);
          handleMonitorChange(savedMonitor as number);
        }
      } catch (error) {
        log.error('モニター一覧の取得に失敗:', error);
      }
    };

    loadMonitors();
  }, []);

  const handleMonitorChange = async (monitorId: number) => {
    try {
      await invoke('move_overlay_to_monitor', { monitor_id: monitorId });
      setSelectedMonitor(monitorId);
      
      const store = await load('.settings.dat');
      await store.set('selected_monitor', monitorId);
      await store.save();
    } catch (error) {
      log.error('モニターの設定に失敗:', error);
    }
  };

  return {
    monitors,
    selectedMonitor,
    handleMonitorChange,
  };
}; 