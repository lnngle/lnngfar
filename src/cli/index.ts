import { Command } from 'commander';
import { executePipeline } from '../core/pipeline';
import { printFailure, printStage, printSuccess } from './output';
import { PipelineError } from '../errors/stage-error';
import { ErrorCodes } from '../errors/error-codes';
import { resolveProjectName } from './project-name';

function parseAiSkillsOption(raw: string | undefined): boolean {
  const normalized = (raw ?? '').trim().toLowerCase();
  if (['yes', 'y', 'true', '1', 'on'].includes(normalized)) {
    return true;
  }

  if (['no', 'n', 'false', '0', 'off'].includes(normalized)) {
    return false;
  }

  throw new Error(`无效的 aiSkills 参数: ${raw}`);
}

export async function runCli(argv: string[]): Promise<number> {
  let blueprintName = '';
  let aiSkills: boolean | undefined;
  const aiSkillsOptionSpecified = argv.includes('--ai-skills');

  const program = new Command();
  program
    .name('lnngfar')
    .argument('<blueprint>', 'Blueprint 名称')
    .option('--ai-skills <value>', '是否生成 AI skills（yes/no，默认 no；不传按 blueprint 规范）', 'no')
    .action((name: string) => {
      blueprintName = name;
    })
    .exitOverride();

  try {
    program.parse(['node', 'lnngfar', ...argv], { from: 'node' });
  } catch (error) {
    const message = (error as Error).message || '命令行参数错误';
    printFailure({
      stage: 'blueprint',
      code: ErrorCodes.BLUEPRINT_NOT_FOUND,
      message,
      suggestion: '请使用 lnngfar <blueprint>'
    });
    return 1;
  }

  if (!blueprintName) {
    printFailure({
      stage: 'blueprint',
      code: ErrorCodes.BLUEPRINT_NOT_FOUND,
      message: '缺少 blueprint 参数',
      suggestion: '请使用 lnngfar <blueprint>'
    });
    return 1;
  }

  try {
    const opts = program.opts<{ aiSkills?: string }>();
    if (aiSkillsOptionSpecified) {
      aiSkills = parseAiSkillsOption(opts.aiSkills);
    }
  } catch (error) {
    printFailure({
      stage: 'blueprint',
      code: ErrorCodes.BLUEPRINT_NOT_FOUND,
      message: (error as Error).message,
      suggestion: '请使用 --ai-skills yes 或 --ai-skills no，或不传此参数使用 blueprint 默认'
    });
    return 1;
  }

  const projectName = await resolveProjectName(blueprintName);

  try {
    printStage('环境校验');
    printStage('Blueprint 发现加载');
    printStage('Blueprint 校验');
    printStage('生成执行');
    printStage('测试执行');

    const result = await executePipeline({
      blueprintName,
      projectName,
      aiSkills,
      cwd: process.cwd(),
      repoRoot: process.env.LNNGFAR_REPO_ROOT
    });

    printSuccess(`生成成功: ${result.blueprintName} -> ${result.outputDir}`);
    return 0;
  } catch (error) {
    if (error instanceof PipelineError) {
      printFailure(error.detail);
      return 1;
    }

    printFailure({
      stage: 'generation',
      code: ErrorCodes.UNKNOWN_ERROR,
      message: (error as Error).message,
      suggestion: '请检查日志后重试'
    });
    return 1;
  }
}

if (require.main === module) {
  runCli(process.argv.slice(2)).then((code) => {
    process.exit(code);
  });
}
