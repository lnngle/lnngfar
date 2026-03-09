import { BlueprintPackage } from '../../core/contracts/blueprint-contract';
import { VariableContext } from '../contracts/generation-plan';

export interface VariableResolveInput {
  blueprintPackage: BlueprintPackage;
  projectName: string;
}

export function resolveVariables(input: VariableResolveInput): VariableContext {
  const creatorVersion = process.env.LNNGFAR_COCOS_CREATOR_VERSION?.trim();
  const description = `${input.projectName} project`;

  const base: VariableContext = {
    PROJECT_NAME: input.projectName,
    PROJECT_DESCRIPTION: description,
    BLUEPRINT_NAME: input.blueprintPackage.manifest.name,
    BLUEPRINT_PACKAGE_NAME: input.blueprintPackage.manifest.packageName
  };

  if (creatorVersion) {
    base.CREATOR_VERSION = creatorVersion;
  }

  return base;
}
