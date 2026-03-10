import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';

export function createTempDir(prefix = 'lnngfar-'): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function createRepoTempDir(repoRoot: string, prefix = '.lnngfar-'): string {
  fs.ensureDirSync(repoRoot);
  return fs.mkdtempSync(path.join(repoRoot, prefix));
}

export function removeDirIfExists(target: string): void {
  if (fs.existsSync(target)) {
    fs.removeSync(target);
  }
}

export async function withTempDir<T>(
  prefix: string,
  run: (dir: string) => Promise<T> | T
): Promise<T> {
  const dir = createTempDir(prefix);
  try {
    return await run(dir);
  } finally {
    removeDirIfExists(dir);
  }
}

export async function withRepoTempDir<T>(
  repoRoot: string,
  prefix: string,
  run: (dir: string) => Promise<T> | T
): Promise<T> {
  const dir = createRepoTempDir(repoRoot, prefix);
  try {
    return await run(dir);
  } finally {
    removeDirIfExists(dir);
  }
}

export async function withPatchedEnv<T>(
  patch: Record<string, string | undefined>,
  run: () => Promise<T> | T
): Promise<T> {
  const keys = Object.keys(patch);
  const previous: Record<string, string | undefined> = {};

  for (const key of keys) {
    previous[key] = process.env[key];
    const value = patch[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  try {
    return await run();
  } finally {
    for (const key of keys) {
      const old = previous[key];
      if (old === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = old;
      }
    }
  }
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
