import { GeneratedArtifact } from '../../core/contracts/blueprint-contract';
import { RenderPlan } from '../contracts/generation-plan';
import { renderJsonPatch } from './json-patch-renderer';
import { renderTemplate } from './template-renderer';

export function renderPlan(plan: RenderPlan): GeneratedArtifact[] {
  return plan.artifacts.map((artifact) => {
    if (artifact.contentEncoding === 'base64' || artifact.renderMode === 'passthrough') {
      return {
        path: artifact.path,
        content: artifact.content,
        contentEncoding: artifact.contentEncoding
      };
    }

    if (artifact.renderMode === 'json-patch') {
      return {
        path: artifact.path,
        content: renderJsonPatch(artifact.content, artifact.jsonPatchRules ?? [], plan.variables),
        contentEncoding: artifact.contentEncoding
      };
    }

    return {
      path: artifact.path,
      content: renderTemplate(artifact.content, plan.variables),
      contentEncoding: artifact.contentEncoding
    };
  });
}
