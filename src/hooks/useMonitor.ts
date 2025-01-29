import { useState, useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core";
import { MonitorInfo } from '../types';
import { log } from '../utils/logger';
import { safeGet } from '../utils/store';

export const useMonitor = () => {
  const [monitors, setMonitors] = useState<MonitorInfo[]>([]);
  const [selectedMonitor, setSelectedMonitor] = useState<number>(0);

  const updateMonitorSetting = async (monitorId: number) => {
    try {
      await invoke('move_overlay_to_monitor', { monitorId });
      setSelectedMonitor(monitorId);
      await safeGet<number>('selected_monitor', monitorId);
    } catch (error) {
      log.error('モニターの設定に失敗:', error);
    }
  };

  useEffect(() => {
    const loadMonitors = async () => {
      try {
        const monitorList = await invoke<MonitorInfo[]>('get_available_monitors');
        setMonitors(monitorList);

        const savedMonitor = await safeGet<number>('selected_monitor', 0);
        await updateMonitorSetting(savedMonitor);
      } catch (error) {
        log.error('モニター一覧の取得に失敗:', error);
      }
    };

    loadMonitors();
  }, []);

  const handleMonitorChange = async (monitorId: number) => {
    await updateMonitorSetting(monitorId);
  };

  return {
    monitors,
    selectedMonitor,
    handleMonitorChange,
  };
}; 