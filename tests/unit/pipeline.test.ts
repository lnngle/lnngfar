import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { ErrorCodes } from '../../src/errors/error-codes';
import { PipelineError } from '../../src/errors/stage-error';

jest.mock('../../src/core/env-check', () => ({
  checkNodeVersion: jest.fn()
}));

jest.mock('../../src/discovery/local-blueprint-resolver', () => ({
  resolveBlueprintByName: jest.fn(),
  resolveBlueprints: jest.fn()
}));

jest.mock('../../src/validation', () => ({
  validateBlueprint: jest.fn()
}));

jest.mock('../../src/execution/generate-from-blueprint', () => ({
  generateFromBlueprint: jest.fn()
}));

jest.mock('../../src/execution/blueprint-test-runner', () => ({
  runBlueprintTests: jest.fn()
}));

import { executePipeline } from '../../src/core/pipeline';
import { checkNodeVersion } from '../../src/core/env-check';
import { resolveBlueprintByName, resolveBlueprints } from '../../src/discovery/local-blueprint-resolver';
import { validateBlueprint } from '../../src/validation';
import { generateFromBlueprint } from '../../src/execution/generate-from-blueprint';
import { runBlueprintTests } from '../../src/execution/blueprint-test-runner';

describe('pipeline', () => {
  const mockCheckNodeVersion = checkNodeVersion as unknown as jest.Mock;
  const mockResolveBlueprintByName = resolveBlueprintByName as unknown as jest.Mock;
  const mockResolveBlueprints = resolveBlueprints as unknown as jest.Mock;
  const mockValidateBlueprint = validateBlueprint as unknown as jest.Mock;
  const mockGenerateFromBlueprint = generateFromBlueprint as unknown as jest.Mock;
  const mockRunBlueprintTests = runBlueprintTests as unknown as jest.Mock;

  const blueprintPackage = {
    manifest: {
      name: 'cocos',
      packageName: 'lnngfar-blueprint-cocos',
      version: '1.0.0',
      description: 'demo',
      target: 'demo',
      language: 'ts',
      engine: 'oops',
      testFramework: 'jest'
    },
    rootPath: '/mock/blueprint',
    templatesPath: '/mock/blueprint/templates',
    generatorsPath: '/mock/blueprint/generators',
    testsPath: '/mock/blueprint/tests',
    readmePath: '/mock/blueprint/README.md',
    generatorEntryPath: '/mock/blueprint/generators/index.js',
    status: 'validated' as const
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckNodeVersion.mockReturnValue({ ok: true });
    mockResolveBlueprintByName.mockReturnValue({
      packageName: 'lnngfar-blueprint-cocos',
      blueprintName: 'cocos',
      rootPath: '/mock/blueprint'
    });
    mockResolveBlueprints.mockReturnValue([{ blueprintName: 'cocos' }]);
    mockValidateBlueprint.mockReturnValue({ valid: true, errors: [], blueprintPackage });
    mockGenerateFromBlueprint.mockResolvedValue([{ path: 'README.md', content: 'x', contentEncoding: 'utf-8' }]);
    mockRunBlueprintTests.mockReturnValue({ ok: true, exitCode: 0, output: 'ok' });
  });

  test('成功执行并使用 trim 后项目名', async () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'lnngfar-pipeline-'));
    const result = await executePipeline({
      blueprintName: 'cocos',
      projectName: '  custom-name  ',
      cwd,
      repoRoot: cwd
    });

    expect(result.outputDir).toBe(path.join(cwd, 'custom-name'));
    expect(mockGenerateFromBlueprint).toHaveBeenCalledWith(blueprintPackage, path.join(cwd, 'custom-name'), 'custom-name');
  });

  test('未找到 blueprint 时抛出 blueprint not found', async () => {
    mockResolveBlueprintByName.mockReturnValue(null);
    mockResolveBlueprints.mockReturnValue([]);

    await expect(executePipeline({ blueprintName: 'missing', cwd: process.cwd(), repoRoot: process.cwd() })).rejects.toMatchObject({
      detail: expect.objectContaining({ code: ErrorCodes.BLUEPRINT_NOT_FOUND })
    });
  });

  test('blueprint 结构无效时抛出结构错误', async () => {
    mockValidateBlueprint.mockReturnValue({ valid: false, errors: ['broken'] });

    await expect(executePipeline({ blueprintName: 'cocos', cwd: process.cwd(), repoRoot: process.cwd() })).rejects.toMatchObject({
      detail: expect.objectContaining({ code: ErrorCodes.BLUEPRINT_STRUCTURE_INVALID })
    });
  });

  test('blueprint 测试失败时抛 testing 错误并回退默认信息', async () => {
    mockRunBlueprintTests.mockReturnValue({ ok: false, exitCode: 1, output: '' });

    await expect(executePipeline({ blueprintName: 'cocos', cwd: process.cwd(), repoRoot: process.cwd() })).rejects.toMatchObject({
      detail: expect.objectContaining({
        code: ErrorCodes.BLUEPRINT_TEST_FAILED,
        message: 'Blueprint 测试失败'
      })
    });
  });

  test('repoRoot 未传入时可从 fallback 目录解析', async () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'lnngfar-pipeline-fallback-'));
    const fallbackRoot = path.resolve(__dirname, '../..');
    const fallbackPkgPath = path.join(fallbackRoot, 'package.json');
    const spy = jest.spyOn(fs, 'existsSync').mockImplementation((targetPath: fs.PathLike) => {
      return String(targetPath) === fallbackPkgPath;
    });

    try {
      await executePipeline({ blueprintName: 'cocos', cwd });
    } finally {
      spy.mockRestore();
    }

    const calledRepoRoot = mockResolveBlueprintByName.mock.calls[0][1] as string;
    expect(calledRepoRoot).toBe(fallbackRoot);
  });

  test('cwd 命中 package.json 时直接作为 repoRoot', async () => {
    const cwd = process.cwd();
    await executePipeline({ blueprintName: 'cocos', cwd });

    const calledRepoRoot = mockResolveBlueprintByName.mock.calls[0][1] as string;
    expect(calledRepoRoot).toBe(cwd);
  });

  test('fallback 也不存在 package.json 时回退为 startDir', async () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'lnngfar-pipeline-start-'));
    const spy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    try {
      await executePipeline({ blueprintName: 'cocos', cwd });
      const calledRepoRoot = mockResolveBlueprintByName.mock.calls[0][1] as string;
      expect(calledRepoRoot).toBe(cwd);
    } finally {
      spy.mockRestore();
    }
  });

  test('未传 cwd 时使用 process.cwd()', async () => {
    const cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue('D:/mock-cwd');

    try {
      await executePipeline({ blueprintName: 'cocos', repoRoot: process.cwd() });
      expect(mockGenerateFromBlueprint).toHaveBeenCalledWith(
        blueprintPackage,
        path.join('D:/mock-cwd', 'cocos-project'),
        'cocos-project'
      );
    } finally {
      cwdSpy.mockRestore();
    }
  });

  test('checkNodeVersion 抛出 PipelineError 时直接透传', async () => {
    const err = new PipelineError({
      stage: 'environment',
      code: ErrorCodes.INVALID_NODE_VERSION,
      message: 'bad node'
    });
    mockCheckNodeVersion.mockImplementation(() => {
      throw err;
    });

    await expect(executePipeline({ blueprintName: 'cocos', cwd: process.cwd(), repoRoot: process.cwd() })).rejects.toBe(err);
  });
});
