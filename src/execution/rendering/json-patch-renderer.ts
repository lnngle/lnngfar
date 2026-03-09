import { VariableContext, JsonPatchRule } from '../contracts/generation-plan';

function parseJsonPath(path: string): string[] {
  const withoutRoot = path.startsWith('$.') ? path.slice(2) : path;
  const segments: string[] = [];
  let current = '';
  let inQuote = false;
  let quotedSegment = false;

  for (let i = 0; i < withoutRoot.length; i += 1) {
    const ch = withoutRoot[i];
    if (ch === '"') {
      inQuote = !inQuote;
      if (!inQuote) {
        quotedSegment = true;
      }
      continue;
    }

    if (ch === '.' && !inQuote) {
      if (current.length > 0 || quotedSegment) {
        segments.push(current);
        current = '';
        quotedSegment = false;
      }
      continue;
    }

    current += ch;
  }

  if (current.length > 0 || quotedSegment) {
    segments.push(current);
  }

  return segments;
}

function setJsonPathValue(target: Record<string, any>, path: string, value: string): void {
  const segments = parseJsonPath(path);
  let current: Record<string, any> = target;

  for (let i = 0; i < segments.length; i += 1) {
    const key = segments[i];
    const isLeaf = i === segments.length - 1;

    if (isLeaf) {
      current[key] = value;
      return;
    }

    if (current[key] === undefined || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }

    current = current[key];
  }
}

export function renderJsonPatch(content: string, rules: JsonPatchRule[], variables: VariableContext): string {
  const resolvedRules = rules.filter((rule) => variables[rule.variable] !== undefined);
  if (resolvedRules.length === 0) {
    return content;
  }

  let parsed: Record<string, any>;
  try {
    parsed = JSON.parse(content);
  } catch {
    return content;
  }

  for (const rule of resolvedRules) {
    const value = variables[rule.variable];
    if (value !== undefined) {
      setJsonPathValue(parsed, rule.path, value);
    }
  }

  return `${JSON.stringify(parsed, null, 2)}\n`;
}
