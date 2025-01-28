export type Theme = 'light' | 'dark' | 'system';

export interface AudioDevice {
  name: string;
  id: string;
}

export interface MonitorInfo {
  id: number;
  name: string;
  position: [number, number];
  size: [number, number];
}

export interface SettingsWindowProps {
  devices: AudioDevice[];
  selectedDevice: string;
  monitors: MonitorInfo[];
  selectedMonitor: number;
  audioLevel: number;
  isActive: boolean;
  threshold: number;
  onDeviceChange: (deviceId: string) => Promise<void>;
  onMonitorChange: (monitorId: number) => Promise<void>;
  onThresholdChange: (threshold: number) => Promise<void>;
} 