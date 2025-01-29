import { useState, useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core";
import { load } from '@tauri-apps/plugin-store';
import { MonitorInfo } from '../types';
import { log } from '../utils/logger';
import { safeGet } from '../utils/store';

export const useMonitor = () => {
  const [monitors, setMonitors] = useState<MonitorInfo[]>([]);
  const [selectedMonitor, setSelectedMonitor] = useState<number>(0);

  useEffect(() => {
    const loadMonitors = async () => {
      try {
        const monitorList = await invoke<MonitorInfo[]>('get_available_monitors');
        setMonitors(monitorList);

        const savedMonitor = await safeGet<number>('selected_monitor', 0);
        setSelectedMonitor(savedMonitor);
        await invoke('move_overlay_to_monitor', { monitor_id: savedMonitor });
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