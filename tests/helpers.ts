import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';

export function createTempDir(prefix = 'lnngfar-'): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function collectFileContents(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  const stack = [''];

  while (stack.length > 0) {
    const relative = stack.pop() as string;
    const absolute = path.join(root, relative);
    const entries = fs.readdirSync(absolute, { withFileTypes: true });

    for (const entry of entries) {
      const childRelative = path.join(relative, entry.name);
      const childAbsolute = path.join(root, childRelative);
      if (entry.isDirectory()) {
        stack.push(childRelative);
      } else {
        result[childRelative.replace(/\\/g, '/')] = fs.readFileSync(childAbsolute, 'utf-8');
      }
    }
  }

  return result;
}
