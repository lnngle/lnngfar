import fs from 'fs-extra';
import path from 'node:path';

export function detectPathConflicts(outputDir: string, relativePaths: string[]): string[] {
  const conflicts: string[] = [];

  for (const relativePath of relativePaths) {
    const absolutePath = path.join(outputDir, relativePath);
    if (fs.existsSync(absolutePath)) {
      conflicts.push(relativePath);
    }
  }

  return conflicts;
}
