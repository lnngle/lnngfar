export function toBlueprintName(packageName: string): string | null {
  const prefix = 'lnngfar-blueprint-';
  if (!packageName.startsWith(prefix)) {
    return null;
  }

  const name = packageName.slice(prefix.length);
  return name.length > 0 ? name : null;
}

export function toPackageName(blueprintName: string): string {
  return `lnngfar-blueprint-${blueprintName}`;
}
