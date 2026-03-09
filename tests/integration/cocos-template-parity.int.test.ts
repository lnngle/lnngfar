import fs from 'fs-extra';
import path from 'node:path';
import { executePipeline } from '../../src/core/pipeline';
import { createRepoTempDir } from '../helpers';

function listFiles(root: string): string[] {
  const files: string[] = [];
  const stack = [''];

  while (stack.length > 0) {
    const relative = stack.pop() as string;
    const absolute = path.join(root, relative);
    const entries = fs.readdirSync(absolute, { withFileTypes: true });

    for (const entry of entries) {
      const childRelative = path.join(relative, entry.name).replace(/\\/g, '/');
      const childAbsolute = path.join(root, childRelative);
      if (entry.isDirectory()) {
        stack.push(childRelative);
      } else {
        files.push(childRelative);
      }
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

describe('cocos template parity integration', () => {
  test('生成结果与 blueprint 模板文件集合及内容一致', async () => {
    process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS = '1';
    const repoRoot = path.resolve(__dirname, '../..');
    const cwd = createRepoTempDir(repoRoot, '.lnngfar-parity-');
    const templateRoot = path.join(repoRoot, 'blueprints/lnngfar-blueprint-cocos/templates');

    try {
      const outputDir = path.join(cwd, 'cocos-project');
      await executePipeline({ blueprintName: 'cocos', cwd, repoRoot });

      const expectedFiles = listFiles(templateRoot);
      const actualFiles = listFiles(outputDir);

      expect(actualFiles).toEqual(expectedFiles);

      for (const relativePath of expectedFiles) {
        const expectedPath = path.join(templateRoot, relativePath);
        const actualPath = path.join(outputDir, relativePath);

        if (relativePath === 'package.json') {
          const expectedJson = fs.readJsonSync(expectedPath) as {
            creator?: { version?: string };
            name?: string;
            description?: string;
          };
          const actualJson = fs.readJsonSync(actualPath) as {
            creator?: { version?: string };
            name?: string;
            description?: string;
          };

          expect(actualJson.creator?.version).toMatch(/^\d+\.\d+\.\d+$/);
          expect(actualJson.name).toBe('cocos-project');
          expect(actualJson.description).toBe('cocos-project project');
          if (!expectedJson.creator) {
            expectedJson.creator = {};
          }
          expectedJson.creator.version = actualJson.creator?.version;
          expectedJson.name = actualJson.name;
          expectedJson.description = actualJson.description;
          expect(actualJson).toEqual(expectedJson);
          continue;
        }

        if (relativePath === 'package-lock.json') {
          const expectedLock = fs.readJsonSync(expectedPath) as {
            name?: string;
            packages?: Record<string, { name?: string }>;
          };
          const actualLock = fs.readJsonSync(actualPath) as {
            name?: string;
            packages?: Record<string, { name?: string }>;
          };

          expect(actualLock.name).toBe('cocos-project');
          expect(actualLock.packages?.['']?.name).toBe('cocos-project');

          expectedLock.name = actualLock.name;
          if (expectedLock.packages?.['']) {
            expectedLock.packages[''].name = actualLock.packages?.['']?.name;
          }

          expect(actualLock).toEqual(expectedLock);
          continue;
        }

        const expectedBuffer = fs.readFileSync(expectedPath);
        const actualBuffer = fs.readFileSync(actualPath);
        expect(actualBuffer.equals(expectedBuffer)).toBe(true);
      }
    } finally {
      fs.removeSync(cwd);
    }
  });
});
