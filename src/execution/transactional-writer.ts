import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { GeneratedArtifact } from '../core/contracts/blueprint-contract';
import { writeArtifactsDeterministically } from './deterministic-writer';

export async function withTransactionalOutput(
  outputDir: string,
  writer: (stagingDir: string) => Promise<void>
): Promise<void> {
  const parentDir = path.dirname(outputDir);
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'lnngfar-txn-'));

  try {
    await writer(tempDir);
    await fs.ensureDir(parentDir);

    if (await fs.pathExists(outputDir)) {
      await fs.remove(outputDir);
    }

    await fs.move(tempDir, outputDir, { overwrite: true });
  } catch (error) {
    await fs.remove(tempDir);
    throw error;
  }
}

export async function writeArtifactsTransactionally(outputDir: string, artifacts: GeneratedArtifact[]): Promise<void> {
  await withTransactionalOutput(outputDir, async (stagingDir) => {
    await writeArtifactsDeterministically(stagingDir, artifacts);
  });
}
