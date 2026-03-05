import fs from 'fs-extra';
import path from 'node:path';

export function validateBlueprintStructure(blueprintRootPath: string): string[] {
  const requiredItems = ['blueprint.json', 'templates', 'generators', 'tests', 'README.md'];
  const errors: string[] = [];

  for (const item of requiredItems) {
    const targetPath = path.join(blueprintRootPath, item);
    if (!fs.existsSync(targetPath)) {
      errors.push(`缺少必需项: ${item}`);
    }
  }

  return errors;
}
