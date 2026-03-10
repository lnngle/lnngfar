jest.mock('node:readline/promises', () => ({
  createInterface: jest.fn()
}));

import { createInterface } from 'node:readline/promises';
import { resolveProjectName } from '../../src/cli/project-name';

describe('resolveProjectName', () => {
  const mockCreateInterface = createInterface as unknown as jest.Mock;
  const originalStdinTTY = process.stdin.isTTY;
  const originalStdoutTTY = process.stdout.isTTY;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(process.stdin, 'isTTY', { value: true, configurable: true });
    Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true });
  });

  afterAll(() => {
    Object.defineProperty(process.stdin, 'isTTY', { value: originalStdinTTY, configurable: true });
    Object.defineProperty(process.stdout, 'isTTY', { value: originalStdoutTTY, configurable: true });
  });

  test('非 TTY 时返回默认项目名', async () => {
    Object.defineProperty(process.stdin, 'isTTY', { value: false, configurable: true });
    const name = await resolveProjectName('cocos');
    expect(name).toBe('cocos-project');
    expect(mockCreateInterface).not.toHaveBeenCalled();
  });

  test('输入空字符串时回退默认值', async () => {
    const close = jest.fn();
    const question = jest.fn().mockResolvedValue('   ');
    mockCreateInterface.mockReturnValue({ question, close });

    const name = await resolveProjectName('cocos');
    expect(name).toBe('cocos-project');
    expect(close).toHaveBeenCalled();
  });

  test('输入合法项目名时返回用户输入', async () => {
    const close = jest.fn();
    const question = jest.fn().mockResolvedValue('demo_01');
    mockCreateInterface.mockReturnValue({ question, close });

    const name = await resolveProjectName('cocos');
    expect(name).toBe('demo_01');
  });

  test('连续非法输入后回退默认值', async () => {
    const close = jest.fn();
    const question = jest
      .fn()
      .mockResolvedValueOnce('bad name')
      .mockResolvedValueOnce('bad/name')
      .mockResolvedValueOnce('bad name again');
    mockCreateInterface.mockReturnValue({ question, close });

    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

    try {
      const name = await resolveProjectName('cocos');
      expect(name).toBe('cocos-project');
      expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid project name'));
      expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('Fallback to default project name'));
    } finally {
      writeSpy.mockRestore();
    }
  });

  test('非法后合法输入时返回合法值并提示一次错误', async () => {
    const close = jest.fn();
    const question = jest.fn().mockResolvedValueOnce('bad name').mockResolvedValueOnce('ok_name');
    mockCreateInterface.mockReturnValue({ question, close });

    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

    try {
      const name = await resolveProjectName('cocos');
      expect(name).toBe('ok_name');
      expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid project name'));
    } finally {
      writeSpy.mockRestore();
    }
  });
});
