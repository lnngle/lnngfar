// lnngfar stack command

import { installStack, listStacks, loadStack } from '@lnngfar/stack';

export { installStack, listStacks, loadStack };

export async function handleStack(args: string[]): Promise<void> {
  const sub = args[0];
  if (!sub || sub === '--help') {
    console.log('Usage: lnngfar stack <add|list|info>');
    return;
  }

  switch (sub) {
    case 'add': {
      const name = args[1];
      if (!name) { console.log('Usage: lnngfar stack add <name> <path>'); return; }
      const source = args[2] || `./stacks/${name}`;
      const s = installStack(name, source);
      console.log(`✓ Stack "${s.definition.name}@${s.definition.version}" installed`);
      break;
    }
    case 'list': {
      const stacks = listStacks();
      if (stacks.length === 0) { console.log('No stacks installed.'); return; }
      for (const s of stacks) {
        console.log(`  ${s.definition.name}@${s.definition.version} - ${s.definition.description || ''}`);
      }
      break;
    }
    case 'info': {
      const name = args[1];
      if (!name) { console.log('Usage: lnngfar stack info <name>'); return; }
      const s = loadStack(name);
      console.log(`Name:    ${s.definition.name}`);
      console.log(`Version: ${s.definition.version}`);
      console.log(`Type:    ${s.definition.type || 'N/A'}`);
      console.log(`Path:    ${s.path}`);
      break;
    }
    default:
      console.log(`Unknown: lnngfar stack ${sub}`);
  }
}
