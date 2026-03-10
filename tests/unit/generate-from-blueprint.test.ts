import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { PipelineError } from '../../src/errors/stage-error';
import { ErrorCodes } from '../../src/errors/error-codes';

jest.mock('../../src/execution/conflict-detector', () => ({
  detectPathConflicts: jest.fn()
}));

jest.mock('../../src/execution/rendering', () => ({
  loadRenderConfig: jest.fn(),
  buildRenderPlan: jest.fn(),
  renderPlan: jest.fn()
}));

jest.mock('../../src/execution/transactional-writer', () => ({
  withTransactionalOutput: jest.fn()
}));

jest.mock('../../src/execution/deterministic-writer', () => ({
  writeArtifactsDeterministically: jest.fn()
}));

jest.mock('../../src/execution/variables/variable-resolver', () => ({
  resolveVariables: jest.fn()
}));

import { generateFromBlueprint } from '../../src/execution/generate-from-blueprint';
import { detectPathConflicts } from '../../src/execution/conflict-detector';
import { buildRenderPlan, loadRenderConfig, renderPlan } from '../../src/execution/rendering';
import { withTransactionalOutput } from '../../src/execution/transactional-writer';
import { writeArtifactsDeterministically } from '../../src/execution/deterministic-writer';
import { resolveVariables } from '../../src/execution/variables/variable-resolver';

