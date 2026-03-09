import Ajv, { JSONSchemaType } from 'ajv';
import { BlueprintManifest } from '../core/contracts/blueprint-contract';
import { toBlueprintName } from '../discovery/blueprint-name-mapper';

interface ValidationResult {
  valid: boolean;
  manifest?: BlueprintManifest;
  errors: string[];
}

const schema: JSONSchemaType<BlueprintManifest> = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'packageName', 'version', 'description', 'target', 'language', 'engine', 'testFramework'],
  properties: {
    name: { type: 'string', minLength: 1 },
    packageName: { type: 'string', minLength: 1 },
    version: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    target: { type: 'string', minLength: 1 },
    language: { type: 'string', minLength: 1 },
    engine: { type: 'string', minLength: 1 },
    testFramework: { type: 'string', minLength: 1 },
    generatorEntry: { type: 'string', nullable: true },
    renderConfigEntry: { type: 'string', nullable: true }
  }
};

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

export function validateBlueprintManifest(raw: unknown): ValidationResult {
  const ok = validate(raw);
  if (!ok) {
    return {
      valid: false,
      errors: (validate.errors ?? []).map((item) => `${item.instancePath} ${item.message}`.trim())
    };
  }

  const manifest = raw as BlueprintManifest;
  const logicalName = toBlueprintName(manifest.packageName);
  const errors: string[] = [];

  if (!manifest.packageName.startsWith('lnngfar-blueprint-')) {
    errors.push('packageName 必须以 lnngfar-blueprint- 开头');
  }

  if (!logicalName || logicalName !== manifest.name) {
    errors.push('name 必须等于 packageName 去掉前缀后的名称');
  }

  return {
    valid: errors.length === 0,
    manifest,
    errors
  };
}
