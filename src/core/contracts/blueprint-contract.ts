export interface BlueprintManifest {
  name: string;
  packageName: string;
  version: string;
  description: string;
  target: string;
  language: string;
  engine: string;
  testFramework: string;
  generatorEntry?: string;
  renderConfigEntry?: string;
}

export interface BlueprintPackage {
  manifest: BlueprintManifest;
  rootPath: string;
  templatesPath: string;
  generatorsPath: string;
  testsPath: string;
  readmePath: string;
  generatorEntryPath: string;
  status: 'discovered' | 'validated' | 'rejected';
}

export interface GeneratedArtifact {
  path: string;
  content: string;
  contentEncoding?: 'utf-8' | 'base64';
}

export interface PipelineResult {
  blueprintName: string;
  outputDir: string;
  artifacts: GeneratedArtifact[];
}
