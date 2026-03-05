import fs from 'fs-extra';
import path from 'node:path';
import { executePipeline } from '../../src/core/pipeline';
import { createTempDir } from '../helpers';

describe('error stage testing integration', () => {
  test('blueprint 测试失败进入 testing 阶段', async () => {
    const repoRoot = path.resolve(__dirname, '../..');
    const cwd = createTempDir('lnngfar-testing-fail-');
    const forceFail = path.join(repoRoot, 'blueprints/lnngfar-blueprint-cocos/tests/force-fail.spec.ts');
    const previousSkip = process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS;

    delete process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS;

    fs.writeFileSync(forceFail, "test('force fail', () => { expect(1).toBe(2); });", 'utf-8');

    try {
      await expect(executePipeline({ blueprintName: 'cocos', cwd, repoRoot })).rejects.toMatchObject({
        detail: {
          stage: 'testing'
        }
      });
    } finally {
      if (previousSkip === undefined) {
        delete process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS;
      } else {
        process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS = previousSkip;
      }
      fs.removeSync(forceFail);
    }
  });
});
