// @lnngfar/logger - 统一日志模块

import type { Logger, LogLevel } from '@lnngfar/types';
import { inspect } from 'node:util';

export function createLogger(name: string, level: LogLevel = LogLevel.INFO): Logger {
  const shouldLog = (msgLevel: LogLevel): boolean => msgLevel >= level;

  const formatMessage = (msgLevel: string, message: string, args: unknown[]): string => {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${msgLevel}] [${name}]`;
    const extra = args.length > 0 ? ' ' + args.map((a) => inspect(a, { depth: 3 })).join(' ') : '';
    return `${prefix} ${message}${extra}`;
  };

  return {
    debug(message: string, ...args: unknown[]): void {
      if (shouldLog(LogLevel.DEBUG)) {
        console.debug(formatMessage('DEBUG', message, args));
      }
    },
    info(message: string, ...args: unknown[]): void {
      if (shouldLog(LogLevel.INFO)) {
        console.info(formatMessage('INFO', message, args));
      }
    },
    warn(message: string, ...args: unknown[]): void {
      if (shouldLog(LogLevel.WARN)) {
        console.warn(formatMessage('WARN', message, args));
      }
    },
    error(message: string, ...args: unknown[]): void {
      if (shouldLog(LogLevel.ERROR)) {
        console.error(formatMessage('ERROR', message, args));
      }
    },
  };
}
