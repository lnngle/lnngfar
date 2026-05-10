// Stub commands for future phases

import type { Command } from '../registry';

export const stubs: Command[] = [
  { meta: { name: 'stack', description: 'Manage stacks', phase: 4 }, handle: async () => {} },
  { meta: { name: 'spec', description: 'Parse and generate specs', phase: 6 }, handle: async () => {} },
  { meta: { name: 'ai', description: 'AI-assisted development', phase: 8 }, handle: async () => {} },
  { meta: { name: 'verify', description: 'Run verification', phase: 10 }, handle: async () => {} },
  { meta: { name: 'deploy', description: 'Deploy project', phase: 12 }, handle: async () => {} },
];
