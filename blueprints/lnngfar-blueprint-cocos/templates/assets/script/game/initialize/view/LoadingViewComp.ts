/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: bansomin
 * @LastEditTime: 2024-03-31 01:17:02
 */
import { _decorator } from "cc";
import { gui } from "db://oops-framework/core/gui/Gui";
import { LayerType } from "db://oops-framework/core/gui/layer/LayerEnum";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCViewVM } from "db://oops-framework/module/common/CCViewVM";
import { DemoViewComp } from "../../account/view/DemoViewComp";
import { smc } from "../../common/SingletonModuleComp";
import { logger } from "../../common/utils/Logger";
import { ResourceLoader } from "../../../framework/ResourceLoader";
import { LoadingProgressPresenter, LoadingViewData } from "../components/LoadingProgressPresenter";
import { Initialize } from "../Initialize";
import { LoadingLayoutController } from "../layouts/LoadingLayoutController";

const { ccclass } = _decorator;
const GAME_LOAD_TIMEOUT_MS = 20000;
const GAME_LOAD_RETRY_COUNT = 2;
const GAME_LOAD_DIRS: readonly string[] = ["game"];

/** 游戏资源加载 */
@ccclass('LoadingViewComp')
@ecs.register('LoadingView', false)
@gui.register('LoadingView', { layer: LayerType.UI, prefab: "gui/layouts/loading/loading" })
export class LoadingViewComp extends CCViewVM<Initialize> {
    /** VM 组件绑定数据 */
    data: LoadingViewData = {
        /** 加载资源当前进度 */
        finished: 0,
        /** 加载资源最大进度 */
        total: 0,
        /** 加载资源进度比例值 */
        progress: "0.00",
        /** 加载流程中提示文本 */
        prompt: ""
    };

    private readonly presenter = new LoadingProgressPresenter(this.data);
    private readonly resourceLoader = new ResourceLoader();
    private readonly layoutController = new LoadingLayoutController(
        GAME_LOAD_DIRS,
        GAME_LOAD_TIMEOUT_MS,
        GAME_LOAD_RETRY_COUNT,
        this.resourceLoader,
    );

    start() {
        this.enter();
    }

    enter() {
        this.loadRes();
    }

    /** 加载资源 */
    private async loadRes(): Promise<void> {
        this.presenter.reset();
        this.loadCustom();

        try {
            await this.loadGameRes();
            await this.onCompleteCallback();
        } catch (error) {
            this.onLoadFailed(error);
        }
    }

    /** 加载游戏本地JSON数据（自定义内容） */
    private loadCustom(): void {
        this.presenter.showPromptByLang("loading_load_json");
    }

    /** 加载初始游戏内容资源 */
    private async loadGameRes(): Promise<void> {
        this.presenter.showPromptByLang("loading_load_game");
        await this.layoutController.load((finished, total) => {
            this.presenter.updateProgress(finished, total);
        });
    }

    /** 加载完成事件 */
    private async onCompleteCallback() {
        this.presenter.showPromptByLang("loading_load_player");
        await smc.account.addUi(DemoViewComp);
        this.remove();
    }

    private onLoadFailed(error: unknown): void {
        this.layoutController.markFailed(error);
        logger.debug("[LoadingViewComp] 当前加载状态", Array.from(this.layoutController.snapshot().entries()));
        this.presenter.setPrompt("资源加载失败，请检查网络后重试");
    }

    reset(): void { }
}