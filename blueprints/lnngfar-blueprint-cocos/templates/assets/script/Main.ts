/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-05 18:25:56
 */
import { _decorator, game, profiler } from 'cc';
import { DEBUG } from 'cc/env';
import { Root } from 'db://oops-framework/core/Root';
import { ecs } from 'db://oops-framework/libs/ecs/ECS';
import { guiAdapter } from './framework/oops';
import { Account } from './game/account/Account';
import { RuntimeConfigService } from './game/common/config/RuntimeConfigService';
import { smc } from './game/common/SingletonModuleComp';
import { UIConfigData } from './game/common/config/GameUIConfig';
import { logger } from './game/common/utils/Logger';
import { BootstrapPipeline } from './game/initialize/bootstrap/BootstrapPipeline';
import { Initialize } from './game/initialize/Initialize';

const { ccclass } = _decorator;

@ccclass('Main')
export class Main extends Root {
    start() {
        void RuntimeConfigService.preload()
            .catch((error) => {
                logger.warn('[Main] 运行时配置预加载失败，回退默认配置', error);
            })
            .finally(() => {
                const resolved = RuntimeConfigService.getResolved();
                if (resolved != null) {
                    game.frameRate = resolved.envConfig.frameRate;
                    logger.info(`[Main] 当前环境: ${resolved.env} (${resolved.source})`);
                }

                if (RuntimeConfigService.shouldShowProfiler(DEBUG)) {
                    profiler.showStats();
                }
            });
    }

    protected run() {
        const pipeline = new BootstrapPipeline();

        pipeline
            .addStage('配置预热', async () => {
                try {
                    await RuntimeConfigService.preload();
                } catch (error) {
                    logger.warn('[Main] 配置预热失败，继续执行启动流程', error);
                }
            })
            .addStage('模块绑定', () => {
                smc.bindModules(
                    ecs.getEntity<Initialize>(Initialize),
                    ecs.getEntity<Account>(Account),
                );
            })
            .addStage('GUI 初始化', () => {
                guiAdapter.init(UIConfigData);
            });

        pipeline.run();
    }

    protected initGui() {
        // 启动管线接管 GUI 初始化。
    }

    // protected initEcsSystem() {
    //     oops.ecs.add(new EcsInitializeSystem());
    // }
}
