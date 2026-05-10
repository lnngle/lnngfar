// @lnngfar/workspace-manager - 工作区管理

import { readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Workspace, PackageInfo, Project, CreateOptions } from '@lnngfar/types';
import { loadConfig } from '@lnngfar/config-loader';
import { createLogger } from '@lnngfar/logger';
import { LogLevel } from '@lnngfar/types';

const logger = createLogger('workspace-manager', LogLevel.INFO);

/** 加载 Monorepo 工作区 */
export function loadWorkspace(rootPath: string): Workspace {
  logger.info(`Loading workspace from ${rootPath}`);

  const packagesPath = resolve(rootPath, 'packages');
  const packages: PackageInfo[] = [];

  if (existsSync(packagesPath)) {
    const dirs = readdirSync(packagesPath, { withFileTypes: true });
    for (const dir of dirs) {
      if (dir.isDirectory()) {
        packages.push({
          name: dir.name,
          path: resolve(packagesPath, dir.name),
        });
      }
    }
  }

  let config = null;
  try {
    config = loadConfig(rootPath);
  } catch {
    logger.warn('No config file found in workspace root');
  }

  logger.info(`Found ${packages.length} packages`);
  return { root: rootPath, packages, config };
}

/** 创建新项目 */
export function createProject(name: string, opts: CreateOptions = {}): Project {
  const projectPath = resolve(process.cwd(), name);
  logger.info(`Creating project ${name} at ${projectPath}`);

  if (existsSync(projectPath)) {
    throw new Error(`Project directory already exists: ${projectPath}`);
  }

  mkdirSync(projectPath, { recursive: true });

  // 创建基本项目配置
  const config = {
    project: {
      name,
      description: opts.description || '',
      version: '0.1.0',
      created: new Date().toISOString().split('T')[0],
    },
    stack: {
      name: opts.stack || 'far-web-java',
      version: '1.0.0',
      source: 'official',
    },
  };

  writeFileSync(
    resolve(projectPath, 'lnngfar.config.json'),
    JSON.stringify(config, null, 2),
  );

  // 创建基础目录结构
  const dirs = ['specs/product', 'specs/domain', 'specs/api', '.lnngfar/ai', '.lnngfar/runtime'];
  for (const dir of dirs) {
    mkdirSync(resolve(projectPath, dir), { recursive: true });
  }

  logger.info(`Project ${name} created successfully`);
  return { name, path: projectPath, config };
}
