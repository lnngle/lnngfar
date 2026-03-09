/*
 * @Author: dgflash
 * @Date: 2022-07-22 17:06:22
 * @LastEditors: bansomin
 * @LastEditTime: 2024-03-31 01:20:18
 */
import { oops } from "db://oops-framework/core/Oops";
import { AsyncQueue, NextFunction } from "db://oops-framework/libs/collection/AsyncQueue";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { ResourceLoader } from "../../../framework/ResourceLoader";
import { RuntimeConfigService } from "../../common/config/RuntimeConfigService";
import { logger } from "../../common/utils/Logger";
import { Initialize } from "../Initialize";
import { LoadingViewComp } from "../view/LoadingViewComp";

const PRELOAD_DIRS: readonly string[] = ["common"];
const PRELOAD_RETRY_COUNT = 2;
const PRELOAD_TIMEOUT_MS = 15000;

/** 初始化游戏公共资源 */
@ecs.register('InitRes')
export class InitResComp extends ecs.Comp {
    reset() { }
}

/** 初始化资源逻辑注册到Initialize模块中 */
@ecs.register('Initialize')
export class InitResSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    private readonly resourceLoader = new ResourceLoader();

    filter(): ecs.IMatcher {
        return ecs.allOf(InitResComp);
    }

    entityEnter(e: Initialize): void {
        const queue = new AsyncQueue();

        // 加载多语言包加载多语言包
        this.loadLanguage(queue);
        // 加载公共资源
        this.loadCommon(queue);
        // 加载游戏内容加载进度提示界面
        this.onComplete(queue, e);

        queue.play();
    }

    /** 加载化语言包（可选） */
    private loadLanguage(queue: AsyncQueue) {
        queue.push((next: NextFunction) => {
            void this.prepareLanguage()
                .catch((error) => {
                    logger.error("[InitResSystem] 语言初始化失败", error);
                })
                .finally(() => {
                    next();
                });
        });
    }

    /** 加载公共资源（必备） */
    private loadCommon(queue: AsyncQueue) {
        queue.push((next: NextFunction) => {
            void this.preloadCommon()
                .catch((error) => {
                    logger.error("[InitResSystem] 公共资源预加载失败", error);
                })
                .finally(() => {
                    next();
                });
        });
    }

    /** 加载完成进入游戏内容加载界面 */
    private onComplete(queue: AsyncQueue, e: Initialize) {
        queue.complete = async () => {
            await e.addUi(LoadingViewComp);
            e.remove(InitResComp);
        };
    }

    private async prepareLanguage(): Promise<void> {
        await RuntimeConfigService.preload();
        RuntimeConfigService.ensureLanguagePathsValid();

        const language = RuntimeConfigService.resolveLanguage("zh");
        oops.storage.set("language", language);

        await new Promise<void>((resolve) => {
            oops.language.setLanguage(language, resolve);
        });
    }

    private async preloadCommon(): Promise<void> {
        for (const dir of PRELOAD_DIRS) {
            await this.resourceLoader.loadDirWithRetry({
                dir,
                timeoutMs: PRELOAD_TIMEOUT_MS,
                retryCount: PRELOAD_RETRY_COUNT,
            });
        }
    }
}