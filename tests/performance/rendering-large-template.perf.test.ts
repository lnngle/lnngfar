import { buildRenderPlan } from '../../src/execution/rendering/render-plan-builder';
import { renderPlan } from '../../src/execution/rendering/plan-renderer';

type PerfCase = {
  fileCount: number;
  variableCount: number;
};

function createMockArtifacts(fileCount: number): Array<{ path: string; content: string; contentEncoding: 'utf-8' }> {
  return Array.from({ length: fileCount }, (_, i) => ({
    path: `src/file-${i}.txt`,
    content: `project={{PROJECT_NAME}}-${i}`,
    contentEncoding: 'utf-8' as const
  }));
}

function createVariables(variableCount: number): Record<string, string> {
  const result: Record<string, string> = {
    PROJECT_NAME: 'benchmark-project'
  };

  for (let i = 0; i < variableCount; i += 1) {
    result[`EXTRA_VAR_${i}`] = `value-${i}`;
  }

  return result;
}

describe.skip('rendering large template benchmark', () => {
  const cases: PerfCase[] = [
    { fileCount: 1000, variableCount: 10 },
    { fileCount: 5000, variableCount: 30 },
    { fileCount: 10000, variableCount: 50 }
  ];

  test.each(cases)('fileCount=$fileCount variableCount=$variableCount', ({ fileCount, variableCount }) => {
    const artifacts = createMockArtifacts(fileCount);
    const variables = createVariables(variableCount);

    const startPlan = process.hrtime.bigint();
    const plan = buildRenderPlan(artifacts, variables, {
      templatePatterns: ['**/*']
    });
    const planMs = Number(process.hrtime.bigint() - startPlan) / 1_000_000;

    const startRender = process.hrtime.bigint();
    const rendered = renderPlan(plan);
    const renderMs = Number(process.hrtime.bigint() - startRender) / 1_000_000;

    // eslint-disable-next-line no-console
    console.log(`[perf] files=${fileCount} vars=${variableCount} plan=${planMs.toFixed(2)}ms render=${renderMs.toFixed(2)}ms`);

    expect(rendered).toHaveLength(fileCount);
    expect(rendered[0].content).toContain('benchmark-project');
  });
});
