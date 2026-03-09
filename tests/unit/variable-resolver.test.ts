import { resolveVariables } from '../../src/execution/variables/variable-resolver';

describe('variable-resolver', () => {
  test('解析基础变量并生成默认描述', () => {
    const result = resolveVariables({
      blueprintPackage: {
        manifest: {
          name: 'cocos',
          packageName: 'lnngfar-blueprint-cocos',
          version: '1.0.0',
          description: 'desc',
          target: 'cocos',
          language: 'ts',
          engine: 'oops',
          testFramework: 'jest'
        },
        rootPath: 'x',
        templatesPath: 'x',
        generatorsPath: 'x',
        testsPath: 'x',
        readmePath: 'x',
        generatorEntryPath: 'x',
        status: 'validated'
      },
      projectName: 'cocos-project'
    });

    expect(result.PROJECT_NAME).toBe('cocos-project');
    expect(result.PROJECT_DESCRIPTION).toBe('cocos-project project');
    expect(result.BLUEPRINT_NAME).toBe('cocos');
    expect(result.BLUEPRINT_PACKAGE_NAME).toBe('lnngfar-blueprint-cocos');
  });

  test('仅在环境变量存在时注入CREATOR_VERSION', () => {
    const previous = process.env.LNNGFAR_COCOS_CREATOR_VERSION;
    process.env.LNNGFAR_COCOS_CREATOR_VERSION = '3.8.9';

    try {
      const result = resolveVariables({
        blueprintPackage: {
          manifest: {
            name: 'cocos',
            packageName: 'lnngfar-blueprint-cocos',
            version: '1.0.0',
            description: 'desc',
            target: 'cocos',
            language: 'ts',
            engine: 'oops',
            testFramework: 'jest'
          },
          rootPath: 'x',
          templatesPath: 'x',
          generatorsPath: 'x',
          testsPath: 'x',
          readmePath: 'x',
          generatorEntryPath: 'x',
          status: 'validated'
        },
        projectName: 'demo-project'
      });

      expect(result.CREATOR_VERSION).toBe('3.8.9');
    } finally {
      if (previous === undefined) {
        delete process.env.LNNGFAR_COCOS_CREATOR_VERSION;
      } else {
        process.env.LNNGFAR_COCOS_CREATOR_VERSION = previous;
      }
    }
  });
});
