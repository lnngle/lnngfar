import fs from 'fs-extra';
import path from 'node:path';
import { executePipeline } from '../../src/core/pipeline';
import { createTempDir } from '../helpers';

describe('cli cocos success contract', () => {
  test('执行后生成核心文件', async () => {
    process.env.LNNGFAR_SKIP_BLUEPRINT_TESTS = '1';
    const repoRoot = path.resolve(__dirname, '../..');
    const cwd = createTempDir('lnngfar-us1-success-');

    const result = await executePipeline({
      blueprintName: 'cocos',
      cwd,
      repoRoot
    });

    const outputDir = path.join(cwd, 'cocos-project');
    expect(result.blueprintName).toBe('cocos');
    expect(result.outputDir).toBe(outputDir);
    expect(fs.existsSync(path.join(outputDir, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'settings/v2/packages/project.json'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'assets/main.scene'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'assets/script/Main.ts'))).toBe(true);
  });
});
