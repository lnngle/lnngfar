import fs from 'fs-extra';
import path from 'node:path';
import { validateBlueprint } from '../../src/validation';
import { withTempDir } from '../helpers';

describe('manifest validation integration', () => {
  test('缺少必需字段时校验失败', async () => {
    await withTempDir('lnngfar-manifest-', async (root) => {
      fs.ensureDirSync(path.join(root, 'templates'));
      fs.ensureDirSync(path.join(root, 'generators'));
      fs.ensureDirSync(path.join(root, 'tests'));
      fs.writeFileSync(path.join(root, 'README.md'), 'x', 'utf-8');
      fs.writeJsonSync(path.join(root, 'blueprint.json'), {
        packageName: 'lnngfar-blueprint-bad'
      });

      const result = validateBlueprint(root);
      expect(result.valid).toBe(false);
    });
  });
});
