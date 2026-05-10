// @lnngfar/template - Template Engine

import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

export interface Variables { [key: string]: unknown; }
export interface Template { name: string; content: string; source: string; }

/** 简单模板渲染 {{var}} 替换 */
export function renderTemplate(template: string, vars: Variables): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? `{{${key}}}`));
}

/** 按优先级加载模板 */
export function loadTemplate(name: string, stack?: string): Template {
  const searchPaths = [
    join(process.cwd(), 'templates'),                    // 1. project
    stack ? join(process.cwd(), 'stacks', stack, 'templates') : null, // 2. stack
    join(process.cwd(), 'node_modules', '@lnngfar', 'templates'),     // 3. shared
  ].filter(Boolean) as string[];

  for (const dir of searchPaths) {
    const p = resolve(dir, `${name}.tmpl`);
    if (existsSync(p)) return { name, content: readFileSync(p, 'utf-8'), source: p };
  }
  throw new Error(`Template "${name}" not found`);
}

/** 组合多个模板片段 */
export function composeTemplate(templates: Template[]): Template {
  return {
    name: templates.map((t) => t.name).join('+'),
    content: templates.map((t) => t.content).join('\n'),
    source: 'composed',
  };
}
