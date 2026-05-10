// @lnngfar/ai-runtime - AI Runtime: prompt orchestration + context + incremental generation

export interface Prompt { system: string; context: string; task: string; }
export interface AiContext { module: string; specs: string; stackName: string; }
export type Intent = 'create' | 'modify' | 'add_field' | 'optimize' | 'refactor';

export function buildPrompt(task: string, context: AiContext): Prompt {
  return {
    system: `You are lnngfar AI. Stack: ${context.stackName}. Follow all coding rules.`,
    context: `Module: ${context.module}\nSpecs: ${context.specs}`,
    task,
  };
}

export function loadContext(module: string, specsRoot?: string): AiContext {
  return { module, specs: `${specsRoot || 'specs'}/${module}`, stackName: 'far-web-java' };
}

export function analyzeIntent(input: string): Intent {
  if (/生成|创建|新建|generate|create/.test(input)) return 'create';
  if (/修改|更新|change|update|modify/.test(input)) return 'modify';
  if (/字段|加.*字段|add.*field/.test(input)) return 'add_field';
  if (/优化|improve|optimize/.test(input)) return 'optimize';
  return 'refactor';
}

export function optimizeTokens(context: AiContext, budget: number): AiContext {
  if (context.specs.length > budget) context.specs = context.specs.slice(0, budget);
  return context;
}
