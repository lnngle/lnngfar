export type PipelineStage = 'env' | 'discover' | 'validate' | 'generate' | 'test' | 'done' | 'failed';

export type FailureStage = 'environment' | 'blueprint' | 'generation' | 'testing';

export interface StageError {
  stage: FailureStage;
  code: string;
  message: string;
  suggestion?: string;
}

export class PipelineError extends Error {
  public readonly detail: StageError;

  constructor(detail: StageError) {
    super(detail.message);
    this.name = 'PipelineError';
    this.detail = detail;
  }
}
