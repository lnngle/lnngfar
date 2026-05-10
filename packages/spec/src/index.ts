// @lnngfar/spec-engine - Spec parser, indexer, loader

import { readFileSync, existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';

export interface SpecDocument { path: string; status: string; entities: string[]; requirements: string[]; }

/** 解析单个 spec.md */
export function parseSpec(path: string): SpecDocument {
  if (!existsSync(path)) throw new Error(`Spec not found: ${path}`);
  const content = readFileSync(path, 'utf-8');
  const status = content.match(/\*?\*?status\*?\*?:\s*(\w+)/i)?.[1] || 'unknown';
  const entities = (content.match(/^###\s+(.+)/gm) || []).map((s) => s.replace('### ', '').trim());
  const requirements = (content.match(/FR-\d+/g) || []);
  return { path, status, entities, requirements };
}

/** 索引 specs/ 目录 */
export interface SpecIndex { modules: Record<string, SpecDocument>; }
export function indexSpecs(root: string): SpecIndex {
  const modules: Record<string, SpecDocument> = {};
  if (!existsSync(root)) return { modules };
  for (const dir of readdirSync(root)) {
    const specPath = join(root, dir, 'spec.md');
    if (existsSync(specPath)) {
      modules[dir] = parseSpec(specPath);
    }
  }
  return { modules };
}

/** 加载模块上下文 */
export interface SpecContext { module: string; status: string; entities: string[]; requirements: string[]; }
export function loadSpecContext(module: string, specsRoot?: string): SpecContext {
  const root = specsRoot || join(process.cwd(), 'specs');
  const specPath = join(root, module, 'spec.md');
  const doc = parseSpec(specPath);
  return { module, status: doc.status, entities: doc.entities, requirements: doc.requirements };
}

/** 同步 spec 状态 */
export async function syncSpecs(module: string, specsRoot?: string): Promise<void> {
  const root = specsRoot || join(process.cwd(), 'specs');
  const specPath = join(root, module, 'spec.md');
  if (!existsSync(specPath)) throw new Error(`Spec not found: ${specPath}`);
  let content = readFileSync(specPath, 'utf-8');
  content = content.replace(/status:\s*\w+/, 'status: done');
  writeFileSync(specPath, content);
}
