import { _decorator, Component, Label, Node, profiler } from 'cc';
import { DEBUG } from 'cc/env';
import { smc } from './game/common/SingletonModuleComp';
import { UIConfigData } from './game/common/config/GameUIConfig';
import { Initialize } from './game/initialize/Initialize';

const { ccclass, property } = _decorator;

interface OopsGuiLike {
  init?: (config: unknown) => void;
  open?: (uiId: string) => void;
}

interface OopsFrameworkLike {
  gui?: OopsGuiLike;
}

@ccclass('Main')
export class Main extends Component {
  @property(Node)
  public game: Node | null = null;

  @property(Node)
  public gui: Node | null = null;

  protected start(): void {
    if (DEBUG) {
      profiler.showStats();
    }

    this.bootstrap();
  }

  private bootstrap(): void {
    const oops = this.resolveOopsFramework();
    if (oops) {
      this.bootWithOops(oops);
      return;
    }

    this.bootFallback();
  }

  private resolveOopsFramework(): OopsFrameworkLike | null {
    const candidate = (globalThis as { oops?: unknown }).oops;
    if (!candidate || typeof candidate !== 'object') {
      return null;
    }

    return candidate as OopsFrameworkLike;
  }

  private bootWithOops(oops: OopsFrameworkLike): void {
    this.runBootStages(oops);

    this.renderBootstrapText('oops-framework 启动成功');
  }

  private bootFallback(): void {
    this.runBootStages(null);
    this.renderBootstrapText('fallback 模式启动成功');
  }

  private runBootStages(oops: OopsFrameworkLike | null): void {
    this.initializeResources();
    this.initializeUi(oops);
    this.openFirstScreen(oops);
  }

  protected initializeResources(): void {
    smc.initialize = new Initialize();
    smc.initialize.run();
  }

  protected initializeUi(oops: OopsFrameworkLike | null): void {
    if (!oops) {
      return;
    }

    oops.gui?.init?.(UIConfigData);
  }

  protected openFirstScreen(oops: OopsFrameworkLike | null): void {
    if (!oops || !UIConfigData.bootUI) {
      return;
    }

    oops.gui?.open?.(UIConfigData.bootUI);
  }

  private renderBootstrapText(text: string): void {
    if (!this.gui) {
      return;
    }

    let labelNode = this.gui.getChildByName('BootLabel');
    if (!labelNode) {
      labelNode = new Node('BootLabel');
      this.gui.addChild(labelNode);
    }

    let label = labelNode.getComponent(Label);
    if (!label) {
      label = labelNode.addComponent(Label);
    }

    label.string = text;
    label.fontSize = 28;
    label.lineHeight = 32;
  }
}
