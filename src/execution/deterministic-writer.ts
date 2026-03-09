import fs from 'fs-extra';
import path from 'node:path';
import { GeneratedArtifact } from '../core/contracts/blueprint-contract';

interface WriteOptions {
  concurrency?: number;
  sort?: boolean;
}

const DEFAULT_CONCURRENCY = 8;

async function writeArtifact(outputDir: string, artifact: GeneratedArtifact): Promise<void> {
  const targetPath = path.join(outputDir, artifact.path);
  await fs.ensureDir(path.dirname(targetPath));
  if (artifact.contentEncoding === 'base64') {
    await fs.writeFile(targetPath, Buffer.from(artifact.content, 'base64'));
    return;
  }

  await fs.writeFile(targetPath, artifact.content, 'utf-8');
}

export async function writeArtifactsDeterministically(
  outputDir: string,
  artifacts: GeneratedArtifact[],
  options: WriteOptions = {}
): Promise<void> {
  const { concurrency = DEFAULT_CONCURRENCY, sort = true } = options;
  const normalizedConcurrency = Math.max(1, Math.floor(concurrency));
  const ordered = sort ? [...artifacts].sort((a, b) => a.path.localeCompare(b.path)) : [...artifacts];

  for (let i = 0; i < ordered.length; i += normalizedConcurrency) {
    const chunk = ordered.slice(i, i + normalizedConcurrency);
    await Promise.all(chunk.map((artifact) => writeArtifact(outputDir, artifact)));
  }
}
