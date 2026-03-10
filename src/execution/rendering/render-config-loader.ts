import fs from 'fs-extra';
import path from 'node:path';
import { BlueprintPackage } from '../../core/contracts/blueprint-contract';
import { RenderConfig } from '../contracts/generation-plan';

const DEFAULT_RENDER_CONFIG: RenderConfig = {
  templatePatterns: ['**/*'],
  passthroughPatterns: [],
  jsonPatch: {
    'package.json': [
      { path: '$.name', variable: 'PROJECT_NAME' },
      { path: '$.description', variable: 'PROJECT_DESCRIPTION' }
    ],
    'package-lock.json': [
      { path: '$.name', variable: 'PROJECT_NAME' },
      { path: '$.packages."".name', variable: 'PROJECT_NAME' }
    ]
  }
};

export function loadRenderConfig(blueprintPackage: BlueprintPackage): RenderConfig {
  const entry = blueprintPackage.manifest.renderConfigEntry ?? 'render.config.json';
  const configPath = path.join(blueprintPackage.rootPath, entry);
  if (!fs.existsSync(configPath)) {
    return DEFAULT_RENDER_CONFIG;
  }

  const userConfig = fs.readJsonSync(configPath) as RenderConfig;
  return {
    ...DEFAULT_RENDER_CONFIG,
    ...userConfig,
    jsonPatch: {
      ...DEFAULT_RENDER_CONFIG.jsonPatch,
      ...(userConfig.jsonPatch ?? {})
    }
  };
}
