import { StageError } from './stage-error';

export function formatStageError(error: StageError): string {
  const parts = [
    `阶段: ${error.stage}`,
    `错误码: ${error.code}`,
    `信息: ${error.message}`
  ];

  if (error.suggestion) {
    parts.push(`建议: ${error.suggestion}`);
  }

  return parts.join('\n');
}

export function writeStageError(error: StageError): void {
  process.stderr.write(`${formatStageError(error)}\n`);
}
