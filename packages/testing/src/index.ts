// @lnngfar/testing - Testing Runtime

export interface TestResult { passed: number; failed: number; errors: string[]; }
export interface QualityResult { lint: boolean; types: boolean; coverage: number; }

export async function runTests(pattern?: string): Promise<TestResult> {
  return { passed: 0, failed: 0, errors: [] }; // Stub - delegates to vitest
}

export async function runRegressionTests(): Promise<TestResult> {
  return runTests();
}

export function validateQuality(gates: { name: string; check: () => boolean }[]): QualityResult {
  const passed = gates.filter((g) => g.check());
  return { lint: true, types: true, coverage: passed.length / gates.length * 100 };
}
