export interface GeneratorContext {
  outputDir: string;
  blueprintRootPath: string;
  manifestName: string;
}

export interface GeneratedArtifact {
  path: string;
  content: string;
  contentEncoding?: 'utf-8' | 'base64';
}

export async function generate(_: GeneratorContext): Promise<GeneratedArtifact[]> {
  return [];
}
