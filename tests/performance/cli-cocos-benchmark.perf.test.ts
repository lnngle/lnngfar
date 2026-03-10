import path from 'node:path';
import { executePipeline } from '../../src/core/pipeline';
import { withPatchedEnv, withTempDir } from '../helpers';

describe('cli cocos benchmark', () => {
  test('记录一次生成流程耗时', async () => {
    const repoRoot = path.resolve(__dirname, '../..');

    await withPatchedEnv({ LNNGFAR_SKIP_BLUEPRINT_TESTS: '1' }, async () => {
      await withTempDir('lnngfar-perf-cli-', async (cwd) => {
        const start = process.hrtime.bigint();
        const result = await executePipeline({
          blueprintName: 'cocos',
          cwd,
          repoRoot
        });
        const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

        console.log(`[perf] cli-cocos duration=${durationMs.toFixed(2)}ms output=${result.outputDir}`);

        expect(durationMs).toBeGreaterThan(0);
        expect(result.outputDir).toBe(path.join(cwd, 'cocos-project'));
      });
    });
  });
});
