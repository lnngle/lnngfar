import path from 'node:path';
import { resolveBlueprintByName } from '../../src/discovery/local-blueprint-resolver';

describe('third-party extension integration', () => {
  test('可发现第三方示例 blueprint', () => {
    const repoRoot = path.resolve(__dirname, '../..');
    const blueprint = resolveBlueprintByName('example', repoRoot);
    expect(blueprint).not.toBeNull();
  });
});
