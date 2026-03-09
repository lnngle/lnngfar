import { VariableContext } from '../contracts/generation-plan';

const TEMPLATE_TOKEN_REGEX = /\{\{([A-Za-z0-9_]+)\}\}/g;

export function renderTemplate(content: string, variables: VariableContext): string {
  if (!content.includes('{{')) {
    return content;
  }

  return content.replace(TEMPLATE_TOKEN_REGEX, (token, key: string) => {
    const value = variables[key];
    return value === undefined ? token : value;
  });
}
