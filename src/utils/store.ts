import { load } from '@tauri-apps/plugin-store';
import { log } from './logger';

export const safeGet = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const store = await load('.settings.dat');
    if (await store.has(key)) {
      const value = await store.get(key);
      if (typeof value === typeof defaultValue) {
        return value as T;
      }
      log.warn(`型が一致しません: ${key}`, { expected: typeof defaultValue, actual: typeof value });
    }
    await store.set(key, defaultValue);
    await store.save();
    return defaultValue;
  } catch (error) {
    log.error(`設定の取得に失敗: ${key}`, error);
    return defaultValue;
  }
}; 