import { RawGeneratedArtifact, RenderConfig, RenderPlan, VariableContext } from '../contracts/generation-plan';

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

function matchPatterns(value: string, patterns: string[] | undefined): boolean {
  if (!patterns || patterns.length === 0) {
    return false;
  }

  const normalized = value.replace(/\\/g, '/');
  return patterns.some((pattern) => {
    if (pattern === '**' || pattern === '**/*') {
      return true;
    }

    return globToRegExp(pattern).test(normalized);
  });
}

function normalizeContentEncoding(value: RawGeneratedArtifact['contentEncoding']): 'utf-8' | 'base64' {
  return value === 'base64' ? 'base64' : 'utf-8';
}

export function buildRenderPlan(
  artifacts: RawGeneratedArtifact[],
  variables: VariableContext,
  renderConfig: RenderConfig
): RenderPlan {
  const planned = artifacts.map((artifact) => {
    const path = artifact.path.replace(/\\/g, '/');
    const contentEncoding = normalizeContentEncoding(artifact.contentEncoding);

    if (contentEncoding === 'base64') {
      return {
        path,
        content: artifact.content,
        contentEncoding,
        renderMode: 'passthrough' as const
      };
    }

    const jsonPatchRules = renderConfig.jsonPatch?.[path];
    if (jsonPatchRules && jsonPatchRules.length > 0) {
      return {
        path,
        content: artifact.content,
        contentEncoding,
        renderMode: 'json-patch' as const,
        jsonPatchRules
      };
    }

    if (matchPatterns(path, renderConfig.passthroughPatterns)) {
      return {
        path,
        content: artifact.content,
        contentEncoding,
        renderMode: 'passthrough' as const
      };
    }

    const templateMatched = matchPatterns(path, renderConfig.templatePatterns ?? ['**/*']);
    return {
      path,
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
