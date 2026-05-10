// @lnngfar/stack - Stack loader, validator, installer

import { readFileSync, existsSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { homedir } from 'node:os';
import { createLogger } from '@lnngfar/logger';
import { LogLevel } from '@lnngfar/types';

const logger = createLogger('stack', LogLevel.INFO);

export interface StackDefinition {
  name: string;
  version: string;
  displayName?: string;
  description?: string;
  type?: string;
  technologies?: Record<string, unknown>;
}

export interface Stack { definition: StackDefinition; path: string; }
export interface ValidationResult { valid: boolean; errors: string[]; }

function stacksDir(): string {
  const dir = join(homedir(), '.lnngfar', 'stacks');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

function parseYaml(content: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const stack: string[] = [];
  for (const line of content.split('\n')) {
    const trimmed = line.trimEnd();
    if (!trimmed || trimmed.startsWith('#') || trimmed === '---') continue;
    const indent = line.length - line.trimStart().length;
    stack.length = Math.floor(indent / 2);
    const m = trimmed.match(/^(\w[\w-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    const [, key, raw] = m;
    const val = raw.trim().replace(/^["']|["']$/g, '');
    if (val === '') { stack.push(key); } else {
      const fullKey = [...stack, key].join('.');
      result[fullKey] = val === 'true' ? true : val === 'false' ? false : /^\d+$/.test(val) ? Number(val) : val;
    }
  }
  return result;
}

export function loadStack(name: string): Stack {
  const dir = join(stacksDir(), name);
  if (!existsSync(dir)) throw new Error(`Stack "${name}" not installed`);
  const ymlPath = join(dir, 'stack.yml');
  if (!existsSync(ymlPath)) throw new Error(`stack.yml missing in ${dir}`);
  const raw = parseYaml(readFileSync(ymlPath, 'utf-8'));
  const definition: StackDefinition = {
    name: String(raw['name'] || ''), version: String(raw['version'] || '0.0.0'),
    displayName: raw['displayName'] ? String(raw['displayName']) : undefined,
    description: raw['description'] ? String(raw['description']) : undefined,
    type: raw['type'] ? String(raw['type']) : undefined,
  };
  if (raw['technologies.framework']) {
    definition.technologies = {};
    for (const [k, v] of Object.entries(raw)) {
      if (k.startsWith('technologies.')) (definition.technologies as Record<string,unknown>)[k.slice('technologies.'.length)] = v;
    }
  }
  logger.info(`Stack loaded: ${definition.name}@${definition.version}`);
  return { definition, path: dir };
}

export function validateStack(rootPath: string): ValidationResult {
  const errors: string[] = [];
  const ymlPath = join(rootPath, 'stack.yml');
  if (!existsSync(ymlPath)) return { valid: false, errors: ['stack.yml not found'] };
  try {
    const raw = parseYaml(readFileSync(ymlPath, 'utf-8'));
    if (!raw['name']) errors.push('Missing: name');
    if (!raw['version']) errors.push('Missing: version');
  } catch (e) { errors.push(`Parse: ${e}`); }
  return { valid: errors.length === 0, errors };
}

export function installStack(name: string, sourcePath: string): Stack {
  const r = validateStack(sourcePath);
  if (!r.valid) throw new Error(`Invalid: ${r.errors.join(', ')}`);
  const target = join(stacksDir(), name);
  if (existsSync(target)) throw new Error(`Stack "${name}" already installed`);
  copyRecursive(sourcePath, target);
  logger.info(`Stack installed: ${name}`);
  return loadStack(name);
}

export function listStacks(): Stack[] {
  const d = stacksDir();
  if (!existsSync(d)) return [];
  return readdirSync(d, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => {
    try { return loadStack(e.name); } catch { return null; }
  }).filter(Boolean) as Stack[];
}

export function resolveDependencies(s: Stack): Stack[] { return [s]; }

function copyRecursive(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });
  for (const e of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, e.name), d = join(dest, e.name);
    if (e.isDirectory()) copyRecursive(s, d);
    else copyFileSync(s, d);
  }
}
