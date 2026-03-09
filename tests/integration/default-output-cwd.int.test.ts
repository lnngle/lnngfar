import fs from 'fs-extra';
import path from 'node:path';
import { executePipeline } from '../../src/core/pipeline';
import { createTempDir } from '../helpers';

describe('default output cwd integration', () => {
  test('默认写入当前工作目录下的项目名子目录', async () => {
    process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS = '1';
    const repoRoot = path.resolve(__dirname, '../..');
    const cwd = createTempDir('lnngfar-cwd-');

    const result = await executePipeline({ blueprintName: 'cocos', cwd, repoRoot });
    const outputDir = path.join(cwd, 'cocos-project');

    expect(result.outputDir).toBe(outputDir);
    expect(fs.existsSync(path.join(outputDir, 'settings/v2/packages/project.json'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'assets/main.scene'))).toBe(true);
  });
});
