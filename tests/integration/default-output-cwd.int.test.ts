import fs from 'fs-extra';
import path from 'node:path';
import { executePipeline } from '../../src/core/pipeline';
import { createTempDir } from '../helpers';

describe('default output cwd integration', () => {
  test('默认写入当前工作目录', async () => {
    process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS = '1';
    const repoRoot = path.resolve(__dirname, '../..');
    const cwd = createTempDir('lnngfar-cwd-');

    await executePipeline({ blueprintName: 'cocos', cwd, repoRoot });
    expect(fs.existsSync(path.join(cwd, 'assets/scripts/entry/GameEntry.ts'))).toBe(true);
  });
});
