import { describe, it, expect } from 'vitest';
import { rmSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadWorkspace, createProject } from '../src/index';

const testDir = resolve(__dirname, '../tmp');

describe('loadWorkspace', () => {
  it('should load workspace with packages', () => {
    const ws = loadWorkspace(resolve(__dirname, '../../..'));
    expect(ws.root).toBeDefined();
    expect(ws.packages).toBeInstanceOf(Array);
    expect(ws.packages.length).toBeGreaterThan(0);
  });

  it('should handle empty workspace', () => {
    rmSync(testDir, { recursive: true, force: true });
    const ws = loadWorkspace(testDir);
    expect(ws.packages).toEqual([]);
    expect(ws.config).toBeNull();
  });
});

describe('createProject', () => {
  it('should create a new project directory', () => {
    rmSync(testDir, { recursive: true, force: true });
    const project = createProject('my-test-app', {
      stack: 'far-web-java',
      description: 'Test project',
    });

    expect(project.name).toBe('my-test-app');
    expect(existsSync(project.path)).toBe(true);
    expect(existsSync(resolve(project.path, 'lnngfar.config.json'))).toBe(true);
    expect(existsSync(resolve(project.path, 'specs/product'))).toBe(true);
  });

  it('should throw if project already exists', () => {
    expect(() =>
      createProject('my-test-app', { stack: 'far-web-java' }),
    ).toThrow('already exists');
  });
});
