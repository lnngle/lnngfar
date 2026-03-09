import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { getCliInteractionMessages } from './interaction-messages';

const PROJECT_NAME_PATTERN = /^[A-Za-z0-9_-]+$/;
const MAX_RETRY = 3;

export function getDefaultProjectName(blueprintName: string): string {
  return `${blueprintName}-project`;
}

export function isValidProjectName(value: string): boolean {
  return PROJECT_NAME_PATTERN.test(value);
}

export async function resolveProjectName(blueprintName: string): Promise<string> {
  const defaultName = getDefaultProjectName(blueprintName);

  if (!stdin.isTTY || !stdout.isTTY) {
    return defaultName;
  }

  const messages = getCliInteractionMessages();
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    for (let i = 0; i < MAX_RETRY; i += 1) {
      const answer = (await rl.question(messages.projectNamePrompt(defaultName))).trim();
      if (!answer) {
        return defaultName;
      }

      if (isValidProjectName(answer)) {
        return answer;
      }

      stdout.write(`${messages.projectNameInvalid}\n`);
    }

    stdout.write(`${messages.projectNameFallback(defaultName)}\n`);
    return defaultName;
  } finally {
    rl.close();
  }
}
