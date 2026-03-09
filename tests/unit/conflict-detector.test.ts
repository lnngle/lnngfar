import fs from 'fs-extra';
import path from 'node:path';
import { createTempDir } from '../helpers';
import { detectPathConflicts } from '../../src/execution/conflict-detector';

describe('conflict-detector', () => {
  test('检测冲突文件', () => {
    const tmp = createTempDir('lnngfar-conflict-');
    const target = path.join(tmp, 'assets', 'script', 'Main.ts');
    fs.ensureDirSync(path.dirname(target));
    fs.writeFileSync(target, 'conflict', 'utf-8');

    const conflicts = detectPathConflicts(tmp, ['assets/script/Main.ts']);
    expect(conflicts).toEqual(['assets/script/Main.ts']);
  });
});