describe('generate-from-blueprint', () => {
  const mockDetectPathConflicts = detectPathConflicts as unknown as jest.Mock;
  const mockLoadRenderConfig = loadRenderConfig as unknown as jest.Mock;
  const mockBuildRenderPlan = buildRenderPlan as unknown as jest.Mock;
  const mockRenderPlan = renderPlan as unknown as jest.Mock;
  const mockWithTransactionalOutput = withTransactionalOutput as unknown as jest.Mock;
  const mockWriteArtifactsDeterministically = writeArtifactsDeterministically as unknown as jest.Mock;
  const mockResolveVariables = resolveVariables as unknown as jest.Mock;

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lnngfar-gen-test-'));

  const blueprintPackage = {
    manifest: {
      name: 'cocos',
      packageName: 'lnngfar-blueprint-cocos',
      version: '1.0.0',
      description: 'desc',
      target: 'target',
      language: 'ts',
      engine: 'oops',
      testFramework: 'jest'
    },
    rootPath: tempRoot,
    templatesPath: path.join(tempRoot, 'templates'),
    generatorsPath: path.join(tempRoot, 'generators'),
    testsPath: path.join(tempRoot, 'tests'),
    readmePath: path.join(tempRoot, 'README.md'),
    generatorEntryPath: '',
    status: 'validated' as const
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDetectPathConflicts.mockReturnValue([]);
    mockLoadRenderConfig.mockReturnValue({ templatePatterns: ['**/*'], passthroughPatterns: [] });
    mockResolveVariables.mockReturnValue({ PROJECT_NAME: 'demo-project' });
    mockBuildRenderPlan.mockImplementation((batch) => ({ artifacts: batch, variables: { PROJECT_NAME: 'demo-project' } }));
    mockRenderPlan.mockImplementation((plan) => plan.artifacts);
    mockWriteArtifactsDeterministically.mockResolvedValue(undefined);
    mockWithTransactionalOutput.mockImplementation(async (outputDir: string, writer: (stagingDir: string) => Promise<void>) => {
      const stagingDir = path.join(outputDir, '__staging__');
      await fs.ensureDir(stagingDir);
      await writer(stagingDir);
    });

    delete process.env.LNNGFAR_RENDER_BATCH_SIZE;
    delete process.env.LNNGFAR_WRITE_CONCURRENCY;
    delete process.env.LNNGFAR_TRACE_PERF;
  });

  function writeGeneratorFile(fileName: string, content: string): string {
    const filePath = path.join(tempRoot, fileName);
    fs.writeFileSync(filePath, content, 'utf-8');
    delete require.cache[require.resolve(filePath)];
    return filePath;
  }

  test('生成器文件不存在时抛出生成器缺失错误', async () => {
    const pkg = { ...blueprintPackage, generatorEntryPath: path.join(tempRoot, 'missing-generator.js') };

    await expect(generateFromBlueprint(pkg, path.join(tempRoot, 'out'))).rejects.toMatchObject({
      detail: expect.objectContaining({ code: ErrorCodes.BLUEPRINT_GENERATOR_NOT_FOUND })
    });
  });

  test('支持 default 导出函数并完成渲染写入', async () => {
    const entry = writeGeneratorFile(
      'generator-default-fn.js',
      'module.exports = { default: async () => ([{ path: "a.txt", content: "A", contentEncoding: "utf-8" }]) };'
    );

    const pkg = { ...blueprintPackage, generatorEntryPath: entry };
    const outputDir = path.join(tempRoot, 'out-default-fn');
    const artifacts = await generateFromBlueprint(pkg, outputDir, 'demo-project');

    expect(artifacts).toEqual([{ path: 'a.txt', content: 'A', contentEncoding: 'utf-8' }]);
    expect(mockBuildRenderPlan).toHaveBeenCalled();
    expect(mockWriteArtifactsDeterministically).toHaveBeenCalled();
  });

  test('支持 default.generate 导出函数并处理空产物', async () => {
    const entry = writeGeneratorFile('generator-default-generate.js', 'module.exports = { default: { generate: async () => undefined } };');
    const pkg = { ...blueprintPackage, generatorEntryPath: entry };

    const artifacts = await generateFromBlueprint(pkg, path.join(tempRoot, 'out-default-generate'));
    expect(artifacts).toEqual([]);
  });

  test('未导出可执行生成器时抛出生成器缺失错误', async () => {
    const entry = writeGeneratorFile('generator-invalid.js', 'module.exports = { value: 1 };');
    const pkg = { ...blueprintPackage, generatorEntryPath: entry };

    await expect(generateFromBlueprint(pkg, path.join(tempRoot, 'out-invalid'))).rejects.toMatchObject({
      detail: expect.objectContaining({ code: ErrorCodes.BLUEPRINT_GENERATOR_NOT_FOUND })
    });
  });

  test('检测到路径冲突时抛出冲突错误', async () => {
    const entry = writeGeneratorFile('generator-conflict.js', 'module.exports = { generate: async () => ([{ path: "dup.txt", content: "x", contentEncoding: "utf-8" }]) };');
    mockDetectPathConflicts.mockReturnValue(['dup.txt']);

    const pkg = { ...blueprintPackage, generatorEntryPath: entry };
    await expect(generateFromBlueprint(pkg, path.join(tempRoot, 'out-conflict'))).rejects.toMatchObject({
      detail: expect.objectContaining({ code: ErrorCodes.GENERATION_CONFLICT })
    });
  });

  test('生成器抛出普通错误时转为 GENERATION_FAILED', async () => {
    const entry = writeGeneratorFile('generator-throw.js', 'module.exports = { generate: async () => { throw new Error("boom"); } };');
    const pkg = { ...blueprintPackage, generatorEntryPath: entry };

    await expect(generateFromBlueprint(pkg, path.join(tempRoot, 'out-throw'))).rejects.toMatchObject({
      detail: expect.objectContaining({ code: ErrorCodes.GENERATION_FAILED })
    });
  });

  test('开启性能日志并使用非法并发配置时回退默认值', async () => {
    const entry = writeGeneratorFile('generator-perf.js', 'module.exports = { generate: async () => ([{ path: "x.txt", content: "x", contentEncoding: "utf-8" }]) };');
    const pkg = { ...blueprintPackage, generatorEntryPath: entry };

    process.env.LNNGFAR_TRACE_PERF = '1';
    process.env.LNNGFAR_RENDER_BATCH_SIZE = '0';
    process.env.LNNGFAR_WRITE_CONCURRENCY = 'NaN';

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    try {
      await generateFromBlueprint(pkg, path.join(tempRoot, 'out-perf'));
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[perf]'));
      expect(mockWriteArtifactsDeterministically).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        expect.objectContaining({ concurrency: 8, sort: false })
      );
    } finally {
      logSpy.mockRestore();
    }
  });

  test('并发与批大小为小数时向下取整', async () => {
    const entry = writeGeneratorFile(
      'generator-float-env.js',
      'module.exports = { generate: async () => ([{ path: "1.txt", content: "1", contentEncoding: "utf-8" }, { path: "2.txt", content: "2", contentEncoding: "utf-8" }, { path: "3.txt", content: "3", contentEncoding: "utf-8" }]) };'
    );
    const pkg = { ...blueprintPackage, generatorEntryPath: entry };

    process.env.LNNGFAR_RENDER_BATCH_SIZE = '2.9';
    process.env.LNNGFAR_WRITE_CONCURRENCY = '4.8';

    await generateFromBlueprint(pkg, path.join(tempRoot, 'out-float'));

    expect(mockBuildRenderPlan).toHaveBeenCalledTimes(2);
    expect(mockWriteArtifactsDeterministically).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Array),
      expect.objectContaining({ concurrency: 4, sort: false })
    );
  });

  test('未传 outputDir 时使用 process.cwd 默认值', async () => {
    const entry = writeGeneratorFile('generator-default-output.js', 'module.exports = { generate: async () => ([{ path: "a.txt", content: "A" }]) };');
    const pkg = { ...blueprintPackage, generatorEntryPath: entry };
    const cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(path.join(tempRoot, 'mock-cwd'));

    try {
      await generateFromBlueprint(pkg);
      expect(mockWithTransactionalOutput).toHaveBeenCalledWith(path.join(tempRoot, 'mock-cwd'), expect.any(Function));
    } finally {
      cwdSpy.mockRestore();
    }
  });

  test('artifact 未声明 contentEncoding 时回退为 utf-8', async () => {
    const entry = writeGeneratorFile(
      'generator-no-encoding.js',
      'module.exports = { generate: async () => ([{ path: "x.txt", content: "x" }]) };'
    );
    const pkg = { ...blueprintPackage, generatorEntryPath: entry };

    await generateFromBlueprint(pkg, path.join(tempRoot, 'out-no-encoding'));
    const firstBatch = mockBuildRenderPlan.mock.calls[0][0] as Array<{ contentEncoding: string }>;
    expect(firstBatch[0].contentEncoding).toBe('utf-8');
  });

  test('render plan 为空时不调用 renderPlan，直接写入空批次', async () => {
    const entry = writeGeneratorFile(
      'generator-empty-render-plan.js',
      'module.exports = { generate: async () => ([{ path: "x.txt", content: "x", contentEncoding: "utf-8" }]) };'
    );
    const pkg = { ...blueprintPackage, generatorEntryPath: entry };

    mockBuildRenderPlan.mockReturnValue({ artifacts: [], variables: { PROJECT_NAME: 'demo-project' } });

    await generateFromBlueprint(pkg, path.join(tempRoot, 'out-empty-plan'));

    expect(mockRenderPlan).not.toHaveBeenCalled();
    expect(mockWriteArtifactsDeterministically).toHaveBeenCalledWith(
      expect.any(String),
      [],
      expect.objectContaining({ sort: false })
    );
  });

  test('aiSkills=false 时由核心过滤 ai 目录产物', async () => {
    const entry = writeGeneratorFile(
      'generator-ai-filter.js',
      'module.exports = { generate: async () => ([{ path: "ai/README.md", content: "x", contentEncoding: "utf-8" }, { path: "assets/keep.txt", content: "ok", contentEncoding: "utf-8" }]) };'
    );
    const pkg = { ...blueprintPackage, generatorEntryPath: entry };

    await generateFromBlueprint(pkg, path.join(tempRoot, 'out-ai-filter'), 'demo-project', false);

    const conflictPaths = mockDetectPathConflicts.mock.calls[0][1] as string[];
    expect(conflictPaths).toEqual(['assets/keep.txt']);

    const firstBatch = mockBuildRenderPlan.mock.calls[0][0] as Array<{ path: string }>;
    expect(firstBatch).toHaveLength(1);
    expect(firstBatch[0].path).toBe('assets/keep.txt');
  });

  test('withTransactionalOutput 抛出 PipelineError 时透传', async () => {
    const entry = writeGeneratorFile('generator-txn-error.js', 'module.exports = { generate: async () => ([{ path: "x.txt", content: "x", contentEncoding: "utf-8" }]) };');
    const pkg = { ...blueprintPackage, generatorEntryPath: entry };
    const err = new PipelineError({
      stage: 'generation',
      code: ErrorCodes.GENERATION_FAILED,
      message: 'tx failed'
    });

    mockWithTransactionalOutput.mockImplementation(async () => {
      throw err;
    });

    await expect(generateFromBlueprint(pkg, path.join(tempRoot, 'out-txn'))).rejects.toBe(err);
  });
});
