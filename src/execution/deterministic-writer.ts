import fs from 'fs-extra';
import path from 'node:path';
import { GeneratedArtifact } from '../core/contracts/blueprint-contract';

export async function writeArtifactsDeterministically(outputDir: string, artifacts: GeneratedArtifact[]): Promise<void> {
  const ordered = [...artifacts].sort((a, b) => a.path.localeCompare(b.path));

  for (const artifact of ordered) {
    const targetPath = path.join(outputDir, artifact.path);
    await fs.ensureDir(path.dirname(targetPath));
    if (artifact.contentEncoding === 'base64') {
      await fs.writeFile(targetPath, Buffer.from(artifact.content, 'base64'));
      continue;
    }

    await fs.writeFile(targetPath, artifact.content, 'utf-8');
  }
}
