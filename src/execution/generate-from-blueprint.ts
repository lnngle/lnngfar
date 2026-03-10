import fs from 'fs-extra';
import { BlueprintPackage, GeneratedArtifact } from '../core/contracts/blueprint-contract';
import { GeneratorFn } from './contracts/generation-plan';
import { ErrorCodes } from '../errors/error-codes';
import { PipelineError } from '../errors/stage-error';
import { detectPathConflicts } from './conflict-detector';
import { buildRenderPlan, loadRenderConfig, renderPlan } from './rendering';
import { withTransactionalOutput } from './transactional-writer';
import { writeArtifactsDeterministically } from './deterministic-writer';
import { resolveVariables } from './variables/variable-resolver';

const DEFAULT_RENDER_BATCH_SIZE = 200;
const DEFAULT_WRITE_CONCURRENCY = 8;
const AI_DIRECTORY_PREFIX = 'ai/';

function nowNs(): bigint {
  return process.hrtime.bigint();
}

function elapsedMs(start: bigint): number {
  return Number(nowNs() - start) / 1_000_000;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.floor(parsed);
}

function resolveRenderBatchSize(): number {
  return parsePositiveInt(process.env.LNNGFAR_RENDER_BATCH_SIZE, DEFAULT_RENDER_BATCH_SIZE);
}

function resolveWriteConcurrency(): number {
  return parsePositiveInt(process.env.LNNGFAR_WRITE_CONCURRENCY, DEFAULT_WRITE_CONCURRENCY);
}

function shouldTracePerf(): boolean {
  return process.env.LNNGFAR_TRACE_PERF === '1';
}

function logPerf(stage: string, durationMs: number): void {
  if (!shouldTracePerf()) {
    return;
  }

  console.log(`[perf] ${stage}: ${durationMs.toFixed(2)}ms`);
}

function getGenerator(moduleObject: any): GeneratorFn | null {
  if (typeof moduleObject.generate === 'function') {
    return moduleObject.generate as GeneratorFn;
  }

  if (typeof moduleObject.default === 'function') {
    return moduleObject.default as GeneratorFn;
  }

  if (moduleObject.default && typeof moduleObject.default.generate === 'function') {
    return moduleObject.default.generate as GeneratorFn;
  }

  return null;
}

export async function generateFromBlueprint(
  blueprintPackage: BlueprintPackage,
  outputDir = process.cwd(),
  projectName = `${blueprintPackage.manifest.name}-project`,
  aiSkills = true
): Promise<GeneratedArtifact[]> {
  const generatorEntryPath = blueprintPackage.generatorEntryPath;
  const totalStart = nowNs();

  try {
    const loadGeneratorStart = nowNs();
    if (!fs.existsSync(generatorEntryPath)) {
      throw new PipelineError({
        stage: 'generation',
        code: ErrorCodes.BLUEPRINT_GENERATOR_NOT_FOUND,
        message: `未找到可执行生成器: ${generatorEntryPath}`,
        suggestion: '请检查 generators 目录与导出函数定义'
      });
    }

    const moduleObject = require(generatorEntryPath);
    const generator = getGenerator(moduleObject);
    logPerf('load-generator', elapsedMs(loadGeneratorStart));

    if (!generator) {
      throw new PipelineError({
        stage: 'generation',
        code: ErrorCodes.BLUEPRINT_GENERATOR_NOT_FOUND,
        message: `未找到可执行生成器: ${generatorEntryPath}`,
        suggestion: '请检查 generators 目录与导出函数定义'
      });
    }

    const variables = resolveVariables({
      blueprintPackage,
      projectName,
      aiSkills
    });

    const generateRawStart = nowNs();
    const artifacts = await generator({
      outputDir,
      blueprintRootPath: blueprintPackage.rootPath,
      manifestName: blueprintPackage.manifest.name,
      projectName,
      aiSkills,
      variables
    });
    logPerf('generate-raw-artifacts', elapsedMs(generateRawStart));

    const rawArtifacts = artifacts ?? [];
    const filteredArtifacts = aiSkills
      ? rawArtifacts
      : rawArtifacts.filter((item) => !item.path.replace(/\\/g, '/').startsWith(AI_DIRECTORY_PREFIX));
    const pathNormalizeStart = nowNs();
    const normalizedPaths = filteredArtifacts.map((item) => item.path.replace(/\\/g, '/'));
    logPerf('normalize-paths', elapsedMs(pathNormalizeStart));

    const renderConfig = loadRenderConfig(blueprintPackage);
    const renderedArtifacts: GeneratedArtifact[] = [];

    const conflictCheckStart = nowNs();
    const conflicts = detectPathConflicts(outputDir, normalizedPaths);
    logPerf('check-conflicts', elapsedMs(conflictCheckStart));
    if (conflicts.length > 0) {
      throw new PipelineError({
        stage: 'generation',
        code: ErrorCodes.GENERATION_CONFLICT,
        message: `目标目录存在冲突文件: ${conflicts.join(', ')}`,
        suggestion: '请在空目录执行或先清理冲突文件后重试'
      });
    }

    const renderBatchSize = resolveRenderBatchSize();
    const writeConcurrency = resolveWriteConcurrency();
    const renderTotalStart = nowNs();
    let renderDurationMs = 0;
    let writeDurationMs = 0;

    await withTransactionalOutput(outputDir, async (stagingDir) => {
      for (let start = 0; start < filteredArtifacts.length; start += renderBatchSize) {
        const batch = filteredArtifacts.slice(start, start + renderBatchSize).map((item) => ({
          path: item.path.replace(/\\/g, '/'),
          content: item.content,
          contentEncoding: item.contentEncoding ?? 'utf-8'
        }));

        const renderStart = nowNs();
        const plan = buildRenderPlan(batch, variables, renderConfig);
        const renderedBatch = plan.artifacts.length > 0 ? renderPlan(plan) : [];
        renderDurationMs += elapsedMs(renderStart);

        renderedArtifacts.push(...renderedBatch);

        const writeStart = nowNs();
        await writeArtifactsDeterministically(stagingDir, renderedBatch, {
          sort: false,
          concurrency: writeConcurrency
        });
        writeDurationMs += elapsedMs(writeStart);
      }
    });

    logPerf('render-total', elapsedMs(renderTotalStart));
    logPerf('render-batches', renderDurationMs);
    logPerf('write-batches', writeDurationMs);
    logPerf('generation-total', elapsedMs(totalStart));
    return renderedArtifacts;
  } catch (error) {
    if (error instanceof PipelineError) {
      throw error;
    }

    throw new PipelineError({
      stage: 'generation',
      code: ErrorCodes.GENERATION_FAILED,
      message: `生成执行失败: ${(error as Error).message}`,
      suggestion: '请检查 blueprint 生成器实现与模板文件'
    });
  }
}
