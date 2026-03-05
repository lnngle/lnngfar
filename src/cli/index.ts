import { Command } from 'commander';
import { executePipeline } from '../core/pipeline';
import { printFailure, printStage, printSuccess } from './output';
import { PipelineError } from '../errors/stage-error';
import { ErrorCodes } from '../errors/error-codes';

export async function runCli(argv: string[]): Promise<number> {
  let blueprintName = '';

  const program = new Command();
  program
    .name('lnngfar')
    .argument('<blueprint>', 'Blueprint 名称')
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
    printStage('环境校验');
    printStage('Blueprint 发现加载');
    printStage('Blueprint 校验');
    printStage('生成执行');
    printStage('测试执行');

    const result = await executePipeline({
      blueprintName,
      cwd: process.cwd()
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
