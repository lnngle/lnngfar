import fs from 'fs-extra';
import path from 'node:path';
import { createRequire } from 'node:module';
import { toBlueprintName } from './blueprint-name-mapper';

export interface DiscoveredBlueprint {
  packageName: string;
  blueprintName: string;
  rootPath: string;
}

function getRepoRoot(startDir: string): string {
  let current = path.resolve(startDir);
  while (true) {
    if (fs.existsSync(path.join(current, 'package.json'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return startDir;
    }
    current = parent;
  }
}

function getDependencyNames(projectRoot: string): string[] {
  const pkgPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    return [];
  }

  const pkg = fs.readJsonSync(pkgPath) as Record<string, any>;
  const deps = Object.keys(pkg.dependencies ?? {});
  const devDeps = Object.keys(pkg.devDependencies ?? {});
  const optionalDeps = Object.keys(pkg.optionalDependencies ?? {});
  return [...new Set([...deps, ...devDeps, ...optionalDeps])];
}

function resolveInstalledPackageRoot(projectRoot: string, packageName: string): string | null {
  try {
    const req = createRequire(path.join(projectRoot, 'package.json'));
    const manifestPath = req.resolve(`${packageName}/package.json`);
    return path.dirname(manifestPath);
  } catch {
    return null;
  }
}

function scanBuiltInBlueprintDirs(baseDir: string): string[] {
  if (!fs.existsSync(baseDir)) {
    return [];
  }

  const result: string[] = [];
  const stack = [baseDir];

  while (stack.length > 0) {
    const current = stack.pop() as string;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const absolute = path.join(current, entry.name);
      if (entry.name.startsWith('lnngfar-blueprint-')) {
        result.push(absolute);
      }
      stack.push(absolute);
    }
  }

  return result;
}

function resolveBuiltInPackageRoot(projectRoot: string, packageName: string): string | null {
  const candidates = scanBuiltInBlueprintDirs(path.join(projectRoot, 'blueprints'));
  return candidates.find((item) => path.basename(item) === packageName) ?? null;
}

export function resolveBlueprints(projectRoot = process.cwd()): DiscoveredBlueprint[] {
  const root = getRepoRoot(projectRoot);
  const dependencyNames = getDependencyNames(root).filter((item) => item.startsWith('lnngfar-blueprint-'));
  const builtIns = scanBuiltInBlueprintDirs(path.join(root, 'blueprints')).map((item) => path.basename(item));

  const allNames = [...new Set([...dependencyNames, ...builtIns])];
  const resolved: DiscoveredBlueprint[] = [];

  for (const packageName of allNames) {
    const blueprintName = toBlueprintName(packageName);
    if (!blueprintName) {
      continue;
    }

    const builtInPath = resolveBuiltInPackageRoot(root, packageName);
    const installedPath = resolveInstalledPackageRoot(root, packageName);
    const rootPath = builtInPath ?? installedPath;

    if (!rootPath) {
      continue;
    }

    resolved.push({
      packageName,
      blueprintName,
      rootPath
    });
  }

  return resolved;
}

export function resolveBlueprintByName(name: string, projectRoot = process.cwd()): DiscoveredBlueprint | null {
  const blueprints = resolveBlueprints(projectRoot);
  return blueprints.find((item) => item.blueprintName === name) ?? null;
}
