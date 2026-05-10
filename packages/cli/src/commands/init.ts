// lnngfar init command

import { createProject } from '@lnngfar/workspace-manager';
import type { Command } from '../registry';

export const initCommand: Command = {
  meta: {
    name: 'init',
    description: 'Initialize a new lnngfar project',
  },
  handle: async (args: string[]) => {
    const name = args[0];
    if (!name) {
      console.log('Usage: lnngfar init <project-name>');
      console.log('Example: lnngfar init my-app');
      return;
    }
    const project = createProject(name);
    console.log(`✓ Project "${project.name}" created at ${project.path}`);
    console.log(`  Next: cd ${name} && lnngfar spec parse`);
  },
};
