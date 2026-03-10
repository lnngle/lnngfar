import path from 'node:path';
import fs from 'fs-extra';
import { resolveBlueprintByName } from '../../src/discovery/local-blueprint-resolver';
import { withTempDir } from '../helpers';

describe('third-party extension integration', () => {
  test('可发现 node_modules 中的第三方 blueprint', async () => {
    await withTempDir('lnngfar-third-party-', async (projectRoot) => {
      const packageName = 'lnngfar-blueprint-third-party-sample';
      const expectedRoot = path.join(projectRoot, 'node_modules', packageName);

      fs.writeJsonSync(path.join(projectRoot, 'package.json'), {
        name: 'host-app',
        private: true,
        dependencies: {
          [packageName]: '1.0.0'
        }
      });

      fs.ensureDirSync(expectedRoot);
      fs.writeJsonSync(path.join(expectedRoot, 'package.json'), {
        name: packageName,
        version: '1.0.0'
      });

      const blueprint = resolveBlueprintByName('third-party-sample', projectRoot);
      expect(blueprint).not.toBeNull();
      expect(blueprint?.packageName).toBe(packageName);
      expect(path.resolve(blueprint?.rootPath ?? '')).toBe(path.resolve(expectedRoot));
    });
  });
});
