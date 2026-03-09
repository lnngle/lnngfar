import { VariableContext } from '../contracts/generation-plan';

export function renderTemplate(content: string, variables: VariableContext): string {
  let rendered = content;
  for (const [key, value] of Object.entries(variables)) {
    const token = `{{${key}}}`;
    rendered = rendered.split(token).join(value);
  }

  return rendered;
}
