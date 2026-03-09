import { logger } from "../../common/utils/Logger";

export class DemoViewPresenter {
    onEnter(): void {
        logger.debug("[DemoViewPresenter] Demo 界面进入");
    }

    onExit(): void {
        logger.debug("[DemoViewPresenter] Demo 界面退出");
    }
}
