import { cliInteractionMessagesByLocale, getCliInteractionMessages } from '../../src/cli/interaction-messages';

describe('interaction-messages', () => {
  test('默认返回英文文案', () => {
    const previous = process.env.LNNGFAR_CLI_LOCALE;
    delete process.env.LNNGFAR_CLI_LOCALE;

    try {
      const messages = getCliInteractionMessages();
      expect(messages).toBe(cliInteractionMessagesByLocale.en);
      expect(messages.projectNamePrompt('demo')).toContain('demo');
    } finally {
      if (previous === undefined) {
        delete process.env.LNNGFAR_CLI_LOCALE;
      } else {
        process.env.LNNGFAR_CLI_LOCALE = previous;
      }
    }
  });

  test('未知 locale 回退到英文', () => {
    const messages = getCliInteractionMessages('zh-CN');
    expect(messages).toBe(cliInteractionMessagesByLocale.en);
  });
});
