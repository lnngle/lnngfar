export type RenderMode = 'template' | 'passthrough' | 'json-patch';

export interface JsonPatchRule {
  path: string;
  variable: string;
}

export interface PlannedArtifact {
  path: string;
  content: string;
  contentEncoding: 'utf-8' | 'base64';
  renderMode: RenderMode;
  jsonPatchRules?: JsonPatchRule[];
}

export interface VariableContext {
  [key: string]: string;
}

export interface RenderPlan {
  artifacts: PlannedArtifact[];
  variables: VariableContext;
}

export interface RenderConfig {
  templatePatterns?: string[];
  passthroughPatterns?: string[];
  jsonPatch?: Record<string, JsonPatchRule[]>;
}

export interface RawGeneratedArtifact {
  path: string;
  content: string;
  contentEncoding?: 'utf-8' | 'base64';
}

export interface GeneratorContext {
  outputDir: string;
  blueprintRootPath: string;
  manifestName: string;
  projectName: string;
  aiSkills?: boolean;
  variables: VariableContext;
}

export type GeneratorFn = (ctx: GeneratorContext) => Promise<RawGeneratedArtifact[]> | RawGeneratedArtifact[];
