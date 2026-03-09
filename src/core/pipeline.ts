import fs from 'fs-extra';
import path from 'node:path';
import { BlueprintPackage, PipelineResult } from './contracts/blueprint-contract';
import { checkNodeVersion } from './env-check';
import { resolveBlueprintByName, resolveBlueprints } from '../discovery/local-blueprint-resolver';
import { validateBlueprint } from '../validation';
import { generateFromBlueprint } from '../execution/generate-from-blueprint';
import { runBlueprintTests } from '../execution/blueprint-test-runner';
import { ErrorCodes } from '../errors/error-codes';
import { PipelineError } from '../errors/stage-error';

interface PipelineOptions {
  blueprintName: string;
  cwd?: string;
  repoRoot?: string;
}

function findRepoRoot(startDir: string, fallbackDir?: string): string {
  let current = path.resolve(startDir);
  while (true) {
    if (fs.existsSync(path.join(current, 'package.json'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  if (fallbackDir) {
    const normalizedFallback = path.resolve(fallbackDir);
    if (fs.existsSync(path.join(normalizedFallback, 'package.json'))) {
      return normalizedFallback;
    }
  }

  return startDir;
}

function ensureBlueprintAvailable(name: string, cwd: string): BlueprintPackage {
  const discovered = resolveBlueprintByName(name, cwd);

  if (!discovered) {
    const available = resolveBlueprints(cwd).map((item) => item.blueprintName).join(', ') || '无';
    throw new PipelineError({
      stage: 'blueprint',
      code: ErrorCodes.BLUEPRINT_NOT_FOUND,
      message: `未发现 Blueprint: ${name}`,
      suggestion: `可用 Blueprint: ${available}`
    });
  }

  const validation = validateBlueprint(discovered.rootPath);
  if (!validation.valid || !validation.blueprintPackage) {
    throw new PipelineError({
      stage: 'blueprint',
      code: ErrorCodes.BLUEPRINT_STRUCTURE_INVALID,
      message: validation.errors.join('; '),
      suggestion: '请检查 blueprint.json 与 blueprint 目录结构'
    });
  }

  return validation.blueprintPackage;
}

export async function executePipeline(options: PipelineOptions): Promise<PipelineResult> {
  const cwd = options.cwd ?? process.cwd();
  const repoRoot = options.repoRoot ?? findRepoRoot(cwd, path.resolve(__dirname, '../..'));

  checkNodeVersion();
  const blueprintPackage = ensureBlueprintAvailable(options.blueprintName, repoRoot);
  const artifacts = await generateFromBlueprint(blueprintPackage, cwd);

  const testResult = runBlueprintTests(blueprintPackage.testsPath, repoRoot);
  if (!testResult.ok) {
    throw new PipelineError({
      stage: 'testing',
      code: ErrorCodes.BLUEPRINT_TEST_FAILED,
      message: testResult.output || 'Blueprint 测试失败',
      suggestion: '请修复 Blueprint 测试后重试'
    });
  }

  return {
    blueprintName: options.blueprintName,
    outputDir: cwd,
    artifacts
  };
}
