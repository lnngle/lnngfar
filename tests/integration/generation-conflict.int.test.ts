import fs from 'fs-extra';
import path from 'node:path';
import { executePipeline } from '../../src/core/pipeline';
import { createTempDir } from '../helpers';

describe('generation conflict integration', () => {
  test('冲突时进入 generation 失败', async () => {
    process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS = '1';
    const repoRoot = path.resolve(__dirname, '../..');
    const cwd = createTempDir('lnngfar-conflict-');
    const conflictPath = path.join(cwd, 'assets/scripts/entry/GameEntry.ts');
    fs.ensureDirSync(path.dirname(conflictPath));
    fs.writeFileSync(conflictPath, 'exists', 'utf-8');

    await expect(executePipeline({ blueprintName: 'cocos', cwd, repoRoot })).rejects.toMatchObject({
      detail: {
        stage: 'generation'
      }
    });
  });
});
