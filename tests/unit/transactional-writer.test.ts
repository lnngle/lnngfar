import fs from 'fs-extra';
import path from 'node:path';
import { withTempDir } from '../helpers';
import { writeArtifactsTransactionally } from '../../src/execution/transactional-writer';

describe('transactional-writer', () => {
  test('事务写入会覆盖旧目录并产出新文件', async () => {
    await withTempDir('lnngfar-txn-', async (cwd) => {
      const outputDir = path.join(cwd, 'demo-project');

      fs.ensureDirSync(outputDir);
      fs.writeFileSync(path.join(outputDir, 'old.txt'), 'old', 'utf-8');

      await writeArtifactsTransactionally(outputDir, [
        {
          path: 'new.txt',
          content: 'new-content',
          contentEncoding: 'utf-8'
        }
      ]);

      expect(fs.existsSync(path.join(outputDir, 'old.txt'))).toBe(false);
      expect(fs.readFileSync(path.join(outputDir, 'new.txt'), 'utf-8')).toBe('new-content');
    });
  });
});
