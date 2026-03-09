import { logger } from "../../common/utils/Logger";

export class DemoLayoutController {
    enter(): void {
        logger.debug("[DemoLayoutController] Demo 布局已激活");
    }

    exit(): void {
        logger.debug("[DemoLayoutController] Demo 布局已释放");
    }
}
