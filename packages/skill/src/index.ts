// @lnngfar/skill - Skill Engine

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export interface SkillDefinition { name: string; version: string; type: string; priority: number; prompt: string; }
export interface Skill { definition: SkillDefinition; path: string; }

const registry = new Map<string, Skill>();

export function loadSkill(name: string, rootDir?: string): Skill {
  const dir = rootDir || join(process.cwd(), 'skills', name);
  const yamlPath = join(dir, 'skill.yaml');
  if (!existsSync(yamlPath)) throw new Error(`skill.yaml not found: ${yamlPath}`);
  const content = readFileSync(yamlPath, 'utf-8');
  const def = parseSkillYaml(content);
  const skill = { definition: def, path: dir };
  registry.set(name, skill);
  return skill;
}

export function loadSkillsFromStack(stackDir: string): Skill[] {
  const skillsDir = join(stackDir, 'skills');
  if (!existsSync(skillsDir)) return [];
  const { readdirSync: rs } = require('node:fs');
  return rs(skillsDir, { withFileTypes: true }).filter((d: {isDirectory(): boolean}) => d.isDirectory()).map((d: {name: string}) => {
    try { return loadSkill(d.name, join(skillsDir, d.name)); } catch { return null; }
  }).filter(Boolean);
}

export function composeSkills(skills: Skill[]): string {
  return skills.map((s) => s.definition.prompt).join('\n\n');
}

function parseSkillYaml(content: string): SkillDefinition {
  const name = content.match(/name:\s*(.+)/)?.[1]?.trim() || '';
  const version = content.match(/version:\s*(.+)/)?.[1]?.trim() || '0.1.0';
  const type = content.match(/type:\s*(.+)/)?.[1]?.trim() || 'rule';
  const priority = parseInt(content.match(/priority:\s*(\d+)/)?.[1] || '10');
  const prompt = content.match(/prompt:\s*(.+)/)?.[1]?.trim() || '';
  return { name, version, type, priority, prompt };
}
