import { debug, error, info, trace, warn, attachConsole } from '@tauri-apps/plugin-log';

let detach: (() => void) | undefined;

export const initializeLogger = async () => {
  try {
    detach = await attachConsole();
    log.info('Logger initialized successfully');
  } catch (err) {
    console.error('Failed to initialize logger:', err);
  }
};

export const cleanupLogger = () => {
  if (detach) {
    detach();
    detach = undefined;
  }
};

export const log = {
  error: (message: string, ...args: any[]) => {
    console.error(message, ...args);
    error(message + (args.length ? ` ${JSON.stringify(args)}` : ''));
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(message, ...args);
    warn(message + (args.length ? ` ${JSON.stringify(args)}` : ''));
  },
  info: (message: string, ...args: any[]) => {
    console.info(message, ...args);
    info(message + (args.length ? ` ${JSON.stringify(args)}` : ''));
  },
  debug: (message: string, ...args: any[]) => {
    console.debug(message, ...args);
    debug(message + (args.length ? ` ${JSON.stringify(args)}` : ''));
  },
  trace: (message: string, ...args: any[]) => {
    console.trace(message, ...args);
    trace(message + (args.length ? ` ${JSON.stringify(args)}` : ''));
  },
}; 
