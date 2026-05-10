// @lnngfar/config-loader - 配置读取与校验

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { LnngfarConfig } from '@lnngfar/types';

const CONFIG_FILES = ['lnngfar.config.json', 'project.yml', '.lnngfar/project.yml'] as const;

/** 加载项目配置（按优先级尝试） */
export function loadConfig(projectPath: string): LnngfarConfig {
  for (const file of CONFIG_FILES) {
    const fullPath = resolve(projectPath, file);
    if (existsSync(fullPath)) {
      const content = readFileSync(fullPath, 'utf-8');
      if (file.endsWith('.json')) {
        return parseJsonConfig(content, fullPath);
      }
      if (file.endsWith('.yml') || file.endsWith('.yaml')) {
        return parseYamlConfig(content, fullPath);
      }
    }
  }
  throw new Error(`No config file found in ${projectPath}`);
}

function parseJsonConfig(content: string, path: string): LnngfarConfig {
  try {
    const parsed = JSON.parse(content);
    validateConfig(parsed);
    return parsed as LnngfarConfig;
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${path}: ${e.message}`);
    }
    throw e;
  }
}

function parseYamlConfig(content: string, path: string): LnngfarConfig {
  // MVP: simple YAML parsing for basic key-value pairs
  // Full YAML parsing will be added when a yaml parser dependency is introduced
  const parsed = parseSimpleYaml(content);
  validateConfig(parsed);
  return parsed;
}

function parseSimpleYaml(content: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^(\w[\w.]*):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      result[key] = value.trim();
    }
  }
  return result;
}

/** 校验配置合法性 */
export function validateConfig(config: unknown): config is LnngfarConfig {
  if (typeof config !== 'object' || config === null) {
    throw new TypeError('Config must be an object');
  }
  const c = config as Record<string, unknown>;

  if (!c.project || typeof c.project !== 'object') {
    throw new TypeError('Config must have project field');
  }

  if (!c.stack || typeof c.stack !== 'object') {
    throw new TypeError('Config must have stack field');
  }

  return true;
}
