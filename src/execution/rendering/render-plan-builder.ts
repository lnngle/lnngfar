import { RawGeneratedArtifact, RenderConfig, RenderPlan, VariableContext } from '../contracts/generation-plan';
import nodePath from 'node:path';

const COMMON_BINARY_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.bmp',
  '.ico',
  '.mp3',
  '.ogg',
  '.wav',
  '.flac',
  '.ttf',
  '.otf',
  '.woff',
  '.woff2',
  '.bin',
  '.zip',
  '.7z',
  '.pdf'
]);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function globToRegExp(pattern: string): RegExp {
  let normalized = escapeRegExp(pattern.replace(/\\/g, '/'));
  normalized = normalized.replace(/\*\*/g, '::DOUBLE_STAR::');
  normalized = normalized.replace(/\*/g, '[^/]*');
  normalized = normalized.replace(/::DOUBLE_STAR::/g, '.*');
  return new RegExp(`^${normalized}$`);
}

function compilePatterns(patterns: string[] | undefined): RegExp[] {
  if (!patterns || patterns.length === 0) {
    return [];
  }

  return patterns
    .filter((pattern) => pattern !== '**' && pattern !== '**/*')
    .map((pattern) => globToRegExp(pattern));
}

function hasMatchAllPattern(patterns: string[] | undefined): boolean {
  if (!patterns || patterns.length === 0) {
    return false;
  }

  return patterns.includes('**') || patterns.includes('**/*');
}

function matchCompiledPatterns(value: string, compiled: RegExp[], matchAll: boolean): boolean {
  if (matchAll) {
    return true;
  }

  if (compiled.length === 0) {
    return false;
  }

  const normalized = value.replace(/\\/g, '/');
  return compiled.some((regexp) => regexp.test(normalized));
}

function normalizeContentEncoding(value: RawGeneratedArtifact['contentEncoding']): 'utf-8' | 'base64' {
  return value === 'base64' ? 'base64' : 'utf-8';
}

export function buildRenderPlan(
  artifacts: RawGeneratedArtifact[],
  variables: VariableContext,
  renderConfig: RenderConfig
): RenderPlan {
  const templatePatternsCompiled = compilePatterns(renderConfig.templatePatterns ?? ['**/*']);
  const passthroughPatternsCompiled = compilePatterns(renderConfig.passthroughPatterns);
  const templateMatchAll = hasMatchAllPattern(renderConfig.templatePatterns ?? ['**/*']);
  const passthroughMatchAll = hasMatchAllPattern(renderConfig.passthroughPatterns);

  const planned = artifacts.map((artifact) => {
    const filePath = artifact.path.replace(/\\/g, '/');
    const contentEncoding = normalizeContentEncoding(artifact.contentEncoding);
    const ext = nodePath.extname(filePath).toLowerCase();

    if (contentEncoding === 'base64') {
      return {
        path: filePath,
        content: artifact.content,
        contentEncoding,
        renderMode: 'passthrough' as const
      };
    }

    if (COMMON_BINARY_EXTENSIONS.has(ext)) {
      return {
        path: filePath,
        content: artifact.content,
        contentEncoding,
        renderMode: 'passthrough' as const
      };
    }

    const jsonPatchRules = renderConfig.jsonPatch?.[filePath];
    if (jsonPatchRules && jsonPatchRules.length > 0) {
      return {
        path: filePath,
        content: artifact.content,
        contentEncoding,
        renderMode: 'json-patch' as const,
        jsonPatchRules
      };
    }

    if (matchCompiledPatterns(filePath, passthroughPatternsCompiled, passthroughMatchAll)) {
      return {
        path: filePath,
        content: artifact.content,
        contentEncoding,
        renderMode: 'passthrough' as const
      };
    }

    const templateMatched = matchCompiledPatterns(filePath, templatePatternsCompiled, templateMatchAll);
    return {
      path: filePath,
      content: artifact.content,
      contentEncoding,
      renderMode: templateMatched ? ('template' as const) : ('passthrough' as const)
    };
  });

  return {
    artifacts: planned,
    variables
  };
}
