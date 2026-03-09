import { getDefaultProjectName, isValidProjectName } from '../../src/cli/project-name';

describe('project name rules', () => {
  test('默认项目名为 blueprint 后缀加 project', () => {
    expect(getDefaultProjectName('cocos')).toBe('cocos-project');
    expect(getDefaultProjectName('example')).toBe('example-project');
  });

  test('项目名校验规则生效', () => {
    expect(isValidProjectName('demo_01')).toBe(true);
    expect(isValidProjectName('demo-project')).toBe(true);
    expect(isValidProjectName('demo project')).toBe(false);
    expect(isValidProjectName('demo/project')).toBe(false);
  });
});
