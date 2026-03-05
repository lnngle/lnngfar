import { StageError } from '../errors/stage-error';
import { writeStageError } from '../errors/error-presenter';

export function printStage(name: string): void {
  process.stdout.write(`[阶段] ${name}\n`);
}

export function printSuccess(message: string): void {
  process.stdout.write(`${message}\n`);
}

export function printFailure(error: StageError): void {
  writeStageError(error);
}
