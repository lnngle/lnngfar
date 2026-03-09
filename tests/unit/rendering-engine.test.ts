import { buildRenderPlan } from '../../src/execution/rendering/render-plan-builder';
import { renderPlan } from '../../src/execution/rendering/plan-renderer';

describe('rendering-engine', () => {
  test('根据规则生成渲染计划并执行模板替换与json补丁', () => {
    const plan = buildRenderPlan(
      [
        {
          path: 'README.md',
          content: 'name={{PROJECT_NAME}}',
          contentEncoding: 'utf-8'
        },
        {
          path: 'package.json',
          content: '{"name":"x","description":"y"}',
          contentEncoding: 'utf-8'
        },
        {
          path: 'assets/icon.png',
          content: 'AA==',
          contentEncoding: 'base64'
        }
      ],
      {
        PROJECT_NAME: 'demo-project',
        PROJECT_DESCRIPTION: 'demo project'
      },
      {
        templatePatterns: ['**/*'],
        passthroughPatterns: ['assets/**/*.png'],
        jsonPatch: {
          'package.json': [
            { path: '$.name', variable: 'PROJECT_NAME' },
            { path: '$.description', variable: 'PROJECT_DESCRIPTION' }
          ]
        }
      }
    );

    const artifacts = renderPlan(plan);
    const readme = artifacts.find((item) => item.path === 'README.md');
    const pkg = artifacts.find((item) => item.path === 'package.json');
    const icon = artifacts.find((item) => item.path === 'assets/icon.png');

    expect(readme?.content).toBe('name=demo-project');
    expect(pkg?.content).toContain('"name": "demo-project"');
    expect(pkg?.content).toContain('"description": "demo project"');
    expect(icon?.contentEncoding).toBe('base64');
    expect(icon?.content).toBe('AA==');
  });
});
