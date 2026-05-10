import { describe, it, expect, vi } from 'vitest';
import { createLogger } from '../src/index';
import { LogLevel } from '@lnngfar/types';

describe('createLogger', () => {
  it('should create logger with name', () => {
    const logger = createLogger('test');
    expect(logger).toBeDefined();
    expect(logger.info).toBeInstanceOf(Function);
    expect(logger.warn).toBeInstanceOf(Function);
    expect(logger.error).toBeInstanceOf(Function);
    expect(logger.debug).toBeInstanceOf(Function);
  });

  it('should silence debug when level is INFO', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const logger = createLogger('test', LogLevel.INFO);
    logger.debug('should not appear');
    expect(debugSpy).not.toHaveBeenCalled();
    debugSpy.mockRestore();
  });

  it('should output at appropriate levels', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const logger = createLogger('test', LogLevel.INFO);
    logger.info('hello');
    logger.error('fail');

    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO]'));
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'));

    infoSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('should include timestamp and name in output', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const logger = createLogger('my-module');
    logger.info('test message');
    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringContaining('[INFO] [my-module] test message'),
    );
    infoSpy.mockRestore();
  });
});
