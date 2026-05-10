import { describe, it, expect } from 'vitest';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadConfig, validateConfig } from '../src/index';

const testDir = resolve(__dirname, '../tmp');

function setupTestDir(): string {
  rmSync(testDir, { recursive: true, force: true });
  mkdirSync(testDir, { recursive: true });
  return testDir;
}

const validConfig = {
  project: { name: 'test', description: 'test project', version: '0.1.0', created: '2026-01-01' },
  stack: { name: 'far-web-java', version: '1.0.0', source: 'official' },
};

describe('loadConfig', () => {
  it('should load config from lnngfar.config.json', () => {
    const dir = setupTestDir();
    writeFileSync(resolve(dir, 'lnngfar.config.json'), JSON.stringify(validConfig));
    const config = loadConfig(dir);
    expect(config.project.name).toBe('test');
  });

  it('should throw when no config file exists', () => {
    const dir = setupTestDir();
    expect(() => loadConfig(dir)).toThrow('No config file found');
  });

  it('should load config from .lnngfar/project.yml', () => {
    const dir = setupTestDir();
    mkdirSync(resolve(dir, '.lnngfar'), { recursive: true });
    writeFileSync(
      resolve(dir, '.lnngfar/project.yml'),
      `project.name: test\nproject.version: "0.1.0"\nstack.name: far-web-java\nstack.source: official`,
    );
    // simple yaml parser result
    const config = loadConfig(dir);
    expect(config.project.name).toBe('test');
  });
});

describe('validateConfig', () => {
  it('should pass valid config', () => {
    expect(validateConfig(validConfig)).toBe(true);
  });

  it('should throw on missing project', () => {
    expect(() => validateConfig({ stack: validConfig.stack })).toThrow('project');
  });

  it('should throw on missing stack', () => {
    expect(() => validateConfig({ project: validConfig.project })).toThrow('stack');
  });

  it('should throw on non-object', () => {
    expect(() => validateConfig(null)).toThrow('object');
    expect(() => validateConfig('string')).toThrow('object');
  });
});
