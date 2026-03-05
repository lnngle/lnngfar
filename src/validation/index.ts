import fs from 'fs-extra';
import path from 'node:path';
import { BlueprintManifest, BlueprintPackage } from '../core/contracts/blueprint-contract';
import { validateBlueprintManifest } from './manifest-validator';
import { validateBlueprintStructure } from './structure-validator';

export interface BlueprintValidationResult {
  valid: boolean;
  errors: string[];
  blueprintPackage?: BlueprintPackage;
}

function resolveGeneratorEntry(blueprintRootPath: string, manifest: BlueprintManifest): string {
  const entryByManifest = manifest.generatorEntry ? path.join(blueprintRootPath, manifest.generatorEntry) : null;
  const tsEntry = path.join(blueprintRootPath, 'generators', 'index.ts');
  const jsEntry = path.join(blueprintRootPath, 'generators', 'index.js');

  if (entryByManifest && fs.existsSync(entryByManifest)) {
    return entryByManifest;
  }

  if (fs.existsSync(jsEntry)) {
    return jsEntry;
  }

  return tsEntry;
}

export function validateBlueprint(blueprintRootPath: string): BlueprintValidationResult {
  const errors = validateBlueprintStructure(blueprintRootPath);
  const manifestPath = path.join(blueprintRootPath, 'blueprint.json');

  if (!fs.existsSync(manifestPath)) {
    return {
      valid: false,
      errors: [...errors, '缺少 blueprint.json']
    };
  }

  const rawManifest = fs.readJsonSync(manifestPath);
  const manifestValidation = validateBlueprintManifest(rawManifest);
  if (!manifestValidation.valid || !manifestValidation.manifest) {
    return {
      valid: false,
      errors: [...errors, ...manifestValidation.errors]
    };
  }

  const manifest = manifestValidation.manifest;
  const blueprintPackage: BlueprintPackage = {
    manifest,
    rootPath: blueprintRootPath,
    templatesPath: path.join(blueprintRootPath, 'templates'),
    generatorsPath: path.join(blueprintRootPath, 'generators'),
    testsPath: path.join(blueprintRootPath, 'tests'),
    readmePath: path.join(blueprintRootPath, 'README.md'),
    generatorEntryPath: resolveGeneratorEntry(blueprintRootPath, manifest),
    status: errors.length === 0 ? 'validated' : 'rejected'
  };

  return {
    valid: errors.length === 0,
    errors,
    blueprintPackage
  };
}
