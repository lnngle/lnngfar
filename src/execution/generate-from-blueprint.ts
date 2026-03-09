import fs from 'fs-extra';
import { BlueprintPackage, GeneratedArtifact } from '../core/contracts/blueprint-contract';
import { ErrorCodes } from '../errors/error-codes';
import { PipelineError } from '../errors/stage-error';
import { detectPathConflicts } from './conflict-detector';
import { writeArtifactsDeterministically } from './deterministic-writer';

interface GenerateContext {
  outputDir: string;
  blueprintRootPath: string;
  manifestName: string;
}

type GeneratorFn = (ctx: GenerateContext) => Promise<GeneratedArtifact[]> | GeneratedArtifact[];

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

export async function generateFromBlueprint(blueprintPackage: BlueprintPackage, outputDir = process.cwd()): Promise<GeneratedArtifact[]> {
  const generatorEntryPath = blueprintPackage.generatorEntryPath;

  try {
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

    if (!generator) {
      throw new PipelineError({
        stage: 'generation',
        code: ErrorCodes.BLUEPRINT_GENERATOR_NOT_FOUND,
        message: `未找到可执行生成器: ${generatorEntryPath}`,
        suggestion: '请检查 generators 目录与导出函数定义'
      });
    }

    const artifacts = await generator({
      outputDir,
      blueprintRootPath: blueprintPackage.rootPath,
      manifestName: blueprintPackage.manifest.name
    });

    const normalizedArtifacts = (artifacts ?? []).map((item) => ({
      path: item.path.replace(/\\\\/g, '/'),
      content: item.content,
      contentEncoding: item.contentEncoding ?? 'utf-8'
    }));

    const conflicts = detectPathConflicts(outputDir, normalizedArtifacts.map((item) => item.path));
    if (conflicts.length > 0) {
      throw new PipelineError({
        stage: 'generation',
        code: ErrorCodes.GENERATION_CONFLICT,
        message: `目标目录存在冲突文件: ${conflicts.join(', ')}`,
        suggestion: '请在空目录执行或先清理冲突文件后重试'
      });
    }

    await writeArtifactsDeterministically(outputDir, normalizedArtifacts);
    return normalizedArtifacts;
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
