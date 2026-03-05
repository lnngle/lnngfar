import path from 'node:path';
import { resolveBlueprints } from '../../src/discovery/local-blueprint-resolver';

describe('local discovery contract', () => {
  test('可发现本地内置 blueprint', () => {
    const repoRoot = path.resolve(__dirname, '../..');
    const all = resolveBlueprints(repoRoot);
    const names = all.map((item) => item.blueprintName);
    expect(names).toContain('cocos');
  });
});
