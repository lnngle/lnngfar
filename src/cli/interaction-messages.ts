export interface CliInteractionMessages {
  projectNamePrompt: (defaultName: string) => string;
  projectNameInvalid: string;
  projectNameFallback: (defaultName: string) => string;
}

export const cliInteractionMessagesByLocale: Record<string, CliInteractionMessages> = {
  en: {
    projectNamePrompt: (defaultName: string) => `Enter project name (default: ${defaultName}): `,
    projectNameInvalid: "Invalid project name. Use letters, numbers, '-' or '_' only.",
    projectNameFallback: (defaultName: string) => `Too many invalid attempts. Fallback to default project name: ${defaultName}`
  }
};

export function getCliInteractionMessages(locale = process.env.LNNGFAR_CLI_LOCALE || 'en'): CliInteractionMessages {
  return cliInteractionMessagesByLocale[locale] ?? cliInteractionMessagesByLocale.en;
}
