import path from 'node:path';
import { executePipeline } from '../../src/core/pipeline';

describe('error stage blueprint integration', () => {
  test('未知 blueprint 进入 blueprint 阶段失败', async () => {
    const repoRoot = path.resolve(__dirname, '../..');
    const cwd = path.resolve(__dirname, '../../');

    await expect(executePipeline({ blueprintName: 'unknown', cwd, repoRoot })).rejects.toMatchObject({
      detail: {
        stage: 'blueprint'
      }
    });
  });
});
