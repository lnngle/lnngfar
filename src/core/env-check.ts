import { ErrorCodes } from '../errors/error-codes';
import { PipelineError } from '../errors/stage-error';

export interface EnvCheckResult {
  ok: boolean;
  currentVersion: string;
  minimumMajor: number;
}

export function parseNodeMajor(version: string): number {
  const major = Number.parseInt(version.split('.')[0], 10);
  return Number.isNaN(major) ? 0 : major;
}

export function checkNodeVersion(version = process.versions.node, minimumMajor = 18): EnvCheckResult {
  const major = parseNodeMajor(version);

  if (major < minimumMajor) {
    throw new PipelineError({
      stage: 'environment',
      code: ErrorCodes.INVALID_NODE_VERSION,
      message: `Node.js 版本不满足要求，当前 ${version}，需要 >= ${minimumMajor} LTS`,
      suggestion: '请升级 Node.js 到 18 LTS 或更高版本后重试'
    });
  }

  return {
    ok: true,
    currentVersion: version,
    minimumMajor
  };
}
