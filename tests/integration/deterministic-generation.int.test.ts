import path from 'node:path';
import { executePipeline } from '../../src/core/pipeline';
import { collectFileContents, withPatchedEnv, withTempDir } from '../helpers';

describe('deterministic generation integration', () => {
  test('相同输入得到相同输出', async () => {
    const repoRoot = path.resolve(__dirname, '../..');
    await withPatchedEnv({ LNNGFAR_SKIP_BLUEPRINT_TESTS: '1' }, async () => {
      await withTempDir('lnngfar-det-a-', async (cwdA) => {
        await withTempDir('lnngfar-det-b-', async (cwdB) => {
          await executePipeline({ blueprintName: 'cocos', cwd: cwdA, repoRoot });
          await executePipeline({ blueprintName: 'cocos', cwd: cwdB, repoRoot });

          const a = collectFileContents(path.join(cwdA, 'cocos-project'));
          const b = collectFileContents(path.join(cwdB, 'cocos-project'));
          expect(a).toEqual(b);
        });
      });
    });
  });
});
