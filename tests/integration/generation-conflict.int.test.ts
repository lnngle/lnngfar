import fs from 'fs-extra';
import path from 'node:path';
import { executePipeline } from '../../src/core/pipeline';
import { withPatchedEnv, withTempDir } from '../helpers';

describe('generation conflict integration', () => {
  test('冲突时进入 generation 失败', async () => {
    const repoRoot = path.resolve(__dirname, '../..');
    await withPatchedEnv({ LNNGFAR_SKIP_BLUEPRINT_TESTS: '1' }, async () => {
      await withTempDir('lnngfar-conflict-', async (cwd) => {
        const conflictPath = path.join(cwd, 'cocos-project/assets/script/Main.ts');
        fs.ensureDirSync(path.dirname(conflictPath));
        fs.writeFileSync(conflictPath, 'exists', 'utf-8');

        await expect(executePipeline({ blueprintName: 'cocos', cwd, repoRoot })).rejects.toMatchObject({
          detail: {
            stage: 'generation'
          }
        });
      });
    });
  });
});
