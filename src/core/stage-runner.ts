import { PipelineError, StageError } from '../errors/stage-error';
import { ErrorCodes } from '../errors/error-codes';

export async function runStage<T>(errorDetail: Omit<StageError, 'message'>, action: () => Promise<T> | T): Promise<T> {
  try {
    return await action();
  } catch (error) {
    if (error instanceof PipelineError) {
      throw error;
    }

    throw new PipelineError({
      stage: errorDetail.stage,
      code: errorDetail.code ?? ErrorCodes.UNKNOWN_ERROR,
      message: (error as Error).message,
      suggestion: errorDetail.suggestion
    });
  }
}
