import path from 'node:path';
import { executePipeline } from '../../src/core/pipeline';
import { collectFileContents, createTempDir } from '../helpers';

describe('deterministic generation integration', () => {
  test('相同输入得到相同输出', async () => {
    process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS = '1';
    const repoRoot = path.resolve(__dirname, '../..');
    const cwdA = createTempDir('lnngfar-det-a-');
    const cwdB = createTempDir('lnngfar-det-b-');

    await executePipeline({ blueprintName: 'cocos', cwd: cwdA, repoRoot });
    await executePipeline({ blueprintName: 'cocos', cwd: cwdB, repoRoot });

    const a = collectFileContents(cwdA);
    const b = collectFileContents(cwdB);
    expect(a).toEqual(b);
  });
});
