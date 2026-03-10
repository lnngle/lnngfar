import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { resolveBlueprintByName, resolveBlueprints } from '../../src/discovery/local-blueprint-resolver';
import { toBlueprintName } from '../../src/discovery/blueprint-name-mapper';

describe('local-blueprint-resolver', () => {
  test('包名仅前缀时映射为 null', () => {
    expect(toBlueprintName('lnngfar-blueprint-')).toBeNull();
  });

  test('无 package.json 时返回空列表', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lnngfar-discovery-empty-'));
    const spy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    try {
      const result = resolveBlueprints(root);
      expect(result).toEqual([]);
    } finally {
      spy.mockRestore();
    }
  });

  test('同时解析内置与已安装 blueprint', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lnngfar-discovery-mix-'));

    fs.writeJsonSync(path.join(root, 'package.json'), {
      name: 'demo-root',
      dependencies: {
        'lnngfar-blueprint-installed': '1.0.0',
        'lnngfar-blueprint-': '1.0.0',
        'lnngfar-blueprint-missing': '1.0.0'
      }
    });

    const builtInRoot = path.join(root, 'blueprints', 'lnngfar-blueprint-cocos');
    fs.ensureDirSync(builtInRoot);

    const installedRoot = path.join(root, 'node_modules', 'lnngfar-blueprint-installed');
    fs.ensureDirSync(installedRoot);
    fs.writeJsonSync(path.join(installedRoot, 'package.json'), {
      name: 'lnngfar-blueprint-installed',
      version: '1.0.0'
    });

    const result = resolveBlueprints(path.join(root, 'nested', 'child'));
    const names = result.map((item) => item.blueprintName).sort();

    expect(names).toEqual(['cocos', 'installed']);
    const installed = result.find((item) => item.blueprintName === 'installed');
    expect(installed?.rootPath).toBe(installedRoot);

    const cocos = resolveBlueprintByName('cocos', root);
    expect(cocos?.packageName).toBe('lnngfar-blueprint-cocos');
    expect(cocos?.rootPath).toBe(builtInRoot);

    expect(resolveBlueprintByName('missing', root)).toBeNull();
  });

  test('package.json 缺省 dependencies 字段也可正常解析', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lnngfar-discovery-no-deps-'));
    fs.writeJsonSync(path.join(root, 'package.json'), {
      name: 'demo-root'
    });

    const result = resolveBlueprints(root);
    expect(result).toEqual([]);
  });

  test('默认参数分支：不传 projectRoot 也能执行', () => {
    const all = resolveBlueprints();
    expect(Array.isArray(all)).toBe(true);

    const found = resolveBlueprintByName('cocos');
    if (found) {
      expect(found.blueprintName).toBe('cocos');
    }
  });
});
