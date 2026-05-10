// @lnngfar/cli - Command Registry

export interface CommandMeta {
  name: string;
  description: string;
  phase?: number; // P{N} phase, undefined = implemented now
}

export interface Command {
  meta: CommandMeta;
  handle: (args: string[]) => Promise<void>;
}

class CommandRegistry {
  private commands = new Map<string, Command>();

  register(command: Command): void {
    if (this.commands.has(command.meta.name)) {
      throw new Error(`Command "${command.meta.name}" already registered`);
    }
    this.commands.set(command.meta.name, command);
  }

  get(name: string): Command | undefined {
    return this.commands.get(name);
  }

  unregister(name: string): void {
    this.commands.delete(name);
  }

  list(): CommandMeta[] {
    return Array.from(this.commands.values()).map((c) => c.meta);
  }

  async run(rawArgs: string[]): Promise<number> {
    const [name, ...args] = rawArgs;

    if (!name || name === '--help' || name === '-h') {
      return this.showHelp();
    }

    const cmd = this.commands.get(name);
    if (!cmd) {
      console.error(`Unknown command: ${name}\nRun 'lnngfar --help' for usage.`);
      return 1;
    }

    if (cmd.meta.phase !== undefined) {
      console.log(`lnngfar ${name}: 将在 P${cmd.meta.phase} 阶段实现`);
      return 0;
    }

    try {
      await cmd.handle(args);
      return 0;
    } catch (err) {
      console.error(`Error: ${err instanceof Error ? err.message : err}`);
      return 1;
    }
  }

  private showHelp(): number {
    console.log('lnngfar - AI-native industrial software engineering platform\n');
    console.log('Commands:');
    for (const meta of this.list()) {
      const status = meta.phase !== undefined ? `(P${meta.phase})` : '';
      console.log(`  ${meta.name.padEnd(12)} ${meta.description} ${status}`.trimEnd());
    }
    return 0;
  }
}

export const registry = new CommandRegistry();
