#!/usr/bin/env node
// lnngfar CLI entry point

import { Runtime } from '@lnngfar/runtime';
import { createLogger } from '@lnngfar/logger';
import { LogLevel } from '@lnngfar/types';
import { registry } from './registry';
import { initCommand } from './commands/init';
import { stubs } from './commands/stubs';
import { handleStack } from './commands/stack';
import type { Command } from './registry';

const logger = createLogger('cli', LogLevel.INFO);

async function main(): Promise<void> {
  const rt = new Runtime();

  // Register as a Runtime module
  rt.registerModule({
    name: 'cli',
    init: async () => {
      registry.register(initCommand);
      registry.register({ meta: { name: 'stack', description: 'Manage stacks' }, handle: handleStack } as Command);
      for (const stub of stubs) registry.register(stub);
      logger.info('CLI commands registered');
    },
    shutdown: async () => logger.info('CLI shutting down'),
  });

  // Boot runtime (initializes all modules)
  await rt.boot();

  // Parse and run command
  const args = process.argv.slice(2);
  const code = await registry.run(args);

  await rt.shutdown();
  process.exit(code);
}

main().catch((err) => {
  logger.error(`Fatal: ${err}`);
  process.exit(1);
});
