import fs from 'fs-extra';
import path from 'node:path';
import { createTempDir } from '../helpers';
import { buildRenderPlan } from '../../src/execution/rendering/render-plan-builder';
import { renderPlan } from '../../src/execution/rendering/plan-renderer';
import { renderJsonPatch } from '../../src/execution/rendering/json-patch-renderer';
import { loadRenderConfig } from '../../src/execution/rendering/render-config-loader';
import { validateBlueprint } from '../../src/validation';
import { validateBlueprintManifest } from '../../src/validation/manifest-validator';
import { validateBlueprintStructure } from '../../src/validation/structure-validator';

describe('rendering and validation extra branches', () => {
  test('json patch 分支：无匹配变量和非法 JSON 时原样返回', () => {
    const noRule = renderJsonPatch('{"a":1}', [{ path: '$.a', variable: 'MISSING' }], {});
    expect(noRule).toBe('{"a":1}');

    const badJson = renderJsonPatch('not-json', [{ path: '$.a', variable: 'A' }], { A: '1' });
    expect(badJson).toBe('not-json');
  });

  test('json patch 分支：支持嵌套路径补丁', () => {
    const patched = renderJsonPatch('{"pkg":{}}', [{ path: '$.pkg."".name', variable: 'PROJECT_NAME' }], { PROJECT_NAME: 'demo' });
    expect(patched).toContain('"name": "demo"');
  });

  test('json patch 路径支持非 $. 前缀与尾随点', () => {
    const patched = renderJsonPatch('{"root":{}}', [{ path: 'root.child.', variable: 'VALUE' }], { VALUE: 'x' });
    expect(patched).toContain('"child": "x"');
  });

  test('render plan 分支：passthrough/json-patch/template 全覆盖', () => {
    const plan = buildRenderPlan(
      [
        { path: 'assets/a.png', content: 'AA==', contentEncoding: 'utf-8' },
        { path: 'pkg.json', content: '{"name":"x"}', contentEncoding: 'utf-8' },
        { path: 'README.md', content: 'Hello {{NAME}}', contentEncoding: 'utf-8' },
        { path: 'raw.bin', content: 'QQ==', contentEncoding: 'base64' },
        { path: 'plain.txt', content: 'text {{NAME}}' }
      ],
      { NAME: 'World', PROJECT_NAME: 'demo' },
      {
        templatePatterns: ['**/*'],
        passthroughPatterns: ['assets/**/*.png', 'plain.txt'],
        jsonPatch: {
          'pkg.json': [{ path: '$.name', variable: 'PROJECT_NAME' }]
        }
      }
    );

    const rendered = renderPlan(plan);
    expect(rendered.find((item) => item.path === 'assets/a.png')?.content).toBe('AA==');
    expect(rendered.find((item) => item.path === 'pkg.json')?.content).toContain('"name": "demo"');
    expect(rendered.find((item) => item.path === 'README.md')?.content).toBe('Hello World');
    expect(rendered.find((item) => item.path === 'raw.bin')?.contentEncoding).toBe('base64');
    expect(rendered.find((item) => item.path === 'plain.txt')?.content).toBe('text {{NAME}}');
  });

  test('plan renderer 的 json-patch 规则缺省分支覆盖', () => {
    const rendered = renderPlan({
      artifacts: [
        {
          path: 'pkg.json',
          content: '{"name":"x"}',
          contentEncoding: 'utf-8',
          renderMode: 'json-patch'
        }
      ],
      variables: { PROJECT_NAME: 'demo' }
    });

    expect(rendered[0].content).toBe('{"name":"x"}');
  });

  test('render config loader：缺省配置与用户配置合并', () => {
    const root = createTempDir('lnngfar-render-config-');
    const pkg = {
      manifest: {
        name: 'cocos',
        packageName: 'lnngfar-blueprint-cocos',
        version: '1.0.0',
        description: 'x',
        target: 'x',
        language: 'ts',
        engine: 'oops',
        testFramework: 'jest'
      },
      rootPath: root,
      templatesPath: '',
      generatorsPath: '',
      testsPath: '',
      readmePath: '',
      generatorEntryPath: '',
      status: 'validated' as const
    };

    const defaultConfig = loadRenderConfig(pkg);
    expect(defaultConfig.templatePatterns).toEqual(['**/*']);
    expect(defaultConfig.jsonPatch?.['package.json']).toBeDefined();

    fs.writeJsonSync(path.join(root, 'render.config.json'), {
      templatePatterns: ['src/**/*.ts'],
      jsonPatch: {
        'custom.json': [{ path: '$.name', variable: 'PROJECT_NAME' }]
      }
    });

    const merged = loadRenderConfig(pkg);
    expect(merged.templatePatterns).toEqual(['src/**/*.ts']);
    expect(merged.jsonPatch?.['package.json']).toBeDefined();
    expect(merged.jsonPatch?.['custom.json']).toBeDefined();

    fs.writeJsonSync(path.join(root, 'render.config.json'), {
      templatePatterns: ['templates/**/*.tpl']
    });
    const mergedWithoutPatch = loadRenderConfig(pkg);
    expect(mergedWithoutPatch.templatePatterns).toEqual(['templates/**/*.tpl']);
    expect(mergedWithoutPatch.jsonPatch?.['package.json']).toBeDefined();
  });

  test('validateBlueprint：覆盖 generatorEntry 解析与状态', () => {
    const root = createTempDir('lnngfar-validate-bp-');
    fs.ensureDirSync(path.join(root, 'templates'));
    fs.ensureDirSync(path.join(root, 'generators'));
    fs.ensureDirSync(path.join(root, 'tests'));
    fs.writeFileSync(path.join(root, 'README.md'), '# demo', 'utf-8');

    const customEntry = path.join(root, 'generators', 'entry.js');
    fs.writeFileSync(customEntry, 'module.exports = {};', 'utf-8');

    fs.writeJsonSync(path.join(root, 'blueprint.json'), {
      name: 'cocos',
      packageName: 'lnngfar-blueprint-cocos',
      version: '1.0.0',
      description: 'x',
      target: 'x',
      language: 'ts',
      engine: 'oops',
      testFramework: 'jest',
      generatorEntry: 'generators/entry.js'
    });

    const validResult = validateBlueprint(root);
    expect(validResult.valid).toBe(true);
    expect(validResult.blueprintPackage?.generatorEntryPath).toBe(customEntry);
    expect(validResult.blueprintPackage?.status).toBe('validated');

    fs.removeSync(customEntry);
    fs.writeJsonSync(path.join(root, 'blueprint.json'), {
      name: 'cocos',
      packageName: 'lnngfar-blueprint-cocos',
      version: '1.0.0',
      description: 'x',
      target: 'x',
      language: 'ts',
      engine: 'oops',
      testFramework: 'jest'
    });
    fs.writeFileSync(path.join(root, 'generators', 'index.js'), 'module.exports = {};', 'utf-8');
    const jsResult = validateBlueprint(root);
    expect(jsResult.blueprintPackage?.generatorEntryPath).toBe(path.join(root, 'generators', 'index.js'));

    fs.removeSync(path.join(root, 'generators', 'index.js'));
    fs.writeFileSync(path.join(root, 'generators', 'index.ts'), 'export {};', 'utf-8');
    const tsResult = validateBlueprint(root);
    expect(tsResult.blueprintPackage?.generatorEntryPath).toBe(path.join(root, 'generators', 'index.ts'));

    fs.removeSync(path.join(root, 'README.md'));
    const rejectedResult = validateBlueprint(root);
    expect(rejectedResult.valid).toBe(false);
    expect(rejectedResult.blueprintPackage?.status).toBe('rejected');
  });

  test('validateBlueprint：缺少 manifest 与 manifest 非法路径', () => {
    const root = createTempDir('lnngfar-validate-bp-invalid-');
    fs.ensureDirSync(path.join(root, 'templates'));
    fs.ensureDirSync(path.join(root, 'generators'));
    fs.ensureDirSync(path.join(root, 'tests'));
    fs.writeFileSync(path.join(root, 'README.md'), '# demo', 'utf-8');

    const missingManifest = validateBlueprint(root);
    expect(missingManifest.valid).toBe(false);
    expect(missingManifest.errors).toContain('缺少 blueprint.json');

    fs.writeJsonSync(path.join(root, 'blueprint.json'), { packageName: 'bad' });
    const badManifest = validateBlueprint(root);
    expect(badManifest.valid).toBe(false);
    expect(badManifest.errors.length).toBeGreaterThan(0);
  });

  test('manifest 与 structure 校验分支覆盖', () => {
    const badPrefix = validateBlueprintManifest({
      name: 'cocos',
      packageName: 'bad-prefix-cocos',
      version: '1.0.0',
      description: 'x',
      target: 'x',
      language: 'ts',
      engine: 'oops',
      testFramework: 'jest'
    });
    expect(badPrefix.valid).toBe(false);
    expect(badPrefix.errors).toContain('packageName 必须以 lnngfar-blueprint- 开头');

    const badName = validateBlueprintManifest({
      name: 'foo',
      packageName: 'lnngfar-blueprint-cocos',
      version: '1.0.0',
      description: 'x',
      target: 'x',
      language: 'ts',
      engine: 'oops',
      testFramework: 'jest'
    });
    expect(badName.valid).toBe(false);
    expect(badName.errors).toContain('name 必须等于 packageName 去掉前缀后的名称');

    const root = createTempDir('lnngfar-validate-struct-');
    const errors = validateBlueprintStructure(root);
    expect(errors).toContain('缺少必需项: blueprint.json');

    const schemaFail = validateBlueprintManifest({});
    expect(schemaFail.valid).toBe(false);
  });

  test('render plan builder：空模板/空透传规则分支', () => {
    const plan = buildRenderPlan(
      [
        { path: 'docs/readme.txt', content: 'x' },
        { path: 'asset.unknown', content: 'y', contentEncoding: 'utf-8' }
      ],
      {},
      {
        templatePatterns: [],
        passthroughPatterns: []
      }
    );

    expect(plan.artifacts[0].renderMode).toBe('passthrough');
    expect(plan.artifacts[1].renderMode).toBe('passthrough');
  });

  test('render plan builder：templatePatterns 缺省时使用默认匹配', () => {
    const plan = buildRenderPlan(
      [{ path: 'README.md', content: 'hello {{X}}' }],
      { X: 'ok' },
      {
        passthroughPatterns: []
      }
    );

    expect(plan.artifacts[0].renderMode).toBe('template');
  });
});
